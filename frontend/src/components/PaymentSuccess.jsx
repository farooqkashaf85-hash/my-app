import { Link } from "react-router-dom";

function PaymentSuccess() {
  return (
    <main className="payment-page">
      <h1>Payment successful</h1>
      <p>Thank you for your payment.</p>
      <Link to="/">Return home</Link>
    </main>
  );
}

export default PaymentSuccess;