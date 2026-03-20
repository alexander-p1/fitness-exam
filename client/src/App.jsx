import "./App.css";
import { Routes, Route } from "react-router";
import Login from "./pages/login/Login";
import Register from "./pages/registration/Registration";

function App() {
  return (
    <Routes>
      <Route path="/login" element=<Login /> />
      <Route path="/register" element=<Register /> />
      <Route path="/" element />
    </Routes>
  );
}

export default App;
