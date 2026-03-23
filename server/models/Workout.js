import mongoose from "mongoose";

const setSchema = new mongoose.Schema(
  {
    reps: { type: Number, required: true },
    weight: { type: Number, required: true },
  },
  { _id: false },
);

const workoutExerciseSchema = new mongoose.Schema(
  {
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
    },
    sets: [setSchema],
  },
  { _id: false },
);

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: [true, "Titel krävs"],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    exercises: [workoutExerciseSchema],
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Workout", workoutSchema)
