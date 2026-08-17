import { BrowserRouter, Routes, Route } from "react-router-dom";
import {lazy , Suspense} from "react";
import "./App.css";
import Navbar from "./compnents/Navbar";
import { useState } from "react";
const Home = lazy(()=>import ("./compnents/Home"));
const About = lazy(()=>import ("./compnents/About"));
import NoteState from "./context/notes/NoteState";
const Login = lazy(()=>import ("./compnents/Login"));
const Signup = lazy(()=>import ("./compnents/Signup"));
import Alert from "./compnents/Alert";
const AdminPanel = lazy(() => import("./compnents/AdminPanel"));
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
          <Suspense fallback={<h3>Loading...</h3>}>
             <Routes>
            <Route path="/" element={isAdmin ? <AdminPanel /> : <Home showAlert={showAlert} />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login showAlert={showAlert} />} />
            <Route path="/signup" element={<Signup showAlert={showAlert} />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </NoteState>
    </>
  );
}

export default App;
