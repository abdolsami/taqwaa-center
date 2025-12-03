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

    // Validate the price ID matches one of our configured prices
    const validPrices = [
      process.env.PRICE_ID_MONTHLY,
      process.env.PRICE_ID_SEMI_ANNUAL,
      process.env.PRICE_ID_YEARLY,
    ];

    if (!validPrices.includes(priceId)) {
      return res.status(400).json({
        error: "Invalid price ID",
      });
    }

    // Initialize Stripe (deferred to avoid throwing at import time)
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Get frontend URL for success/cancel redirects
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    // Create Stripe Checkout Session with the selected subscription plan
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      // Single price selected by user from frontend
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${frontendUrl}/membership-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/membership-canceled`,
      // Collect billing address for Zapier integration
      billing_address_collection: "required",
      // Always create a customer so we have customer_email in webhook
      customer_creation: "always",
      // Allow promo codes
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          source: "taqwa-center-website",
        },
      },
      // Collect customer name and email
      customer_email: req.body.email || undefined,
    });

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
      const session = event.data.object;
      console.log("Checkout session completed:", session.id);

      // Extract data for Zapier integration
      const webhookData = {
        event_type: "checkout.session.completed",
        session_id: session.id,
        customer_email: session.customer_email,
        customer_name: session.customer_details?.name || null,
        line_items: session.line_items?.data || [],
        subscription_id: session.subscription,
        timestamp: new Date().toISOString(),
      };

      console.log(
        "Webhook data for Zapier:",
        JSON.stringify(webhookData, null, 2)
      );
      // Zapier webhook URL can be added here if needed
      break;
    }
    case "customer.subscription.created": {
      const subscription = event.data.object;
      console.log("Subscription created:", subscription.id);

      const subscriptionData = {
        event_type: "customer.subscription.created",
        subscription_id: subscription.id,
        customer_id: subscription.customer,
        price_id: subscription.items.data[0]?.price.id,
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
