import "./App.css";
import { Routes, Route, Navigate } from "react-router";
import { Login } from "./pages/login/Login.jsx";
import { Register } from "./pages/registration/Registration.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Workout from "./pages/workout/Workout.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import WorkoutLog from "./pages/workoutlog/WorkoutLog.jsx";
import Layout from "./components/Layout.jsx";
import Progress from "./pages/progress/Progress.jsx";
import ExercisePicker from "./pages/exercisepicker/ExercisePicker.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/workout/build"
        element={
          <ProtectedRoute>
            <Layout>
              <Workout />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/workout/new"
        element={
          <ProtectedRoute>
            <Layout>
              <ExercisePicker />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/workouts"
        element={
          <ProtectedRoute>
            <Layout>
              <WorkoutLog />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <Layout>
              <Progress />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
