import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_URL } from "../config";

const getRoleFromToken = (token) => {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded)).user?.role || "user";
  } catch {
    return "user";
  }
};

const authenticate = async (url, credentials, thunkApi) => {
  try {
    const response = await fetch(`${API_URL}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      return thunkApi.rejectWithValue(data.message || "Authentication failed");
    }
    return data.jwttoken;
  } catch {
    return thunkApi.rejectWithValue("Unable to connect to the server");
  }
};

export const loginUser = createAsyncThunk("auth/login", (credentials, thunkApi) =>
  authenticate("/users/login", credentials, thunkApi)
);

export const signupUser = createAsyncThunk("auth/signup", (credentials, thunkApi) =>
  authenticate("/users/createuser", credentials, thunkApi)
);

const storedToken = localStorage.getItem("token");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: storedToken,
    role: storedToken ? getRoleFromToken(storedToken) : "user",
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.role = "user";
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload;
        state.role = getRoleFromToken(action.payload);
        state.status = "succeeded";
        localStorage.setItem("token", action.payload);
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.token = action.payload;
        state.role = getRoleFromToken(action.payload);
        state.status = "succeeded";
        localStorage.setItem("token", action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;