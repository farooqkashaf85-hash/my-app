import { BrowserRouter, Routes, Route } from "react-router-dom";
import {lazy , Suspense} from "react";
import "./App.css";
import Navbar from "./compnents/Navbar";
import { useState } from "react";
import { useSelector } from "react-redux";
const Home = lazy(()=>import ("./compnents/Home"));
const About = lazy(()=>import ("./compnents/About"));
const Login = lazy(()=>import ("./compnents/Login"));
const Signup = lazy(()=>import ("./compnents/Signup"));
import Alert from "./compnents/Alert";
const AdminPanel = lazy(() => import("./compnents/AdminPanel"));
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [alert, setAlert] = useState(null);
  const isAdmin = useSelector((state) => state.auth.role === "admin");
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
    </>
  );
}

export default App;
