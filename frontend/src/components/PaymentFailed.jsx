import { Link, useLocation } from "react-router-dom";

function PaymentFailed({ message }) {
  const location = useLocation();
  const errorMessage = message || location.state?.message || "Your payment could not be completed.";

  return (
    <main className="payment-page">
      <h1>Payment failed</h1>
      <p>{errorMessage}</p>
      <Link to="/checkout">Try again</Link>
    </main>
  );
}

export default PaymentFailed;