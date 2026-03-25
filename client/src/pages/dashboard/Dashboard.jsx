import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext.jsx";
import apiFetch from "../../api/api.js";

const Dashboard = () => {
    const [workouts, setWorkouts] = useState([])
    const [loading, setLoading] = useState(true)

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const data = await apiFetch("/workouts")
                setWorkouts(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchWorkouts()
    }, [])

    const recentWorkouts = workouts.slice(0, 5)

    if (loading) return <p className="text-white p-6">Laddar..</p>

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Välkommen, {user?.name}! </h1>
        <p className="text-gray-400 mt-1">Let's go</p>
      </div>

      {/* Totala antalet pass */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white/5 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Totalt antal pass</p>
          <p className="text-4xl font-bold mt-1">{workouts.length}</p>
        </div>

        <button
          onClick={() => navigate('/workout/new')}
          className="bg-indigo-500 hover:bg-indigo-400 rounded-xl p-5 text-left transition-colors"
        >
          <p className="text-lg font-semibold">+ Nytt pass</p>
          <p className="text-indigo-200 text-sm mt-1">Starta ett pass</p>
        </button>
      </div>

      {/* Senaste passen */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Senaste passen</h2>

        {recentWorkouts.length === 0 ? (
          <p className="text-gray-500">Inga pass loggade.</p>
        ) : (
          <div className="space-y-3">
            {recentWorkouts.map(workout => (
              <div
                key={workout._id}
                className="bg-white/5 rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{workout.title}</p>
                  <p className="text-gray-400 text-sm mt-0.5">
                    {new Date(workout.date).toLocaleDateString('sv-SE')} · {workout.exercises.length} övningar
                  </p>
                </div>
                <button
                  onClick={() => navigate('/workouts')}
                  className="text-indigo-400 hover:text-indigo-300 text-sm"
                >
                  Visa
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    )
}
export default Dashboard;