import { BrowserRouter, Routes, Route } from "react-router-dom";
import {lazy , Suspense} from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { useState } from "react";
import { useSelector } from "react-redux";
const Home = lazy(()=>import ("./components/Home"));
const About = lazy(()=>import ("./components/About"));
const SharedNote = lazy(()=>import ("./components/SharedNote"));
const Login = lazy(()=>import ("./components/login"));
const Signup = lazy(()=>import ("./components/signup"));
import Alert from "./components/Alert";
const AdminPanel = lazy(() => import("./components/AdminPanel"));
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
            <Route path="/shared" element={<SharedNote />} />
            <Route path="/login" element={<Login showAlert={showAlert} />} />
            <Route path="/signup" element={<Signup showAlert={showAlert} />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
    </>
  );
}

export default App;
