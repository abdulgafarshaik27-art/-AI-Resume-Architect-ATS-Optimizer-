const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const authMiddleware = require('../middleware/auth');
const { users } = require('./auth');

const router = express.Router();

// POST /api/stripe/create-checkout — create Stripe Checkout session
router.post('/create-checkout', authMiddleware, async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('your-stripe')) {
      return res.status(503).json({
        error: 'Stripe not configured. Add STRIPE_SECRET_KEY to backend/.env',
      });
    }

    const user = users[req.user.email];
    if (!user) return res.status(404).json({ error: 'User not found' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: req.user.email,
      line_items: [{
        price: process.env.STRIPE_PRO_PRICE_ID,
        quantity: 1,
      }],
      success_url: `${process.env.FRONTEND_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
      metadata: {
        userId: req.user.id,
        userEmail: req.user.email,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    res.status(500).json({ error: 'Failed to create checkout session: ' + err.message });
  }
});

// POST /api/webhook/stripe — Stripe webhook handler
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  if (!process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET.includes('your')) {
    console.log('⚠️  Stripe webhook secret not configured, skipping verification');
    return res.json({ received: true });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  // Handle subscription activated
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userEmail = session.metadata?.userEmail || session.customer_email;

    if (userEmail && users[userEmail]) {
      users[userEmail].plan = 'pro';
      users[userEmail].stripeCustomerId = session.customer;
      users[userEmail].resumeCount = 0; // reset limit for pro
      console.log(`✅ Upgraded ${userEmail} to Pro`);
    }
  }

  // Handle subscription cancelled
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    const customerId = subscription.customer;

    // Find user by stripeCustomerId
    const userEntry = Object.values(users).find(u => u.stripeCustomerId === customerId);
    if (userEntry) {
      userEntry.plan = 'free';
      userEntry.resumeCount = Math.min(userEntry.resumeCount, 1);
      console.log(`⬇️  Downgraded ${userEntry.email} to Free`);
    }
  }

  res.json({ received: true });
});

// GET /api/stripe/portal — create customer portal session
router.get('/portal', authMiddleware, async (req, res) => {
  try {
    const user = users[req.user.email];
    if (!user?.stripeCustomerId) {
      return res.status(400).json({ error: 'No active subscription found' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Portal error:', err);
    res.status(500).json({ error: 'Failed to open billing portal' });
  }
});

module.exports = router;
