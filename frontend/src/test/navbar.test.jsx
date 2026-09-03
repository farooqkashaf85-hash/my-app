import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { logout } from "../store/authSlice";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return { ...actual, useNavigate: jest.fn() };
});

jest.mock("../store/authSlice", () => ({
  logout: jest.fn(() => ({ type: "auth/logout" })),
}));

describe("Navbar", () => {
  test("shows login and signup links for visitors", () => {
    useSelector.mockReturnValue(false);
    render(<MemoryRouter><Navbar /></MemoryRouter>);

    expect(screen.getByRole("button", { name: "Login" })).toHaveAttribute("href", "/login");
    expect(screen.getByRole("button", { name: "SignUp" })).toHaveAttribute("href", "/signup");
  });

  test("logs out authenticated users", async () => {
    const dispatch = jest.fn();
    const navigate = jest.fn();
    useDispatch.mockReturnValue(dispatch);
    useSelector.mockReturnValue(true);
    const { useNavigate } = jest.requireMock("react-router-dom");
    useNavigate.mockReturnValue(navigate);
    render(<MemoryRouter><Navbar /></MemoryRouter>);

    await userEvent.click(screen.getByRole("button", { name: "LogOut" }));

    expect(dispatch).toHaveBeenCalledWith({ type: "auth/logout" });
    expect(logout).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith("/login");
  });
});