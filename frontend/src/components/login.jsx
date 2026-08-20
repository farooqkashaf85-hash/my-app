import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice";
const Login = (props) => {
    let navigate = useNavigate();
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(credentials)).unwrap();
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
    <div>
      <div className="container">
        <h1 className="mb-3">Login to continue to Notebook</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              className="form-control w-50"
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
              className="form-control w-50"
              id="password"
              onChange={handleInput}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={authStatus === "loading"}>
            {authStatus === "loading" ? "Signing in..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
