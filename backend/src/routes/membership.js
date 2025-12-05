import express from "express";
import Stripe from "stripe";

const router = express.Router();

// Create membership checkout session for a selected plan
router.post("/create-membership-session", async (req, res) => {
  try {
    const { plan } = req.body;
    const priceMap = {
      monthly: process.env.STRIPE_PRICE_MONTHLY,
      six_months: process.env.STRIPE_PRICE_6M,
      yearly: process.env.STRIPE_PRICE_YEARLY,
    };
    const selectedPriceId = priceMap[plan];
    if (!selectedPriceId) {
      return res.status(400).json({ error: "Invalid plan selected" });
    }
    if (!process.env.STRIPE_SECRET_KEY) {
      return res
        .status(500)
        .json({ error: "Stripe secret key is not configured" });
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: selectedPriceId, quantity: 1 }],
      mode: "subscription",
      phone_number_collection: { enabled: true },
      customer_creation: "always",
      success_url: `${frontendUrl}/membership-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/membership-canceled`,
      billing_address_collection: "auto",
      ...(process.env.STRIPE_ENABLE_PROMO_CONSENT === "true"
        ? { consent_collection: { promotions: "auto" } }
        : {}),
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          source: "taqwa-center-website",
          plan,
        },
      },
    });
    res.json({ success: true, url: session.url, sessionId: session.id });
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

        // Retrieve subscription with expanded price data
        let subscription = null;
        if (fullSession.subscription) {
          subscription = await stripe.subscriptions.retrieve(
            fullSession.subscription,
            { expand: ["items.data.price"] }
          );
        }

        // Extract customer details
        const customerName = fullSession.customer_details?.name || "";
        const customerEmail = fullSession.customer_details?.email || "";
        const customerPhone = fullSession.customer_details?.phone || "";
        const customerId = fullSession.customer || "";

        // Extract plan (price ID of first subscription item)
        let plan = "";
        if (subscription && subscription.items.data.length > 0) {
          plan = subscription.items.data[0].price.id;
        }

        const paymentTimestamp = fullSession.created
          ? new Date(fullSession.created * 1000).toLocaleString("en-US")
          : new Date().toLocaleString("en-US");

        // Build minimal payload for Zapier
        const zapierPayload = {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          plan,
          stripe_id: customerId,
          date: paymentTimestamp,
        };

        console.log("Zapier payload:", JSON.stringify(zapierPayload, null, 2));

        // Forward to Zapier catch hook if configured via ZAPIER_WEBHOOK_URL
        const zapierUrl = process.env.ZAPIER_WEBHOOK_URL;
        if (zapierUrl) {
          try {
            let fetchFn = globalThis.fetch;
            if (!fetchFn) {
              const mod = await import("node-fetch");
              fetchFn = mod.default;
            }
            await fetchFn(zapierUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(zapierPayload),
            });
          } catch (err) {
            console.error("Error forwarding webhook to Zapier:", err);
          }
        }
      } catch (err) {
        console.error(
          "Error enhancing checkout.session.completed webhook:",
          err
        );
      }

      break;
    }

    // (Removed unused customer.subscription.created handler)

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
}

export default router;
