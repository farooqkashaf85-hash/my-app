import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./compnents/Navbar";
import { useState } from "react";
import Home from "./compnents/Home";
import About from "./compnents/About";
import NoteState from "./context/notes/NoteState";
import Login from "./compnents/Login";
import Signup from "./compnents/Signup";
import Alert from "./compnents/Alert";
import AdminPanel from "./compnents/AdminPanel";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return "user";

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const payload = JSON.parse(atob(padded));
    return payload.user?.role || "user";
  } catch (error) {
    return "user";
  }
};

function App() {
  const [alert, setAlert] = useState(null);
  const isAdmin = getUserRole() === "admin";
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  }
  return (
    <>
      <ToastContainer />
      <NoteState>
        <BrowserRouter>
          <Navbar />
          <Alert alert={alert} />
          <Routes>
            <Route path="/" element={isAdmin ? <AdminPanel /> : <Home showAlert={showAlert} />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login showAlert={showAlert} />} />
            <Route path="/signup" element={<Signup showAlert={showAlert} />} />
          </Routes>
        </BrowserRouter>
      </NoteState>
    </>
  );
}

export default App;
