import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import About from "./compnents/About";
import AdminPanel from "./compnents/AdminPanel";
import Alert from "./compnents/Alert";
import Home from "./compnents/Home";
import Login from "./compnents/login";
import Navbar from "./compnents/Navbar";
import Signup from "./compnents/signup";
import NoteState from "./context/notes/NoteState";
import type { AlertState, ShowAlert } from "./types";

const getUserRole = (): "user" | "admin" => {
  const token = localStorage.getItem("token");
  if (!token) return "user";

  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))) as {
      user?: { role?: "user" | "admin" };
    };
    return payload.user?.role ?? "user";
  } catch {
    return "user";
  }
};

function App() {
  const [alert, setAlert] = useState<AlertState | null>(null);
  const showAlert: ShowAlert = (message, type) => {
    setAlert({ msg: message, type });
    setTimeout(() => setAlert(null), 1500);
  };

  return (
    <NoteState>
      <BrowserRouter>
        <Navbar />
        <Alert alert={alert} />
        <Routes>
          <Route path="/" element={getUserRole() === "admin" ? <AdminPanel /> : <Home showAlert={showAlert} />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login showAlert={showAlert} />} />
          <Route path="/signup" element={<Signup showAlert={showAlert} />} />
        </Routes>
      </BrowserRouter>
    </NoteState>
  );
}

export default App;