import { connectDB } from "./config/db.js";
import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js"

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

/* Framtida routes */
app.use("/api/auth", authRoutes);
// app.use("/api/workouts", workoutRoutes);
// app.use("/api/exercises", exercisesRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Appen är igång" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`server is running on http://localhost:${PORT}`))