import React, { useState, useEffect } from 'react';
import { Plus, Heart, Star, Lightbulb, Sparkles } from 'lucide-react';

interface Inspiration {
  id: string;
  text: string;
  author: string;
  category: string;
  color: string;
  createdAt: string;
}

const InspirationBoard: React.FC = () => {
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newInspiration, setNewInspiration] = useState({
    text: '',
    author: '',
    category: 'motivation',
    color: 'emerald'
  });

  const categories = [
    { id: 'motivation', label: 'Motivation', icon: '💪', color: 'from-emerald-500 to-green-500' },
    { id: 'wisdom', label: 'Wisdom', icon: '🦉', color: 'from-blue-500 to-cyan-500' },
    { id: 'love', label: 'Love', icon: '💖', color: 'from-pink-500 to-rose-500' },
    { id: 'success', label: 'Success', icon: '🏆', color: 'from-yellow-500 to-orange-500' },
    { id: 'peace', label: 'Peace', icon: '🕊️', color: 'from-purple-500 to-indigo-500' },
    { id: 'growth', label: 'Growth', icon: '🌱', color: 'from-teal-500 to-emerald-500' },
  ];

  const colors = [
    { name: 'emerald', class: 'from-emerald-100 to-green-100', border: 'border-emerald-200', text: 'text-emerald-800' },
    { name: 'blue', class: 'from-blue-100 to-cyan-100', border: 'border-blue-200', text: 'text-blue-800' },
    { name: 'purple', class: 'from-purple-100 to-pink-100', border: 'border-purple-200', text: 'text-purple-800' },
    { name: 'orange', class: 'from-orange-100 to-red-100', border: 'border-orange-200', text: 'text-orange-800' },
    { name: 'rose', class: 'from-rose-100 to-pink-100', border: 'border-rose-200', text: 'text-rose-800' },
    { name: 'teal', class: 'from-teal-100 to-emerald-100', border: 'border-teal-200', text: 'text-teal-800' },
  ];

  const defaultInspirations: Inspiration[] = [
    {
      id: '1',
      text: 'The only way to do great work is to love what you do.',
      author: 'Steve Jobs',
      category: 'success',
      color: 'emerald',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      text: 'In the middle of difficulty lies opportunity.',
      author: 'Albert Einstein',
      category: 'motivation',
      color: 'blue',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      text: 'Be yourself; everyone else is already taken.',
      author: 'Oscar Wilde',
      category: 'wisdom',
      color: 'purple',
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      text: 'The future belongs to those who believe in the beauty of their dreams.',
      author: 'Eleanor Roosevelt',
      category: 'growth',
      color: 'rose',
      createdAt: new Date().toISOString()
    },
    {
      id: '5',
      text: 'Peace comes from within. Do not seek it without.',
      author: 'Buddha',
      category: 'peace',
      color: 'teal',
      createdAt: new Date().toISOString()
    },
    {
      id: '6',
      text: 'Love yourself first and everything else falls into line.',
      author: 'Lucille Ball',
      category: 'love',
      color: 'orange',
      createdAt: new Date().toISOString()
    }
  ];

  useEffect(() => {
    const savedInspirations = localStorage.getItem('fairyInspirations');
    if (savedInspirations) {
      setInspirations(JSON.parse(savedInspirations));
    } else {
      setInspirations(defaultInspirations);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fairyInspirations', JSON.stringify(inspirations));
  }, [inspirations]);

  const addInspiration = () => {
    if (newInspiration.text.trim()) {
      const inspiration: Inspiration = {
        id: Date.now().toString(),
        text: newInspiration.text.trim(),
        author: newInspiration.author.trim() || 'Anonymous',
        category: newInspiration.category,
        color: newInspiration.color,
        createdAt: new Date().toISOString()
      };
      setInspirations([inspiration, ...inspirations]);
      setNewInspiration({
        text: '',
        author: '',
        category: 'motivation',
        color: 'emerald'
      });
      setShowAddForm(false);
    }
  };

  const getColorClasses = (colorName: string) => {
    return colors.find(c => c.name === colorName) || colors[0];
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId) || categories[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 font-serif mb-2">
          ✨ Inspiration Board ✨
        </h2>
        <p className="text-emerald-600">Collect magical quotes and wisdom that inspire your journey</p>
      </div>

      {/* Add Inspiration Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Inspiration</span>
        </button>
      </div>

      {/* Add Inspiration Form */}
      {showAddForm && (
        <div className="backdrop-blur-md bg-white/70 rounded-2xl p-6 border border-emerald-200/50">
          <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2" />
            Add New Inspiration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">Quote or Message</label>
              <textarea
                value={newInspiration.text}
                onChange={(e) => setNewInspiration({...newInspiration, text: e.target.value})}
                placeholder="Enter an inspiring quote or message..."
                className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:border-emerald-400 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 bg-white/80 resize-none h-24"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">Author (Optional)</label>
              <input
                type="text"
                value={newInspiration.author}
                onChange={(e) => setNewInspiration({...newInspiration, author: e.target.value})}
                placeholder="e.g., Maya Angelou"
                className="w-full px-4 py-2 rounded-xl border border-emerald-200 focus:border-emerald-400 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 bg-white/80"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">Category</label>
                <select
                  value={newInspiration.category}
                  onChange={(e) => setNewInspiration({...newInspiration, category: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-emerald-200 focus:border-emerald-400 bg-white/80"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">Color Theme</label>
                <div className="grid grid-cols-6 gap-1">
                  {colors.map(color => (
                    <button
                      key={color.name}
                      onClick={() => setNewInspiration({...newInspiration, color: color.name})}
                      className={`h-8 rounded-lg bg-gradient-to-r ${color.class} transition-all duration-200 ${
                        newInspiration.color === color.name 
                          ? 'ring-2 ring-gray-400 transform scale-110' 
                          : 'hover:transform hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
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
                onClick={addInspiration}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-200"
              >
                Add Inspiration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspirations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inspirations.map(inspiration => {
          const colorClasses = getColorClasses(inspiration.color);
          const categoryInfo = getCategoryInfo(inspiration.category);

          return (
            <div
              key={inspiration.id}
              className={`backdrop-blur-md bg-gradient-to-br ${colorClasses.class} rounded-2xl p-6 border ${colorClasses.border} transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/50 ${colorClasses.text}`}>
                  <span className="mr-1">{categoryInfo.icon}</span>
                  {categoryInfo.label}
                </div>
                <Sparkles className={`w-4 h-4 ${colorClasses.text} opacity-60`} />
              </div>

              <blockquote className={`text-lg font-medium ${colorClasses.text} mb-4 leading-relaxed`}>
                "{inspiration.text}"
              </blockquote>

              <footer className="flex items-center justify-between">
                <cite className={`text-sm font-medium ${colorClasses.text} opacity-80`}>
                  — {inspiration.author}
                </cite>
                <div className="flex items-center space-x-1">
                  <Heart className={`w-4 h-4 ${colorClasses.text} opacity-60`} />
                  <Star className={`w-4 h-4 ${colorClasses.text} opacity-60`} />
                </div>
              </footer>
            </div>
          );
        })}
      </div>

      {inspirations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💫</div>
          <h3 className="text-xl font-semibold text-emerald-700 mb-2">No inspirations yet!</h3>
          <p className="text-emerald-600">Start collecting quotes and wisdom that inspire you on your magical journey.</p>
        </div>
      )}
    </div>
  );
};

export default InspirationBoard;