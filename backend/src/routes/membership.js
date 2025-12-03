import express from "express";
import Stripe from "stripe";

const router = express.Router();

// Create membership checkout session for a selected plan
router.post("/create-membership-session", async (req, res) => {
  try {
    const { priceId } = req.body;

    // Validate price ID was provided
    if (!priceId) {
      return res.status(400).json({
        error: "Price ID is required",
      });
    }

    // Validate required environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({
        error: "Stripe secret key is not configured",
      });
    }

    // (Validation moved below to allow array or single price handling)

    // Initialize Stripe (deferred to avoid throwing at import time)
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Get frontend URL for success/cancel redirects
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    // Support either a single priceId or an array of priceIds so Stripe can present
    // multiple selectable line items (only allowed when intervals match).
    const priceIds = Array.isArray(priceId) ? priceId : [priceId];

    // Validate provided price IDs are among our configured environment prices
    const validPrices = [
      process.env.PRICE_ID_MONTHLY,
      process.env.PRICE_ID_SEMI_ANNUAL,
      process.env.PRICE_ID_YEARLY,
    ].filter(Boolean);

    const invalid = priceIds.find((p) => !validPrices.includes(p));
    if (invalid) {
      return res.status(400).json({ error: "Invalid price ID provided" });
    }

    // If multiple prices provided, verify their billing intervals match.
    if (priceIds.length > 1) {
      const fetched = await Promise.all(
        priceIds.map((p) => stripe.prices.retrieve(p))
      );
      const intervals = fetched.map((f) => f.recurring?.interval || null);
      const uniqueIntervals = [...new Set(intervals)];
      if (uniqueIntervals.length > 1) {
        return res.status(400).json({
          error:
            "Cannot create a Checkout session with multiple prices that have different billing intervals. Make sure all selected prices share the same recurring interval.",
        });
      }
    }

    // Build Checkout session params. Note: `customer_creation` is only valid for
    // `payment` mode in Stripe; for subscription mode Stripe will create a
    // customer automatically. We still request `customer_update` so any fields
    // the customer edits in Checkout are saved back to the Stripe Customer.
    const sessionParams = {
      payment_method_types: ["card"],
      line_items: priceIds.map((p) => ({ price: p, quantity: 1 })),
      mode: "subscription",
      success_url: `${frontendUrl}/membership-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/membership-canceled`,
      // Collect contact and billing info inside Stripe Checkout
      phone_number_collection: { enabled: true },
      billing_address_collection: "auto",
      // `consent_collection.promotions` requires you to agree to Stripe's
      // Checkout Terms of Service in the Stripe Dashboard. Only include it
      // when explicitly enabled via env var to avoid runtime errors.
      ...(process.env.STRIPE_ENABLE_PROMO_CONSENT === "true"
        ? { consent_collection: { promotions: "auto" } }
        : {}),
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          source: "taqwa-center-website",
          plans: priceIds.join(","),
        },
      },
      // Phone is collected via `phone_number_collection` and is available on
      // `checkout.session.customer_details.phone` in the webhook.
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    // Return the checkout session URL
    res.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Stripe Checkout Session Error:", error);
    res.status(500).json({
      error: "Failed to create checkout session",
      message: error.message,
    });
  }
});

// Exported webhook handler — mounted with raw body middleware in server.js
export async function handleStripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn("Stripe webhook secret not configured");
    return res.status(400).send("Webhook secret not configured");
  }

  let event;

  try {
    // Instantiate Stripe here as well
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      // The event's session may be minimal; retrieve the full session and line items
      const session = event.data.object;
      console.log("Checkout session completed (webhook):", session.id);

      try {
        const fullSession = await stripe.checkout.sessions.retrieve(
          session.id,
          {
            expand: ["subscription", "customer"],
          }
        );

        const lineItems = await stripe.checkout.sessions.listLineItems(
          session.id,
          {
            limit: 10,
          }
        );

        // If a subscription was created, retrieve subscription items for price IDs
        let subscription = null;
        if (fullSession.subscription) {
          subscription = await stripe.subscriptions.retrieve(
            fullSession.subscription,
            {
              expand: ["items.data.price"],
            }
          );
        }

        // Map data for Zapier / Google Sheets
        const customerName = fullSession.customer_details?.name || null;
        const customerEmail = fullSession.customer_details?.email || null;
        const customerPhone = fullSession.customer_details?.phone || null;
        const customerId = fullSession.customer || null;
        const subscriptionId =
          subscription?.id || fullSession.subscription || null;
        const planIds = subscription
          ? subscription.items.data.map((it) => it.price.id)
          : lineItems.data.map((li) => li.price?.id).filter(Boolean);
        const paymentTimestamp = fullSession.created
          ? new Date(fullSession.created * 1000).toISOString()
          : new Date().toISOString();

        const webhookData = {
          event_type: "checkout.session.completed",
          session_id: fullSession.id,
          customer_id: customerId,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          plan_ids: planIds,
          subscription_id: subscriptionId,
          payment_timestamp: paymentTimestamp,
          raw_session: fullSession,
        };

        console.log(
          "Webhook data for Zapier:",
          JSON.stringify(webhookData, null, 2)
        );
        // TODO: POST webhookData to external Zapier URL if configured in env
      } catch (err) {
        console.error(
          "Error enhancing checkout.session.completed webhook:",
          err
        );
      }

      break;
    }

    case "customer.subscription.created": {
      const subscription = event.data.object;
      console.log("Subscription created:", subscription.id);

      const subscriptionData = {
        event_type: "customer.subscription.created",
        subscription_id: subscription.id,
        customer_id: subscription.customer,
        price_ids: subscription.items.data.map((i) => i.price.id),
        status: subscription.status,
        timestamp: new Date().toISOString(),
      };

      console.log(
        "Subscription data for Zapier:",
        JSON.stringify(subscriptionData, null, 2)
      );
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
}

export default router;
