import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../../api/api.js";
import CircularIndeterminate from "../../components/LoadingSpinner.jsx";

const muscleGroups = [
  "bröst",
  "rygg",
  "ben",
  "axlar",
  "biceps",
  "triceps",
  "mage",
  "helkropp",
];

const ExercisePicker = () => {
  const [exercises, setExercises] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (muscleFilter) params.append("muscleGroup", muscleFilter);
        const data = await apiFetch(`/exercises?${params}`);
        setExercises(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [search, muscleFilter]);

  const toggleExercise = (exercise) => {
    const isSelected = selected.find((e) => e._id === exercise._id);
    if (isSelected) {
      setSelected(selected.filter((e) => e._id !== exercise._id));
    } else {
      setSelected([...selected, exercise]);
    }
  };

  const handleContinue = () => {
    if (selected.length === 0) return;

    navigate("/workout/build", { state: { exercises: selected } });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Välj övningar</h1>
      <p className="text-gray-400 text-sm mb-6">
        {selected.length} övningar valda
      </p>

      {/* Sök */}
      <div className="space-y-2 mb-6">
        <input
          type="text"
          placeholder="Sök övning..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md bg-white/5 px-3 py-2 text-white outline-1 outline-white/10 focus:outline-emerald-500"
        />
        <select
          value={muscleFilter}
          onChange={(e) => setMuscleFilter(e.target.value)}
          className="w-full hover:cursor-pointer rounded-md bg-zinc-800 px-3 py-2 text-white border border-white/10"
        >
          <option value="">Alla muskelgrupper</option>
          {muscleGroups.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Övningar */}
      <div className="space-y-2 mb-24">
        {loading ? (
          <CircularIndeterminate />
        ) : (
          exercises.map((exercise) => {
            const isSelected = selected.find((e) => e._id === exercise._id);
            return (
              <button
                key={exercise._id}
                onClick={() => toggleExercise(exercise)}
                className={`w-full hover:cursor-pointer flex justify-between items-center px-4 py-3 rounded-lg transition-colors text-left ${
                  isSelected
                    ? " border border-emerald-500"
                    : "bg-white/5 border border-transparent hover:bg-white/10"
                }`}
              >
                <div>
                  <p className="font-medium">{exercise.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {exercise.muscleGroup}
                  </p>
                </div>
                <span className="text-lg">{isSelected ? "✓" : "+"}</span>
              </button>
            );
          })
        )}
      </div>

      {selected.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 lg:left-60 p-4 bg-zinc-900 border-t border-white/10">
          <button
            onClick={handleContinue}
            className="w-full hover:cursor-pointer bg-emerald-500 hover:bg-emerald-600 py-3 rounded-lg font-semibold transition-colors"
          >
            Fortsätt med {selected.length} övning
            {selected.length !== 1 ? "ar" : ""}
          </button>
        </div>
      )}
    </div>
  );
};

export default ExercisePicker;
