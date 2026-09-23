import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
const Login = (props) => {
    let navigate = useNavigate();
  const { login, status :authStatus } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials).unwrap();
        props.showAlert("Logged in successfully", "success");
        navigate("/");
    } catch (error) {
        props.showAlert(`Login failed: ${error}`, "danger");
    }
  };
  const handleInput = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  return (
    <main className="auth-page">
      <div className="auth-panel">
        <p className="eyebrow">WELCOME TO NOTEBOOK</p>
        <h1>Login to continue</h1>
        <p className="auth-intro">Pick up your ideas right where you left them.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              className="form-control"
              id="email"
              aria-describedby="emailHelp"
              onChange={handleInput}
              required
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              className="form-control"
              id="password"
              onChange={handleInput}
              required
            />
          </div>
          <button type="submit" className="btn app-btn app-btn-primary" disabled={authStatus === "loading"}>
            {authStatus === "loading" ? "Signing in..." : "Submit"}
          </button>
          <button
            type="button"
            className="btn app-btn app-btn-outline"
            onClick={() => navigate("/checkout")}
          >
            Buy Premium - $10
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;
