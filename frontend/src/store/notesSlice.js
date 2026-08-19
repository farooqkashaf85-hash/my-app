import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const baseUrl = "http://localhost:5000";
const request = async (url, options = {}, thunkApi) => {
  try {
    const response = await fetch(`${baseUrl}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        jwttoken: localStorage.getItem("token"),
        ...options.headers,
      },
    });
    const data = await response.json();
    if (!response.ok)
      return thunkApi.rejectWithValue(data.message || "Request failed");
    return data;
  } catch {
    return thunkApi.rejectWithValue("Unable to connect to the server");
  }
};

export const fetchNotes = createAsyncThunk(
  "notes/fetch",
  async ({ page = 1, limit = 5, keyword = "" } = {}, thunkApi) => {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (keyword.trim()) query.append("keyword", keyword.trim());
    return request(`/Notes/fetchallnotes?${query.toString()}`, {}, thunkApi);
  },
);

export const addNote = createAsyncThunk(
  "notes/add",
  async ({ Title, Content }, thunkApi) =>
    request(
      "/Notes/addnewnote",
      { method: "POST", body: JSON.stringify({ Title, Content }) },
      thunkApi,
    ),
);

export const deleteNote = createAsyncThunk(
  "notes/delete",
  async (id, thunkApi) =>
    request(`/Notes/deletenote/${id}`, { method: "DELETE" }, thunkApi).then(
      () => id,
    ),
);

export const editNote = createAsyncThunk(
  "notes/edit",
  async ({ id, Title, Content }, thunkApi) =>
    request(
      `/Notes/updatenote/${id}`,
      { method: "PUT", body: JSON.stringify({ Title, Content }) },
      thunkApi,
    ),
);

const notesSlice = createSlice({
  name: "notes",
  initialState: {
    items: [],
    pagination: { total: 0, page: 1, limit: 5, pages: 1 },
    keyword: "",
    status: "idle",
    error: null,
  },
  reducers: {
    setKeyword: (state, action) => {
      state.keyword = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = Array.isArray(action.payload.data)
          ? action.payload.data
          : [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.items = [];
      })
      .addCase(addNote.fulfilled, (state, action) => {
        if (action.payload.data) state.items.push(action.payload.data);
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.items = state.items.filter((note) => note._id !== action.payload);
      })
      .addCase(editNote.fulfilled, (state, action) => {
        const updatedNote = action.payload.data;
        state.items = state.items.map((note) =>
          note._id === updatedNote?._id ? { ...note, ...updatedNote } : note,
        );
      });
  },
});

export const { setKeyword } = notesSlice.actions;
export default notesSlice.reducer;
