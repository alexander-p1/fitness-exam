import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import apiFetch from '../../api/api.js'

const Workout = () => {
  const { state } = useLocation() // hämta övningar från ExercisePicker
  const navigate = useNavigate()

  // Om någon navigerar hit direkt utan övningar – skicka tillbaka
  if (!state?.exercises) {
    navigate('/workout/new')
    return null
  }

  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [selectedExercises, setSelectedExercises] = useState(
    // Forma om till rätt struktur med tomma sets direkt
    state.exercises.map(exercise => ({
      exercise,
      sets: [{ reps: '', weight: '' }]
    }))
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const addSet = (exerciseId) => {
    setSelectedExercises(selectedExercises.map(e =>
      e.exercise._id === exerciseId
        ? { ...e, sets: [...e.sets, { reps: '', weight: '' }] }
        : e
    ))
  }

  const removeSet = (exerciseId, setIndex) => {
    setSelectedExercises(selectedExercises.map(e =>
      e.exercise._id === exerciseId
        ? { ...e, sets: e.sets.filter((_, i) => i !== setIndex) }
        : e
    ))
  }

  const updateSet = (exerciseId, setIndex, field, value) => {
    setSelectedExercises(selectedExercises.map(e =>
      e.exercise._id === exerciseId
        ? {
            ...e,
            sets: e.sets.map((s, i) =>
              i === setIndex ? { ...s, [field]: value } : s
            )
          }
        : e
    ))
  }

  const handleSave = async () => {
    if (!title) return setError('Ange en titel på passet')

    const hasEmptySets = selectedExercises.some(e =>
      e.sets.some(s => s.reps === '' || s.weight === '')
    )
    if (hasEmptySets) return setError('Fyll i reps och vikt för alla sets')

    setError(null)
    setLoading(true)

    try {
      await apiFetch('/workouts', {
        method: 'POST',
        body: JSON.stringify({
          title,
          notes,
          exercises: selectedExercises.map(e => ({
            exercise: e.exercise._id,
            sets: e.sets.map(s => ({
              reps: Number(s.reps),
              weight: Number(s.weight)
            }))
          }))
        })
      })
      navigate('/workouts')
    } catch (err) {
      setError(err.message || 'Något gick fel')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/workout/new')}
        className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-2"
      >
        ← Ändra övningar
      </button>

      <h1 className="text-2xl font-bold mb-6">Bygg ditt pass</h1>

      {error && (
        <div className="mb-4 bg-red-400 p-3 text-sm rounded-md text-black">
          {error}
        </div>
      )}

      {/* Titel och anteckningar */}
      <div className="space-y-3 mb-8">
        <input
          type="text"
          placeholder="Namn på passet, t.ex. Bröst & Triceps"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full rounded-md bg-white/5 px-3 py-2 text-white outline-1 outline-white/10 focus:outline-emerald-500"
        />
        <textarea
          placeholder="Anteckningar (valfritt)"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="w-full rounded-md bg-white/5 px-3 py-2 text-white outline-1 outline-white/10 focus:outline-emerald-500"
          rows={2}
        />
      </div>

      {/* Övningar */}
      <div className="space-y-4 mb-8">
        {selectedExercises.map(({ exercise, sets }) => (
          <div key={exercise._id} className="bg-white/5 rounded-xl p-4">
            <h3 className="font-semibold mb-3">
              {exercise.name}
              <span className="text-gray-500 text-xs ml-2">{exercise.muscleGroup}</span>
            </h3>

            <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 mb-1 px-1">
              <span>Set</span>
              <span>Reps</span>
              <span>Vikt (kg)</span>
            </div>

            {sets.map((set, index) => (
              <div key={index} className="grid grid-cols-3 gap-2 mb-2 items-center">
                <span className="text-sm text-gray-400 px-1">{index + 1}</span>
                <input
                  type="number"
                  placeholder="0"
                  value={set.reps}
                  onChange={e => updateSet(exercise._id, index, 'reps', e.target.value)}
                  className="rounded bg-white/10 px-2 py-1 text-white text-sm w-full"
                />
                <div className="flex gap-1">
                  <input
                    type="number"
                    placeholder="0"
                    value={set.weight}
                    onChange={e => updateSet(exercise._id, index, 'weight', e.target.value)}
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
              className="text-sm text-emerald-400 hover:text-emerald-300 mt-1"
            >
              + Lägg till set
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full hover:cursor-pointer bg-emerald-500 hover:bg-emerald-600 py-3 rounded-lg font-semibold transition-colors"
      >
        {loading ? 'Sparar...' : 'Spara pass'}
      </button>
    </div>
  )
}

export default Workout