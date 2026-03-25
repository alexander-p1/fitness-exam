import { useEffect, useState } from "react";
import apiFetch from "../../api/api.js";
import { useNavigate } from "react-router";

const WorkoutBuilder = () => {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  // Alla övningar från api
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("");

  const [selectedExercises, setSelectedExercises] = useState([]);

  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  // Hämtar övningar när filter eller search ändras
  useEffect(() => {
    const controller = new AbortController();

    const fetchExercises = async () => {
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (muscleFilter) params.append("muscleGroup", muscleFilter);

        const data = await apiFetch(`/exercises?${params}`, {
          signal: controller.signal,
        });
        setExercises(data);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error(err);
      }
    };
    fetchExercises();
    return () => controller.abort();
  }, [search, muscleFilter]);

  // Här lägger jag till övning i passet
  const addExercise = (exercise) => {
    const alreadyAdded = selectedExercises.find(
      (e) => e.exercise._id === exercise._id,
    );
    if (alreadyAdded) return;

    setSelectedExercises([
      ...selectedExercises,
      {
        exercise,
        sets: [{ reps: "", weight: "" }],
      },
    ]);
  };

  // Lägger till ett set på en övning
  const addSet = (exerciseId) => {
    setSelectedExercises(
      selectedExercises.map((e) =>
        e.exercise._id === exerciseId
          ? { ...e, sets: [...e.sets, { reps: "", weight: "" }] }
          : e,
      ),
    );
  };

  // Ta bort ett set
  const removeSet = (exerciseId, setIndex) => {
    setSelectedExercises(
      selectedExercises.map((e) =>
        e.exercise._id === exerciseId
          ? { ...e, sets: e.sets.filter((_, i) => i !== setIndex) }
          : e,
      ),
    );
  };

  // Uppdatera reps/vikt på ett set
  const updateSet = (exerciseId, setIndex, field, value) => {
    setSelectedExercises(
      selectedExercises.map((e) =>
        e.exercise._id === exerciseId
          ? {
              ...e,
              sets: e.sets.map((s, i) =>
                i === setIndex ? { ...s, [field]: value } : s,
              ),
            }
          : e,
      ),
    );
  };

  // Ta bort en hel övning
  const removeExercise = (exerciseId) => {
    setSelectedExercises(
      selectedExercises.filter((e) => e.exercise._id !== exerciseId),
    );
  };

  // Spara pass
  const handleSave = async () => {
    if (!title) return setError("Ange en titel på passet.");
    if (selectedExercises.length === 0)
      return setError("Lägg till minst en övning.");
    setError(null);
    setLoading(true);

    try {
      const payload = {
        title,
        notes,
        exercises: selectedExercises.map((e) => ({
          exercise: e.exercise._id,
          sets: e.sets.map((s) => ({
            reps: Number(s.reps),
            weight: Number(s.weight),
          })),
        })),
      };

      await apiFetch("/workouts", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Något gick fel");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Nytt träningspass</h1>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {/* titel och anteckningar */}
      <div className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Namn på passet, t.ex. Bröst & Triceps"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md bg-white/5 px-3 py-2 text-white outline-1 outline-white/10 focus:outline-indigo-500"
        />
        <textarea
          placeholder="Anteckningar (valfritt)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-md bg-white/5 px-3 py-2 text-white outline-1 outline-white/10 focus:outline-indigo-500"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* välj övningar */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Välj övningar</h2>

          <div className="space-y-2 mb-4">
            <input
              type="text"
              placeholder="Sök övning..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md bg-white/5 px-3 py-2 text-white outline-1 outline-white/10 focus:outline-indigo-500"
            />
            <select
              value={muscleFilter}
              onChange={(e) => setMuscleFilter(e.target.value)}
              className="w-full rounded-md bg-gray-800 px-3 py-2 text-white outline-1 outline-white/10"
            >
              <option value="">Alla muskelgrupper</option>
              {muscleGroups.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {exercises.map((exercise) => (
              <div
                key={exercise._id}
                className="flex justify-between items-center bg-white/5 rounded-md px-3 py-2"
              >
                <div>
                  <p className="font-medium">{exercise.name}</p>
                  <p className="text-xs text-gray-400">
                    {exercise.muscleGroup}
                  </p>
                </div>
                <button
                  onClick={() => addExercise(exercise)}
                  disabled={selectedExercises.some(
                    (e) => e.exercise._id === exercise._id,
                  )}
                  className="text-sm bg-indigo-500 hover:bg-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed px-3 py-1 rounded-md"
                >
                  Lägg till
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* mina valda övningar */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Ditt pass</h2>

          {selectedExercises.length === 0 && (
            <p className="text-gray-500">Inga övningar tillagda än</p>
          )}

          <div className="space-y-4">
            {selectedExercises.map(({ exercise, sets }) => (
              <div key={exercise._id} className="bg-white/5 rounded-md p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">{exercise.name}</h3>
                  <button
                    onClick={() => removeExercise(exercise._id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Ta bort
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 mb-1 px-1">
                  <span>Set</span>
                  <span>Reps</span>
                  <span>Vikt (kg)</span>
                </div>

                {sets.map((set, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-2 mb-2 items-center"
                  >
                    <span className="text-sm text-gray-400 px-1">
                      {index + 1}
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      value={set.reps}
                      onChange={(e) =>
                        updateSet(exercise._id, index, "reps", e.target.value)
                      }
                      className="rounded bg-white/10 px-2 py-1 text-white text-sm w-full"
                    />
                    <div className="flex gap-1">
                      <input
                        type="number"
                        placeholder="0"
                        value={set.weight}
                        onChange={(e) =>
                          updateSet(
                            exercise._id,
                            index,
                            "weight",
                            e.target.value,
                          )
                        }
                        className="rounded bg-white/10 px-2 py-1 text-white text-sm w-full"
                      />
                      {sets.length > 1 && (
                        <button
                          onClick={() => removeSet(exercise._id, index)}
                          className="text-red-400 hover:text-red-300 text-xs px-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => addSet(exercise._id)}
                  className="text-sm text-indigo-400 hover:text-indigo-300 mt-1"
                >
                  + Lägg till set
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 py-3 rounded-md font-semibold"
        >
          {loading ? "Sparar..." : "Spara pass"}
        </button>
      </div>
    </div>
  );
};

export default WorkoutBuilder;
