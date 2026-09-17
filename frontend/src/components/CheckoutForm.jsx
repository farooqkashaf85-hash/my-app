import { useState } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError("Payment form is still loading. Please try again.");
      return;
    }

    setIsProcessing(true);
    setError("");

    const { error: paymentError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
      redirect: "if_required",
    });

    setIsProcessing(false);

    if (paymentError) {
      navigate("/payment/failed", { state: { message: paymentError.message } });
      return;
    }

    navigate("/payment/success");
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={isProcessing || !stripe || !elements}>
        {isProcessing ? "Processing..." : "Pay now"}
      </button>
    </form>
  );
}

export default CheckoutForm;