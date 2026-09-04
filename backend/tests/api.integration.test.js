const request = require("supertest");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "test-jwt-secret-that-is-at-least-32-chars";
process.env.JWT_SECRET = JWT_SECRET;
process.env.MONGO_URI = "mongodb://localhost/test";

jest.mock("../models/Users", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
}));

const User = require("../models/Users");
const { app } = require("../backend .js");

describe("backend API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("reports that the server is running", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Server is running");
    expect(response.headers["x-request-id"]).toBeTruthy();
  });

  test("returns a structured 404 with the supplied request ID", async () => {
    const response = await request(app)
      .get("/does-not-exist")
      .set("x-request-id", "integration-test-request");

    expect(response.status).toBe(404);
    expect(response.headers["x-request-id"]).toBe("integration-test-request");
    expect(response.body).toEqual({
      success: false,
      error: "Route not found: GET /does-not-exist",
      requestId: "integration-test-request",
    });
  });

  test("rejects invalid create-user input before accessing the model", async () => {
    const response = await request(app)
      .post("/users/createuser")
      .send({ name: "A", email: "invalid", password: "123" });

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveLength(3);
    expect(User.findOne).not.toHaveBeenCalled();
  });

  test("creates a user and returns a signed token", async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      id: "user-1",
      role: "user",
    });

    const response = await request(app).post("/users/createuser").send({
      name: "Test User",
      email: "test@example.com",
      password: "secret-password",
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(jwt.verify(response.body.jwttoken, JWT_SECRET)).toMatchObject({
      user: { id: "user-1", role: "user" },
    });
    expect(User.create).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@example.com",
      password: expect.any(String),
      role: "user",
    });
  });

  test("protects authenticated routes when the token is missing", async () => {
    const response = await request(app).get("/users/admin-only");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: "please authenticate using a valid token",
    });
  });

  test("denies a non-admin on the admin-only route", async () => {
    const token = jwt.sign(
      { user: { id: "user-1", role: "user" } },
      JWT_SECRET,
    );

    const response = await request(app)
      .get("/users/admin-only")
      .set("jwttoken", token);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      success: false,
      message: "You do not have permission to access this resource",
    });
  });
});