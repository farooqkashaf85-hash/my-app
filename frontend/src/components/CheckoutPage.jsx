import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { API_URL } from "../config";
import CheckoutForm from "./CheckoutForm";
import PaymentFailed from "./PaymentFailed";

const stripePublishableKey = (
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_STRIPE_PUBLIC_KEY
)?.trim();
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;
const paymentAmount = 10;

function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!stripePromise) {
        setError("Stripe is not configured. Add VITE_STRIPE_PUBLISHABLE_KEY to frontend/.env.");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/payment/create-payment-intent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: paymentAmount }),
        });

        const data = await response.json();
        if (!response.ok || !data.clientSecret) {
          throw new Error(data.error || "Unable to start checkout.");
        }

        setClientSecret(data.clientSecret);
      } catch (requestError) {
        setError(requestError.message || "Unable to start checkout.");
      }
    };

    createPaymentIntent();
  }, []);

  if (error) {
    return <PaymentFailed message={error} />;
  }

  if (!clientSecret) {
    return <main className="checkout-page"><h1>Loading checkout...</h1></main>;
  }

  return (
    <main className="checkout-page">
      <h1>Checkout</h1>
      <p>Amount: ${paymentAmount.toFixed(2)}</p>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm />
      </Elements>
    </main>
  );
}

export default CheckoutPage;