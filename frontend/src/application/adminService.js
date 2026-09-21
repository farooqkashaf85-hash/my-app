import { apiRequest } from "../infrastructure/apiClient";

export const adminService = {
  fetchUsers: () => apiRequest("/users/allusers"),
  fetchNotes: () => apiRequest("/Notes/admin/allnotes"),
};