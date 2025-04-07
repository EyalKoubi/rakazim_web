import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../Pages/LoginPage/Login";
import Register from "../Pages/RegisterPage/Register";
import CoordinatorHome from "../Pages/CoordinatePage/CoordinatorHome";
import "./App.css";
import { useEffect, useState } from "react";
import AdminDashboard from "../Pages/AdminPage/AdminDashboard";

function App() {
  const [coordi, setCoordi] = useState("");

  useEffect(() => {
    document.body.style.backgroundImage = "url('/school.png')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center";

    return () => {
      document.body.style.backgroundImage = "";
    };
  }, []);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Login setCoordi={setCoordi} />} />
          <Route path="/login" element={<Login setCoordi={setCoordi} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<CoordinatorHome coordi={coordi} />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
