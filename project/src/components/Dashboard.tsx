import React, { useState } from 'react';
import { 
  CheckSquare, 
  FileText, 
  Calendar, 
  BookOpen, 
  Target, 
  Heart, 
  Lightbulb, 
  LogOut,
  Sparkles,
  Leaf
} from 'lucide-react';
import TodoList from './TodoList';
import Notes from './Notes';
import HabitTracker from './HabitTracker';
import InspirationBoard from './InspirationBoard';
import Schedule from './Schedule';
import Diary from './Diary';
import Goals from './Goals';

interface DashboardProps {
  user: any;
  onSignOut: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onSignOut }) => {
  const [activeTab, setActiveTab] = useState('todos');

  const navigationItems = [
    { id: 'todos', label: 'To-Do List', icon: CheckSquare, emoji: '📝' },
    { id: 'notes', label: 'Notes', icon: FileText, emoji: '📖' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, emoji: '📅' },
    { id: 'diary', label: 'Diary', icon: BookOpen, emoji: '📔' },
    { id: 'goals', label: 'Goals', icon: Target, emoji: '🎯' },
    { id: 'habits', label: 'Habit Tracker', icon: Heart, emoji: '💫' },
    { id: 'inspiration', label: 'Inspiration Board', icon: Lightbulb, emoji: '✨' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'todos':
        return <TodoList />;
      case 'notes':
        return <Notes />;
      case 'habits':
        return <HabitTracker />;
      case 'inspiration':
        return <InspirationBoard />;
      case 'schedule':
        return <Schedule />;
      case 'diary':
        return <Diary />;
      case 'goals':
        return <Goals />;
      default:
        return (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-2xl font-semibold text-emerald-700 mb-2">Coming Soon</h3>
            <p className="text-emerald-600">This magical feature is still being crafted by our fairy developers!</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 animate-float">
          <Sparkles className="w-4 h-4 text-emerald-300 opacity-30" />
        </div>
        <div className="absolute top-40 right-20 animate-float delay-1000">
          <Leaf className="w-5 h-5 text-green-300 opacity-25" />
        </div>
        <div className="absolute bottom-32 left-16 animate-float delay-2000">
          <Sparkles className="w-3 h-3 text-teal-300 opacity-35" />
        </div>
        <div className="absolute top-1/3 right-10 animate-float delay-500">
          <Leaf className="w-4 h-4 text-emerald-400 opacity-20 transform rotate-45" />
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-emerald-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🧚‍♀️</div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 font-serif">
                Fairy Realm
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-emerald-700 font-medium">
                Welcome, {user?.name} {user?.avatar}
              </span>
              <button
                onClick={onSignOut}
                className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-800 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col xl:flex-row gap-6 lg:gap-8">
          {/* Sidebar Navigation */}
          <nav className="xl:w-64 flex-shrink-0">
            <div className="backdrop-blur-md bg-white/70 rounded-3xl p-4 sm:p-6 shadow-xl border border-emerald-200/50">
              <h2 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Magical Tools
              </h2>
              
              {/* Mobile: Horizontal scroll, Desktop: Vertical list */}
              <div className="xl:hidden overflow-x-auto pb-2">
                <div className="flex space-x-2 min-w-max">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                          activeTab === item.id
                            ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg'
                            : 'text-emerald-700 hover:bg-emerald-100/70'
                        }`}
                      >
                        <span className="text-base">{item.emoji}</span>
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Desktop: Vertical list */}
              <ul className="space-y-2 hidden xl:block">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                          activeTab === item.id
                            ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg transform scale-105'
                            : 'text-emerald-700 hover:bg-emerald-100/70 hover:transform hover:scale-102'
                        }`}
                      >
                        <span className="text-lg">{item.emoji}</span>
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            <div className="backdrop-blur-md bg-white/70 rounded-3xl shadow-xl border border-emerald-200/50 min-h-[600px]">
              <div className="p-4 sm:p-6 lg:p-8">
                {renderContent()}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
