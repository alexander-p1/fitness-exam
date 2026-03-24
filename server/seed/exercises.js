import mongoose from "mongoose";
import Exercise from "../models/Exercise.js";
import "dotenv/config";

const exercises = [
  // Bröst
  {
    name: "Bänkpress",
    category: "styrka",
    muscleGroup: "bröst",
    description: "Ligg på bänk, pressa stången uppåt",
  },
  {
    name: "Lutande bänkpress",
    category: "styrka",
    muscleGroup: "bröst",
    description: "Fokuserar på övre bröstmuskeln",
  },
  { name: "Cables crossover", category: "styrka", muscleGroup: "bröst" },
  { name: "Dips", category: "styrka", muscleGroup: "bröst" },
  { name: "Hantelflyes", category: "styrka", muscleGroup: "bröst" },

  // Rygg
  { name: "Marklyft", category: "styrka", muscleGroup: "rygg" },
  { name: "Latsdrag", category: "styrka", muscleGroup: "rygg" },
  { name: "Sittande rodd", category: "styrka", muscleGroup: "rygg" },
  { name: "Pullups", category: "styrka", muscleGroup: "rygg" },
  { name: "Bent over row", category: "styrka", muscleGroup: "rygg" },

  // Ben
  { name: "Knäböj", category: "styrka", muscleGroup: "ben" },
  { name: "Benpress", category: "styrka", muscleGroup: "ben" },
  { name: "Rumänsk marklyft", category: "styrka", muscleGroup: "ben" },
  { name: "Utfallssteg", category: "styrka", muscleGroup: "ben" },
  { name: "Leg curl", category: "styrka", muscleGroup: "ben" },
  { name: "Leg extension", category: "styrka", muscleGroup: "ben" },
  { name: "Stående vadpress", category: "styrka", muscleGroup: "ben" },

  // Axlar
  { name: "Militärpress", category: "styrka", muscleGroup: "axlar" },
  { name: "Hantelpress sittande", category: "styrka", muscleGroup: "axlar" },
  { name: "Lateral raises", category: "styrka", muscleGroup: "axlar" },
  { name: "Front raises", category: "styrka", muscleGroup: "axlar" },
  { name: "Face pulls", category: "styrka", muscleGroup: "axlar" },

  // Biceps
  { name: "Bicepscurl skivstång", category: "styrka", muscleGroup: "biceps" },
  { name: "Hammercurl", category: "styrka", muscleGroup: "biceps" },
  { name: "Koncentrationscurl", category: "styrka", muscleGroup: "biceps" },
  { name: "Cable curl", category: "styrka", muscleGroup: "biceps" },

  // Triceps
  { name: "Triceps pushdown", category: "styrka", muscleGroup: "triceps" },
  { name: "Skull crushers", category: "styrka", muscleGroup: "triceps" },
  {
    name: "Overhead triceps extension",
    category: "styrka",
    muscleGroup: "triceps",
  },
  { name: "Triceps dips", category: "styrka", muscleGroup: "triceps" },

  // Mage
  { name: "Plankan", category: "styrka", muscleGroup: "mage" },
  { name: "Crunches", category: "styrka", muscleGroup: "mage" },
  { name: "Leg raises", category: "styrka", muscleGroup: "mage" },
  { name: "Cable crunch", category: "styrka", muscleGroup: "mage" },
  { name: "Ab wheel", category: "styrka", muscleGroup: "mage" },

  // Kondition
  { name: "Löpband", category: "kondition", muscleGroup: "helkropp" },
  { name: "Roddmaskin", category: "kondition", muscleGroup: "helkropp" },
  { name: "Cykel", category: "kondition", muscleGroup: "helkropp" },
  { name: "Hopphopp", category: "kondition", muscleGroup: "helkropp" },

  // Helkropp
  { name: "Burpees", category: "kondition", muscleGroup: "helkropp" },
  { name: "Kettlebell swing", category: "styrka", muscleGroup: "helkropp" },
  { name: "Clean and press", category: "styrka", muscleGroup: "helkropp" },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Exercise.deleteMany();
    await Exercise.insertMany(exercises);
    console.log(`${exercises.length} övningar seedade.`);
    process.exit(0);
  } catch (error) {
    console.error("Seed misslyckades", error);
    process.exit(1);
  }
};

seed();
