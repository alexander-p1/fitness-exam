import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext.jsx";
import apiFetch from "../../api/api.js";
import CircularIndeterminate from "../../components/LoadingSpinner.jsx";

const Dashboard = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const navigate = useNavigate();

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

  const recentWorkouts = workouts.slice(0, 5);

  if (loading) return <CircularIndeterminate />;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Välkommen, <span className="text-red-400">{user.name}</span>!{" "}
        </h1>
      </div>

      {/* Totala antalet pass */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className=" rounded-xl p-5 bg-emerald-400/20">
          <p className="text-gray-400 text-sm">Totalt antal pass</p>
          <p className="text-4xl font-bold mt-1">{workouts.length}</p>
        </div>

        <button
          onClick={() => navigate("/workout/new")}
          className="bg-emerald-400/20 hover:bg-emerald-600 hover:cursor-pointer rounded-xl p-5 text-left transition-colors"
        >
          <p className="text-lg font-semibold">+ Nytt pass</p>
          <p className="text-zinc-500 text-sm mt-1">Starta ett pass</p>
        </button>
      </div>

      {/* Senaste passen */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Senaste passen</h2>

        {recentWorkouts.length === 0 ? (
          <p className="text-gray-500">Inga pass loggade.</p>
        ) : (
          <div className="space-y-3 ">
            {recentWorkouts.map((workout) => (
              <div
                key={workout._id}
                className="bg-zinc-800 rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{workout.title}</p>
                  <p className="text-gray-400 text-sm mt-0.5">
                    {new Date(workout.date).toLocaleDateString("sv-SE")} ·{" "}
                    {workout.exercises.length} övningar
                  </p>
                </div>
                <button
                  onClick={() => navigate("/workouts")}
                  className="text-white hover:text-zinc-300 text-sm hover:cursor-pointer"
                >
                  Visa
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Dashboard;
