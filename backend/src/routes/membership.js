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

    // Build Checkout session params
    const sessionParams = {
      payment_method_types: ["card"],
      line_items: priceIds.map((p) => ({ price: p, quantity: 1 })),
      mode: "subscription",
      success_url: `${frontendUrl}/membership-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/membership-canceled`,
      phone_number_collection: { enabled: true },
      billing_address_collection: "auto",
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
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

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
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.log("Checkout session completed (webhook):", session.id);

      try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
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

        // Retrieve subscription with expanded price and product data when available
        let subscription = null;
        if (fullSession.subscription) {
          subscription = await stripe.subscriptions.retrieve(
            fullSession.subscription,
            {
              expand: ["items.data.price.product", "items.data.price"],
            }
          );
        }

        // Extract customer details
        const customerName = fullSession.customer_details?.name || null;
        const customerEmail = fullSession.customer_details?.email || null;
        const customerPhone = fullSession.customer_details?.phone || null;
        const customerId = fullSession.customer || null;
        const subscriptionId =
          subscription?.id || fullSession.subscription || null;

        // Extract plan IDs and gather richer plan info (nickname, description, product name)
        let planIds = [];
        let planNicknames = [];
        let planDescriptions = [];
        let planProductNames = [];

        if (subscription) {
          planIds = subscription.items.data.map((it) => it.price.id);
          subscription.items.data.forEach((it) => {
            const price = it.price || {};
            const product = price.product || {};
            const nickname = price.nickname || null;
            const description = price.description || null;
            const productName = product.name || null;

            planNicknames.push(nickname || price.id);
            planDescriptions.push(description || "");
            planProductNames.push(productName || "");
          });
        } else {
          // For one-off line items (no subscription), fetch price objects to get descriptions/product
          const ids = lineItems.data.map((li) => li.price?.id).filter(Boolean);
          planIds = ids;
          if (ids.length) {
            const fetchedPrices = await Promise.all(
              ids.map((p) => stripe.prices.retrieve(p, { expand: ["product"] }))
            );
            fetchedPrices.forEach((price) => {
              const product = price.product || {};
              planNicknames.push(price.nickname || price.id);
              planDescriptions.push(price.description || "");
              planProductNames.push(product.name || "");
            });
          }
        }

        const paymentTimestamp = fullSession.created
          ? new Date(fullSession.created * 1000).toLocaleString("en-US")
          : new Date().toLocaleString("en-US");

        // Build webhook data with richer fields so Zapier can map reliably
        // Build a minimal, clean payload for Zapier (only fields Stripe Checkout provides)
        const zapierPayload = {
          name: customerName || "",
          email: customerEmail || "",
          phone: customerPhone || "",
          stripe_id: customerId || "",
          plan: planNicknames.join(", ") || "",
          date: paymentTimestamp || "",
        };

        console.log("Zapier payload:", JSON.stringify(zapierPayload, null, 2));

        // Forward to Zapier catch hook if configured via ZAPIER_WEBHOOK_URL
        const zapierUrl = process.env.ZAPIER_WEBHOOK_URL;
        if (zapierUrl) {
          try {
            // Use global fetch if available (Node 18+), otherwise dynamically import node-fetch
            let fetchFn = globalThis.fetch;
            if (!fetchFn) {
              const mod = await import("node-fetch");
              fetchFn = mod.default;
            }

            const resp = await fetchFn(zapierUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(zapierPayload),
            });

            if (!resp.ok) {
              const bodyText = await resp.text().catch(() => "<no body>");
              console.error(
                `Failed to forward to Zapier: ${resp.status} ${resp.statusText} - ${bodyText}`
              );
            } else {
              console.log("Forwarded webhook payload to Zapier successfully");
            }
          } catch (err) {
            console.error("Error forwarding webhook to Zapier:", err);
          }
        } else {
          console.warn(
            "ZAPIER_WEBHOOK_URL not configured; skipping forward to Zapier."
          );
        }
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
