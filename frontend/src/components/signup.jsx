import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../application/authService";

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
      await authService.signup({ name, email, password });

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
      const data = await authService.verifyEmail({ email, code: verificationCode });

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
    <main className="auth-page">
      <div className="auth-panel auth-panel-wide">
        <p className="eyebrow">START ORGANIZING</p>
        <h1>Create an Account</h1>
        <p className="auth-intro">A calmer place for all the things you want to remember.</p>
        <form className="auth-form" onSubmit={verifyAndCreateAccount}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" name="name" onChange={handleInput} className="form-control" id="name" minLength={5} required disabled={isCodeSent} />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" name="email" className="form-control" id="email" onChange={handleInput} required disabled={isCodeSent} />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" name="password" className="form-control" onChange={handleInput} id="password" minLength={5} aria-describedby="passwordHelp" required disabled={isCodeSent} />
            <div id="passwordHelp" className="form-text">We'll never share your password with anyone else.</div>
          </div>

          <div className="mb-3">
            <label htmlFor="cpassword" className="form-label">Confirm Password</label>
            <input type="password" name="cpassword" className="form-control" id="cpassword" minLength={5} onChange={handleInput} required disabled={isCodeSent} />
          </div>

          {!isCodeSent ? (
            <button type="button" className="btn app-btn app-btn-primary" onClick={sendCode} disabled={isSubmitting}>
              {isSubmitting ? "Sending code..." : "Send verification code"}
            </button>
          ) : (
            <>
              <div className="mb-3">
                <label htmlFor="verificationCode" className="form-label">Verification code</label>
                <input
                  type="text"
                  id="verificationCode"
                  className="form-control"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.trim())}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                />
              </div>

              <button type="submit" className="btn app-btn app-btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Verifying..." : "Verify & Create Account"}
              </button>
            </>
          )}
        </form>
      </div>
    </main>
  );
};

export default Signup;
