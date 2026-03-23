import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    requires: [true, "Namn krävs"],
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["styrka", "kondition", "rörlighet"],
  },
  muscleGroup: {
    type: String,
    required: true,
    enum: [
      "bröst",
      "rygg",
      "ben",
      "axlar",
      "biceps",
      "triceps",
      "mage",
      "helkropp",
    ],
  },
  description: {
    type: String,
    default: "",
  },
});

export default mongoose.model("Exercise", exerciseSchema)
