const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");
const authorizeRoles = require("../middleware/authorizeRole");

const JWT_SECRET = "Kashaf";

const response = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
});

describe("fetchUser middleware", () => {
  test("rejects requests without a token", () => {
    const req = { header: jest.fn().mockReturnValue(undefined) };
    const res = response();
    const next = jest.fn();

    fetchUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ error: "please authenticate using a valid token" });
    expect(next).not.toHaveBeenCalled();
  });

  test("attaches the verified user and calls next", () => {
    const user = { id: "user-1", role: "user" };
    const req = { header: jest.fn().mockReturnValue(jwt.sign({ user }, JWT_SECRET)) };
    const res = response();
    const next = jest.fn();

    fetchUser(req, res, next);

    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe("authorizeRoles middleware", () => {
  test("rejects a user without a permitted role", () => {
    const req = { user: { role: "user" } };
    const res = response();
    const next = jest.fn();

    authorizeRoles("admin")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "You do not have permission to access this resource",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("allows a permitted role", () => {
    const req = { user: { role: "admin" } };
    const res = response();
    const next = jest.fn();

    authorizeRoles("admin")(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});