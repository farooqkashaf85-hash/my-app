import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const Signup = (props) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { name, email, password, cpassword } = credentials;

  const handleInput = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const sendCode = async () => {
    if (!name || !email || !password || password !== cpassword) {
      props.showAlert("Please complete form and confirm password", "danger");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/users/createuser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.errors?.[0]?.msg || "Unable to send verification code");
      }

      setIsCodeSent(true);
      props.showAlert("Verification code sent to your email", "success");
    } catch (error) {
      props.showAlert(error.message, "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyAndCreateAccount = async (e) => {
    e.preventDefault();

    if (!verificationCode) {
      props.showAlert("Enter the 6-digit verification code", "danger");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/users/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Verification failed");
      }

      localStorage.setItem("token", data.jwttoken);
      props.showAlert("Account verified and created successfully", "success");
      navigate("/");
    } catch (error) {
      props.showAlert(error.message, "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="container">
        <h1>Create an Account</h1>
        <form onSubmit={verifyAndCreateAccount}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" name="name" onChange={handleInput} className="form-control w-50" id="name" minLength={5} required disabled={isCodeSent} />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" name="email" className="form-control w-50" id="email" onChange={handleInput} required disabled={isCodeSent} />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" name="password" className="form-control w-50" onChange={handleInput} id="password" minLength={5} aria-describedby="passwordHelp" required disabled={isCodeSent} />
            <div id="passwordHelp" className="form-text">We'll never share your password with anyone else.</div>
          </div>

          <div className="mb-3">
            <label htmlFor="cpassword" className="form-label">Confirm Password</label>
            <input type="password" name="cpassword" className="form-control w-50" id="cpassword" minLength={5} onChange={handleInput} required disabled={isCodeSent} />
          </div>

          {!isCodeSent ? (
            <button type="button" className="btn btn-primary" onClick={sendCode} disabled={isSubmitting}>
              {isSubmitting ? "Sending code..." : "Send verification code"}
            </button>
          ) : (
            <>
              <div className="mb-3">
                <label htmlFor="verificationCode" className="form-label">Verification code</label>
                <input
                  type="text"
                  id="verificationCode"
                  className="form-control w-50"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.trim())}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                />
              </div>

              <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                {isSubmitting ? "Verifying..." : "Verify & Create Account"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;
