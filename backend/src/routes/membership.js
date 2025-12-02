import express from 'express'
import Stripe from 'stripe'

const router = express.Router()

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Create membership checkout session
router.post('/create-membership-session', async (req, res) => {
  try {
    // Validate required environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({
        error: 'Stripe secret key is not configured'
      })
    }

    if (!process.env.STRIPE_PRICE_ID) {
      return res.status(500).json({
        error: 'Stripe price ID is not configured'
      })
    }

    // Get frontend URL for success/cancel redirects
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
    
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription', // Recurring subscription
      success_url: `${frontendUrl}/membership-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/membership-canceled`,
      metadata: {
        // Add any custom metadata you want to pass to Zapier
        source: 'taqwa-center-website',
        membership_type: 'standard',
      },
      // Customer email can be collected during checkout or passed here
      // customer_email: req.body.email, // Optional: if you want to pre-fill email
    })

    // Return the checkout session URL
    res.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    })
  } catch (error) {
    console.error('Stripe Checkout Session Error:', error)
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: error.message,
    })
  }
})

// Webhook endpoint for Stripe (optional, for handling events)
// This can be used for Zapier automation or direct webhook handling
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.warn('Stripe webhook secret not configured')
    return res.status(400).send('Webhook secret not configured')
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object
      console.log('Checkout session completed:', session.id)
      // Here you can trigger Zapier or other automations
      // The subscription and customer info are available in session
      break
    case 'customer.subscription.created':
      const subscription = event.data.object
      console.log('Subscription created:', subscription.id)
      // Subscription details available for Zapier
      break
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  res.json({ received: true })
})

export default router

