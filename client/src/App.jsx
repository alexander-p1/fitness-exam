import "./App.css";
import { Routes, Route, Navigate } from "react-router";
import { Login } from "./pages/login/Login";
import { Register } from "./pages/registration/Registration";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
