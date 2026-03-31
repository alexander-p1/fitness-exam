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

  const weeklyGoal = 4; 

  const workoutsThisWeek = workouts.filter((w) => {
    const workoutDate = new Date(w.date);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return workoutDate >= sevenDaysAgo; 
  }).length;

  const progressPercentage = Math.min(
    (workoutsThisWeek / weeklyGoal) * 100,
    100,
  );

  if (loading) return <CircularIndeterminate />;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Halli Hallå, <span className="text-red-400">{user.name}</span>!
        </h1>
      </div>

      <div className="bg-zinc-800 rounded-md p-5 mb-8 border border-zinc-700">
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="font-semibold text-lg">Goals</p>
            <p className="text-sm text-gray-400">
              Kör {weeklyGoal} pass denna veckan
            </p>
          </div>
          <p className="font-medium text-emerald-400">
            {workoutsThisWeek} / {weeklyGoal} pass
          </p>
        </div>

        <div className="w-full bg-zinc-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-emerald-400 h-3 rounded-full transition-all duration-1000 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {workoutsThisWeek >= weeklyGoal && (
          <p className="text-xs text-emerald-400 mt-2 text-right">
            Snyggt!
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className=" rounded-md p-5 bg-emerald-400/20">
          <p className="text-gray-400 text-sm">Totalt antal pass</p>
          <p className="text-4xl font-bold mt-1">{workouts.length}</p>
        </div>

        <button
          onClick={() => navigate("/workout/new")}
          className="bg-emerald-400/20 hover:bg-emerald-600 hover:cursor-pointer rounded-md p-5 text-left transition-colors"
        >
          <p className="text-lg font-semibold">+ Nytt pass</p>
          <p className="text-zinc-500 text-sm mt-1">Starta ett pass</p>
        </button>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Senaste passen</h2>

        {recentWorkouts.length === 0 ? (
          <div className="text-center py-10 bg-zinc-800 rounded-md border border-zinc-700">
            <p className="text-gray-500 text-sm mb-4">Inga pass loggade.</p>
            <button
              onClick={() => navigate("/workout/new")}
              className="bg-emerald-500 hover:cursor-pointer text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-400 transition-colors"
            >
              Starta ditt första pass
            </button>
          </div>
        ) : (
          <div className="space-y-3 ">
            {recentWorkouts.map((workout) => (
              <div
                key={workout._id}
                className="bg-zinc-800 rounded-md p-4 flex justify-between items-center"
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
