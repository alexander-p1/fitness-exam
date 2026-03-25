import "./App.css";
import { Routes, Route, Navigate } from "react-router";
import { Login } from "./pages/login/Login.jsx";
import { Register } from "./pages/registration/Registration.jsx";
import ProtectedRoute from "./components/PotectedRoute.jsx";
import WorkoutBuilder from "./pages/workoutbuilder/WorkoutBuilder.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/workout/new"
        element={
          <ProtectedRoute>
            <WorkoutBuilder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
