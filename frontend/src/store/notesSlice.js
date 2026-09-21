import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { notesService } from "../application/notesService";

const runRequest = async (request, thunkApi) => {
  try {
    return await request();
  } catch (error) {
    return thunkApi.rejectWithValue({
      message: error.message || "Unable to connect to the server",
      status: error.status,
    });
  }
};

export const fetchNotes = createAsyncThunk(
  "notes/fetch",
  async ({ page = 1, limit = 5, keyword = "" } = {}, thunkApi) => {
    return runRequest(() => notesService.fetchAll({ page, limit, keyword }), thunkApi);
  },
);

export const addNote = createAsyncThunk(
  "notes/add",
  async ({ Title, Content }, thunkApi) => runRequest(() => notesService.add({ Title, Content }), thunkApi),
);

export const deleteNote = createAsyncThunk(
  "notes/delete",
  async (id, thunkApi) => runRequest(() => notesService.remove(id).then(() => id), thunkApi),
);

export const editNote = createAsyncThunk(
  "notes/edit",
  async ({ id, Title, Content }, thunkApi) => runRequest(() => notesService.update(id, { Title, Content }), thunkApi),
);
const cachedNotes = JSON.parse(localStorage.getItem("cachedNotes") || "[]");
const notesSlice = createSlice({
  name: "notes",
  initialState: {
    items: cachedNotes,
    pagination: { total: 0, page: 1, limit: 5, pages: 1 },
    keyword: "",
    status: "idle",
    error: null,
  },
  reducers: {
    setKeyword: (state, action) => {
      state.keyword = action.payload;
    },
    removeNoteOptimistic: (state, action) => {
      state.items = state.items.filter((note) => note._id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.status = "succeeded";

        const newNotes = Array.isArray(action.payload.data)
          ? action.payload.data
          : [];

        if (action.meta.arg.page === 1) {
          state.items = newNotes;
        } else {
          state.items = [...state.items, ...newNotes];
        }

        state.pagination = action.payload.pagination || state.pagination;
        localStorage.setItem("cachedNotes", JSON.stringify(state.items));
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

export const { setKeyword , removeNoteOptimistic} = notesSlice.actions;
export default notesSlice.reducer;
