import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../hooks/useAuth";

const Signup = (props) => {
    let navigate = useNavigate();
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
  const {name , email , password}= credentials;
  const {signup, status :authStatus } = useAuth();
     const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup({ name, email, password }).unwrap();
        props.showAlert("Account created successfully", "success");
        navigate("/");
    } catch (error) {
        props.showAlert(`Signup failed: ${error}`, "danger");
    }
  };
  const handleInput = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  return (
    <div>
      <div className="container">
        <h1>Create an Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              name="name"
              onChange={handleInput}
              className="form-control w-50"
              id="name"
              minLength={5}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              name="email"
              className="form-control w-50"
              id="email"
              onChange={handleInput}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="form-control w-50"
              onChange={handleInput}
              id="password"
              minLength={5}
              aria-describedby="passwordHelp"
              required
            />
            <div id="passwordHelp" className="form-text">
              We'll never share your password with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="cpassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              name="cpassword"
              className="form-control w-50"
              id="cpassword"
              minLength={5}
              onChange={handleInput}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={authStatus === "loading"}>
            {authStatus === "loading" ? "Creating account..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
