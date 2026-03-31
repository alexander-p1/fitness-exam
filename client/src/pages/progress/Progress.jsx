import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import apiFetch from "../../api/api.js";
import CircularIndeterminate from "../../components/LoadingSpinner.jsx";

const Progress = () => {
  const [workouts, setWorkouts] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await apiFetch("/workouts");
        setWorkouts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, []);

  // lista av unika övningar från alla workouts för dropdown, bara de övningar du har med i dina pass
  const uniqueExercises = workouts
    .flatMap((w) => w.exercises)
    .reduce((acc, { exercise }) => {
      const alreadyExists = acc.find((e) => e._id === exercise._id);
      if (!alreadyExists) acc.push(exercise);
      return acc;
    }, [])
    .sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    if (!selectedExerciseId) {
      setChartData([]);
      return;
    }

    // kollar på varje pass och högsta vikt/reps för just den dagen
    const data = workouts
      .filter((w) =>
        w.exercises.some((e) => e.exercise._id === selectedExerciseId),
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((w) => {
        const match = w.exercises.find(
          (e) => e.exercise._id === selectedExerciseId,
        );
        const sets = match.sets;

        const maxWeight = Math.max(...sets.map((s) => Number(s.weight)));
        const maxReps = Math.max(...sets.map((s) => Number(s.reps)));

        return {
          date: new Date(w.date).toLocaleDateString("sv-SE", {
            day: "numeric",
            month: "short",
            year: "numeric"
          }),
          maxWeight,
          maxReps,
        };
      });
    setChartData(data);
  }, [selectedExerciseId, workouts]);
  if (loading) return <CircularIndeterminate />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Progress</h1>
      {/* Dropdown */}
      <div className="mb-8">
        <label className="block text-sm text-zinc-400 mb-2">Välj övning</label>
        <select
          value={selectedExerciseId}
          onChange={(e) => setSelectedExerciseId(e.target.value)}
          className="bg-zinc-800 text-white rounded-lg px-4 py-2.5 outline-none border border-white/10 focus:border-zinc-500 w-full sm:w-72"
        >
          <option value="">Välj en övning</option>
          {uniqueExercises.map((exercise) => (
            <option key={exercise._id} value={exercise._id}>
              {exercise.name}
            </option>
          ))}
        </select>
      </div>

      {!selectedExerciseId && (
        <p className="text-gray-500">Välj en övning för att se progress.</p>
      )}

      {selectedExerciseId && chartData.length === 0 && (
        <p className="text-gray-500">
          Ingen data hittades för den här övningen.
        </p>
      )}

      {/* Grafer */}
      {chartData.length > 0 && (
        <div className="space-y-10">
          <div>
            <h2 className="text-lg font-semibold mb-4">Maxvikt (kg)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} unit=" kg" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="maxWeight"
                  name="Maxvikt"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: "#6366f1", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Reps</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="maxReps"
                  name="Reps"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  dot={{ fill: "#22d3ee", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
export default Progress;
