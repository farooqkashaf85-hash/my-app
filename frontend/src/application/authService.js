import { apiRequest } from "../infrastructure/apiClient";

export const authService = {
  login: (credentials) => apiRequest("/users/login", { method: "POST", body: JSON.stringify(credentials) }),
  signup: (credentials) => apiRequest("/users/createuser", { method: "POST", body: JSON.stringify(credentials) }),
  verifyEmail: (credentials) => apiRequest("/users/verify-email", { method: "POST", body: JSON.stringify(credentials) }),
};