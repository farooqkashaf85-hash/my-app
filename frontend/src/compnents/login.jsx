import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
const login = (props) => {
    const { showAlert } = props;
    let navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(credentials);   
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
        // Save the token and redirect to home page
        localStorage.setItem("token", json.jwttoken);
        props.showAlert("Logged in successfully", "success");
        navigate("/");
    
    } 
    else {
        props.showAlert("Login failed: ", "danger");
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
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default login;
