import { apiRequest } from "../infrastructure/apiClient";

export const notesService = {
  fetchAll: ({ page = 1, limit = 5, keyword = "" } = {}) => {
    const query = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (keyword.trim()) query.set("keyword", keyword.trim());
    return apiRequest(`/Notes/fetchallnotes?${query.toString()}`);
  },
  add: (note) => apiRequest("/Notes/addnewnote", { method: "POST", body: JSON.stringify(note) }),
  update: (id, note) => apiRequest(`/Notes/updatenote/${id}`, { method: "PUT", body: JSON.stringify(note) }),
  remove: (id) => apiRequest(`/Notes/deletenote/${id}`, { method: "DELETE" }),
};