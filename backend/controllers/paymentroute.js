const express = require('express');
const router = express.Router();
const Stripe = require("stripe");

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// Create a payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).send({ error: 'Payments are not configured on the server' });
    }

    const amount = Number(req.body?.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).send({ error: 'Payment amount must be a positive number' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });
    res.send({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Stripe payment intent failed:', error.message);
    res.status(502).send({ error: 'Unable to create payment intent with Stripe' });
  }
});
module.exports = router;