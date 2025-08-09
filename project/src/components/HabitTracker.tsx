import React, { useState, useEffect } from 'react';
import { Plus, Check, Flame, Calendar, Target } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  createdAt: string;
  completedDates: string[];
}

const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitEmoji, setNewHabitEmoji] = useState('⭐');
  const [newHabitColor, setNewHabitColor] = useState('emerald');

  const habitColors = [
    { name: 'emerald', class: 'from-emerald-500 to-green-500', bg: 'bg-emerald-100', border: 'border-emerald-200' },
    { name: 'blue', class: 'from-blue-500 to-cyan-500', bg: 'bg-blue-100', border: 'border-blue-200' },
    { name: 'purple', class: 'from-purple-500 to-pink-500', bg: 'bg-purple-100', border: 'border-purple-200' },
    { name: 'orange', class: 'from-orange-500 to-red-500', bg: 'bg-orange-100', border: 'border-orange-200' },
    { name: 'teal', class: 'from-teal-500 to-emerald-500', bg: 'bg-teal-100', border: 'border-teal-200' },
    { name: 'rose', class: 'from-rose-500 to-pink-500', bg: 'bg-rose-100', border: 'border-rose-200' },
  ];

  const habitEmojis = ['⭐', '💫', '🌟', '✨', '🌸', '🌿', '🍃', '🌱', '🦋', '🧚‍♀️', '🌺', '🌼', '💝', '💖', '🎯', '🔥'];

  useEffect(() => {
    const savedHabits = localStorage.getItem('fairyHabits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    } else {
      // Add some default habits
      const defaultHabits: Habit[] = [
        {
          id: '1',
          name: 'Morning Meditation',
          emoji: '🧘‍♀️',
          color: 'emerald',
          createdAt: new Date().toISOString(),
          completedDates: []
        },
        {
          id: '2',
          name: 'Drink Water',
          emoji: '💧',
          color: 'blue',
          createdAt: new Date().toISOString(),
          completedDates: []
        },
        {
          id: '3',
          name: 'Read Books',
          emoji: '📚',
          color: 'purple',
          createdAt: new Date().toISOString(),
          completedDates: []
        }
      ];
      setHabits(defaultHabits);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fairyHabits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = () => {
    if (newHabitName.trim()) {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: newHabitName.trim(),
        emoji: newHabitEmoji,
        color: newHabitColor,
        createdAt: new Date().toISOString(),
        completedDates: []
      };
      setHabits([...habits, newHabit]);
      setNewHabitName('');
      setNewHabitEmoji('⭐');
      setNewHabitColor('emerald');
      setShowAddForm(false);
    }
  };

  const toggleHabitToday = (habitId: string) => {
    const today = new Date().toDateString();
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const completedDates = habit.completedDates.includes(today)
          ? habit.completedDates.filter(date => date !== today)
          : [...habit.completedDates, today];
        return { ...habit, completedDates };
      }
      return habit;
    }));
  };

  const getStreak = (habit: Habit) => {
    if (habit.completedDates.length === 0) return 0;
    
    const sortedDates = habit.completedDates
      .map(date => new Date(date))
      .sort((a, b) => b.getTime() - a.getTime());
    
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < sortedDates.length; i++) {
      const habitDate = sortedDates[i];
      const daysDiff = Math.floor((currentDate.getTime() - habitDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getColorClasses = (colorName: string) => {
    return habitColors.find(c => c.name === colorName) || habitColors[0];
  };

  const isCompletedToday = (habit: Habit) => {
    const today = new Date().toDateString();
    return habit.completedDates.includes(today);
  };

  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date);
    }
    return dates;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 font-serif mb-2">
          💫 Habit Tracker 💫
        </h2>
        <p className="text-emerald-600">Build magical habits that transform your fairy tale life</p>
      </div>

      {/* Add Habit Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Habit</span>
        </button>
      </div>

      {/* Add Habit Form */}
      {showAddForm && (
        <div className="backdrop-blur-md bg-white/70 rounded-2xl p-6 border border-emerald-200/50">
          <h3 className="text-lg font-semibold text-emerald-800 mb-4">Create New Habit</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">Habit Name</label>
              <input
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="e.g., Morning Exercise"
                className="w-full px-4 py-2 rounded-xl border border-emerald-200 focus:border-emerald-400 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 bg-white/80"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">Choose Emoji</label>
              <div className="grid grid-cols-8 gap-2">
                {habitEmojis.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setNewHabitEmoji(emoji)}
                    className={`p-2 rounded-lg text-xl transition-all duration-200 ${
                      newHabitEmoji === emoji 
                        ? 'bg-emerald-200 ring-2 ring-emerald-400' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">Choose Color</label>
              <div className="grid grid-cols-6 gap-2">
                {habitColors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setNewHabitColor(color.name)}
                    className={`h-8 rounded-lg bg-gradient-to-r ${color.class} transition-all duration-200 ${
                      newHabitColor === color.name 
                        ? 'ring-2 ring-gray-400 transform scale-110' 
                        : 'hover:transform hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-emerald-600 border border-emerald-200 rounded-xl hover:bg-emerald-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={addHabit}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-200"
              >
                Add Habit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Habits List */}
      <div className="grid gap-4">
        {habits.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-emerald-700 mb-2">No habits yet!</h3>
            <p className="text-emerald-600">Start building magical habits that will transform your life.</p>
          </div>
        ) : (
          habits.map(habit => {
            const colorClasses = getColorClasses(habit.color);
            const streak = getStreak(habit);
            const completedToday = isCompletedToday(habit);
            const weekDates = getWeekDates();

            return (
              <div key={habit.id} className={`backdrop-blur-md bg-white/50 rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg ${colorClasses.border}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{habit.emoji}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{habit.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Flame className="w-4 h-4 mr-1 text-orange-500" />
                          {streak} day streak
                        </span>
                        <span className="flex items-center">
                          <Target className="w-4 h-4 mr-1 text-emerald-500" />
                          {habit.completedDates.length} total
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleHabitToday(habit.id)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 transform hover:scale-110 ${
                      completedToday
                        ? `bg-gradient-to-r ${colorClasses.class} text-white shadow-lg`
                        : `bg-white border-2 ${colorClasses.border} hover:${colorClasses.bg}`
                    }`}
                  >
                    {completedToday ? <Check className="w-6 h-6" /> : habit.emoji}
                  </button>
                </div>

                {/* Weekly Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">This Week</span>
                    <span className="text-xs text-gray-500">
                      {weekDates.filter(date => habit.completedDates.includes(date.toDateString())).length}/7 days
                    </span>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {weekDates.map((date, index) => {
                      const isCompleted = habit.completedDates.includes(date.toDateString());
                      const isToday = date.toDateString() === new Date().toDateString();
                      
                      return (
                        <div key={index} className="text-center">
                          <div className="text-xs text-gray-500 mb-1">
                            {date.toLocaleDateString('en', { weekday: 'narrow' })}
                          </div>
                          <div
                            className={`w-8 h-8 rounded-lg mx-auto transition-all duration-200 flex items-center justify-center ${
                              isCompleted
                                ? `bg-gradient-to-r ${colorClasses.class} text-white`
                                : isToday
                                ? `border-2 ${colorClasses.border} bg-white`
                                : `bg-gray-100`
                            }`}
                          >
                            {isCompleted && <Check className="w-4 h-4" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HabitTracker;