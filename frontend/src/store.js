import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./store/authSlice";
import notesReducer from "./store/notesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: notesReducer,
  },
});

export default store;