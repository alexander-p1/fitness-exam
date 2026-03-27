import Exercise from "../models/Exercise.js";

export const getExercises = async (req, res) => {
  try {
    const { search, muscleGroup, category } = req.query;

    const filter = {};
    if (muscleGroup) filter.muscleGroup = muscleGroup;
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };

    const exercises = await Exercise.find(filter).sort({ name: 1 });
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: "Serverfel", error: error.message });
  }
};
