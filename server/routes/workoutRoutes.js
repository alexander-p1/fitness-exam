import express from "express";
import protectedRoute from "../middlewares/authMiddleware.js";
import {
  getWorkouts,
  createWorkout,
  deleteWorkout,
  GetWorkoutById,
} from "../controllers/workoutController.js";

const router = express.Router();

router.get("/", protectedRoute, getWorkouts);
router.post("/", protectedRoute, createWorkout);
router.get("/:id", protectedRoute, GetWorkoutById);
router.delete("/:id", protectedRoute, deleteWorkout);

export default router;
