'use client'
import { useState } from 'react'
import { Heart, Sun, Moon, Cloud, Smile, Meh, Frown, Wind, Sparkles, Calendar } from 'lucide-react'

const MOODS = [
  { icon: Smile, label: 'Great', color: 'bg-green-500', value: 5 },
  { icon: Smile, label: 'Good', color: 'bg-lime-500', value: 4 },
  { icon: Meh, label: 'Okay', color: 'bg-yellow-500', value: 3 },
  { icon: Frown, label: 'Low', color: 'bg-orange-500', value: 2 },
  { icon: Frown, label: 'Struggling', color: 'bg-red-500', value: 1 },
]

const ACTIVITIES = ['Exercise', 'Meditation', 'Journaling', 'Social time', 'Nature walk', 'Creative hobby', 'Deep breathing', 'Good sleep']

export default function Home() {
  const [mood, setMood] = useState(null)
  const [activities, setActivities] = useState([])
  const [journal, setJournal] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [weekData] = useState([4, 3, 4, 5, 3, null, null])

  const toggleActivity = (activity) => {
    setActivities(prev => prev.includes(activity) ? prev.filter(a => a !== activity) : [...prev, activity])
  }

  const handleSubmit = () => {
    if (mood) setSubmitted(true)
  }

  const suggestion = mood && mood <= 2 
    ? "It's okay to have difficult days. Consider trying a short breathing exercise or reaching out to someone you trust. Remember, you're not alone." 
    : mood === 3 
    ? "Some days are just okay, and that's perfectly fine. A short walk or your favorite music might help lift your spirits."
    : "Wonderful! Keep doing what makes you feel good. Consider sharing your positive energy with someone who might need it."

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <Heart className="text-rose-500" />
          Wellness Check-in
        </h1>
        <p className="text-gray-600 mb-8">How are you feeling today?</p>

        {!submitted ? (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-medium text-gray-800 mb-4">Select your mood</h3>
              <div className="flex justify-between">
                {MOODS.map((m) => {
                  const Icon = m.icon
                  return (
                    <button
                      key={m.value}
                      onClick={() => setMood(m.value)}
                      className={`flex flex-col items-center p-3 rounded-xl transition-all ${mood === m.value ? `${m.color} text-white scale-110` : 'hover:bg-gray-50'}`}
                    >
                      <Icon size={32} className={mood === m.value ? 'text-white' : 'text-gray-400'} />
                      <span className="text-sm mt-1">{m.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-medium text-gray-800 mb-4">What did you do today?</h3>
              <div className="flex flex-wrap gap-2">
                {ACTIVITIES.map((activity) => (
                  <button
                    key={activity}
                    onClick={() => toggleActivity(activity)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${activities.includes(activity) ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-medium text-gray-800 mb-4">Anything on your mind?</h3>
              <textarea
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                placeholder="Write freely... this is your safe space"
                className="w-full h-32 p-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!mood}
              className="w-full py-4 bg-gradient-to-r from-rose-500 to-purple-500 text-white rounded-xl font-medium disabled:opacity-50"
            >
              Complete Check-in
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-rose-500 to-purple-500 rounded-2xl p-6 text-white text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-3" />
              <h2 className="text-2xl font-bold mb-2">Check-in Complete!</h2>
              <p className="text-rose-100">Thank you for taking time for yourself today</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <Wind className="text-purple-500" /> Personalized Suggestion
              </h3>
              <p className="text-gray-600">{suggestion}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="text-purple-500" /> Your Week
              </h3>
              <div className="flex justify-between items-end h-32">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                  <div key={day} className="flex flex-col items-center gap-2">
                    <div 
                      className={`w-8 rounded-t-lg ${weekData[i] ? MOODS[5 - weekData[i]].color : 'bg-gray-200'}`}
                      style={{ height: weekData[i] ? `${weekData[i] * 20}px` : '20px' }}
                    />
                    <span className="text-xs text-gray-500">{day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-purple-50 rounded-2xl p-4 text-center text-sm text-purple-700">
              <p>If you're experiencing a mental health crisis, please reach out:</p>
              <p className="font-medium mt-1">988 Suicide & Crisis Lifeline: Call or text 988</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
