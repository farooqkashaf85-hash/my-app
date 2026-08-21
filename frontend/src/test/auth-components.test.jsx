import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Login from "../components/login";
import Signup from "../components/signup";
import { loginUser, signupUser } from "../store/authSlice";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../store/authSlice", () => ({
  loginUser: jest.fn((credentials) => ({ type: "auth/login", credentials })),
  signupUser: jest.fn((credentials) => ({ type: "auth/signup", credentials })),
}));

describe("authentication forms", () => {
  const dispatch = jest.fn();
  const navigate = jest.fn();
  const showAlert = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(dispatch);
    useNavigate.mockReturnValue(navigate);
    useSelector.mockReturnValue("idle");
    dispatch.mockReturnValue({ unwrap: () => Promise.resolve() });
  });

  test("logs in with the entered credentials and navigates home", async () => {
    const user = userEvent.setup();
    const { container } = render(<Login showAlert={showAlert} />);

    await user.type(container.querySelector("#email"), "person@example.com");
    await user.type(container.querySelector("#password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(loginUser).toHaveBeenCalledWith({
      email: "person@example.com",
      password: "secret123",
    });
    expect(showAlert).toHaveBeenCalledWith("Logged in successfully", "success");
    expect(navigate).toHaveBeenCalledWith("/");
  });

  test("shows the loading state while login is pending", () => {
    useSelector.mockReturnValue("loading");
    render(<Login showAlert={showAlert} />);

    expect(screen.getByRole("button", { name: "Signing in..." })).toBeDisabled();
  });

  test("submits signup details without the confirmation password", async () => {
    const user = userEvent.setup();
    render(<Signup showAlert={showAlert} />);

    await user.type(screen.getByLabelText(/name/i), "Taylor User");
    await user.type(screen.getByLabelText(/email address/i), "taylor@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "secret123");
    await user.type(screen.getByLabelText(/confirm password/i), "secret123");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(signupUser).toHaveBeenCalledWith({
      name: "Taylor User",
      email: "taylor@example.com",
      password: "secret123",
    });
    expect(showAlert).toHaveBeenCalledWith("Account created successfully", "success");
    expect(navigate).toHaveBeenCalledWith("/");
  });
});