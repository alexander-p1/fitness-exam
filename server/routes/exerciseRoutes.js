import express from "express";
import { getExercises } from "../controllers/exerciseController.js";
import protectedRoute from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protectedRoute, getExercises);

export default router;
