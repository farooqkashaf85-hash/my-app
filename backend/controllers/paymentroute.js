const express = require('express');
const router = express.Router();
const Stripe = require("stripe");

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// Create a payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount*100, // Convert to cents
      currency: 'usd',
      automatic_payment_methods: { enabled: true,
      },
    });
    res.send({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to create payment intent' });
  }
});
module.exports = router;