import { useState, useEffect } from "react";
import apiFetch from "../../api/api.js";

const WorkoutLog = () => {
  const [workouts, setWorkouts] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
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

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/workouts/${id}`, { method: "DELETE" });
      setWorkouts(workouts.filter((w) => w._id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-white p-6">Laddar..</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Träningslogg</h1>

      {workouts.length === 0 ? (
        <p className="text-gray-500">Inga pass loggade än.</p>
      ) : (
        <div className="space-y-3">
          {workouts.map((workout) => (
            <div
              key={workout._id}
              className="bg-white/5 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleExpand(workout._id)}
                className="w-full flex justify-between items-center p-4 hover:bg-white/10 transition-colors text-left"
              >
                <div>
                  <p className="font-semibold">{workout.title}</p>
                  <p className="text-gray-400 text-sm mt-0.5">
                    {new Date(workout.date).toLocaleDateString("sv-SE")} ·{" "}
                    {workout.exercises.length} övningar
                  </p>
                </div>
                <span className="text-gray-400 text-lg">
                  {expandedId === workout._id ? "▲" : "▼"}
                </span>
              </button>

              {/* utvidgat innehåll */}
              {expandedId === workout._id && (
                <div className="px-4 pb-4 border-t border-white/10">
                  <div className="mt-4 space-y-4">
                    {workout.exercises.map(({ exercise, sets }, index) => (
                      <div key={index}>
                        <p className="font-medium text-emerald-300 mb-2">
                          {exercise.name}
                          <span className="text-gray-500 text-xs ml-2">
                            {exercise.muscleGroup}
                          </span>
                        </p>

                        {/* sets */}
                        <div className="grid grid-cols-3 text-xs text-gray-400 mb-1 px-1">
                          <span>Set</span>
                          <span>Reps</span>
                          <span>Vikt</span>
                        </div>
                        {sets.map((set, i) => (
                          <div
                            key={i}
                            className="grid grid-cols-3 text-sm px-1 py-0.5"
                          >
                            <span className="text-gray-400">{i + 1}</span>
                            <span>{set.reps}</span>
                            <span>{set.weight} kg</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {workout.notes && (
                    <p className="text-gray-400 text-sm mt-4 italic">
                      "{workout.notes}"
                    </p>
                  )}

                  <button
                    onClick={() => handleDelete(workout._id)}
                    className="mt-4 text-red-400 hover:text-red-300 text-sm"
                  >
                    Ta bort pass
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutLog;