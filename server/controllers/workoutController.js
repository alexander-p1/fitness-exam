import Workout from "../models/Workout.js";

export const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id })
      .populate("exercises.exercise", "name muscleGroup") // Hämtar namn och muskelgrupp från exercise
      .sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: "Serverfel", error: error.message });
  }
};

export const createWorkout = async (req, res) => {
  const { title, exercises, notes, data } = req.body;
  try {
    const workout = await Workout.create({
      user: req.user.id,
      title,
      exercises,
      notes,
      data,
    });
    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: "Serverfel", error: error.message });
  }
};

export const GetWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("exercises.exercise", "name muscleGroup");

    if (!workout)
      return res.status(404).json({ message: "Pass hittades inte" });

    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: "Serverfel", error: error.message });
  }
};

export const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!workout)
      return res.status(404).json({ message: "Pass hittades inte" });

    res.json({ message: "Pass raderat" });
  } catch (error) {
    res.status(500).json({ message: "Serverfel", error: error.message });
  }
};
