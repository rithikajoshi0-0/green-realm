import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Save, 
  X, 
  Clock, 
  Bell, 
  Edit, 
  Trash2, 
  Sparkles,
  Leaf,
  Calendar as CalendarIcon
} from 'lucide-react';

interface ScheduleEntry {
  id: string;
  taskName: string;
  description: string;
  time: string;
  alarm: boolean;
  alarmMinutes: number;
  date: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasSchedule: boolean;
}

const Schedule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [schedules, setSchedules] = useState<{ [key: string]: ScheduleEntry[] }>({});
  const [editingEntry, setEditingEntry] = useState<ScheduleEntry | null>(null);
  const [formData, setFormData] = useState({
    taskName: '',
    description: '',
    time: '',
    alarm: false,
    alarmMinutes: 10
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Load schedules from localStorage
  useEffect(() => {
    const savedSchedules = localStorage.getItem('fairySchedules');
    if (savedSchedules) {
      setSchedules(JSON.parse(savedSchedules));
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Save schedules to localStorage
  useEffect(() => {
    localStorage.setItem('fairySchedules', JSON.stringify(schedules));
  }, [schedules]);

  // Generate calendar days
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dateKey = date.toDateString();
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      const hasSchedule = schedules[dateKey] && schedules[dateKey].length > 0;
      
      days.push({
        date,
        isCurrentMonth,
        isToday,
        hasSchedule
      });
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowForm(true);
    setEditingEntry(null);
    setFormData({
      taskName: '',
      description: '',
      time: '',
      alarm: false,
      alarmMinutes: 10
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !formData.taskName.trim() || !formData.time) return;

    const dateKey = selectedDate.toDateString();
    const entry: ScheduleEntry = {
      id: editingEntry?.id || Date.now().toString(),
      taskName: formData.taskName.trim(),
      description: formData.description.trim(),
      time: formData.time,
      alarm: formData.alarm,
      alarmMinutes: formData.alarmMinutes,
      date: dateKey
    };

    setSchedules(prev => {
      const updated = { ...prev };
      if (!updated[dateKey]) {
        updated[dateKey] = [];
      }
      
      if (editingEntry) {
        const index = updated[dateKey].findIndex(e => e.id === editingEntry.id);
        if (index !== -1) {
          updated[dateKey][index] = entry;
        }
      } else {
        updated[dateKey].push(entry);
      }
      
      return updated;
    });

    // Set alarm if enabled
    if (formData.alarm) {
      scheduleNotification(entry, selectedDate);
    }

    setShowForm(false);
    setEditingEntry(null);
  };

  const scheduleNotification = (entry: ScheduleEntry, date: Date) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const [hours, minutes] = entry.time.split(':').map(Number);
      const notificationTime = new Date(date);
      notificationTime.setHours(hours, minutes - entry.alarmMinutes, 0, 0);
      
      const now = new Date();
      const timeUntilNotification = notificationTime.getTime() - now.getTime();
      
      if (timeUntilNotification > 0) {
        setTimeout(() => {
          new Notification(`🧚‍♀️ Fairy Reminder: ${entry.taskName}`, {
            body: `Your magical task "${entry.taskName}" is starting in ${entry.alarmMinutes} minutes!`,
            icon: '/favicon.ico'
          });
        }, timeUntilNotification);
      }
    }
  };

  const handleEditEntry = (entry: ScheduleEntry) => {
    setEditingEntry(entry);
    setFormData({
      taskName: entry.taskName,
      description: entry.description,
      time: entry.time,
      alarm: entry.alarm,
      alarmMinutes: entry.alarmMinutes
    });
    setSelectedDate(new Date(entry.date));
    setShowForm(true);
  };

  const handleDeleteEntry = (entryId: string, dateKey: string) => {
    setSchedules(prev => {
      const updated = { ...prev };
      updated[dateKey] = updated[dateKey].filter(e => e.id !== entryId);
      if (updated[dateKey].length === 0) {
        delete updated[dateKey];
      }
      return updated;
    });
  };

  const calendarDays = generateCalendarDays();
  const selectedDateSchedules = selectedDate ? schedules[selectedDate.toDateString()] || [] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 font-serif mb-2">
          📅 Magical Schedule 📅
        </h2>
        <p className="text-emerald-600">Plan your fairy tale adventures with our enchanted calendar</p>
      </div>

      {/* Calendar Container */}
      <div className="backdrop-blur-md bg-white/50 rounded-3xl p-6 border border-emerald-200/50 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-4 left-4 animate-pulse">
          <Sparkles className="w-4 h-4 text-emerald-300 opacity-60" />
        </div>
        <div className="absolute top-4 right-4 animate-pulse delay-1000">
          <Leaf className="w-5 h-5 text-green-300 opacity-50 transform rotate-12" />
        </div>
        <div className="absolute bottom-4 left-6 animate-pulse delay-2000">
          <Sparkles className="w-3 h-3 text-teal-300 opacity-70" />
        </div>
        <div className="absolute bottom-4 right-6 animate-pulse delay-500">
          <Leaf className="w-4 h-4 text-emerald-400 opacity-40 transform -rotate-45" />
        </div>

        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-all duration-200 transform hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <h3 className="text-2xl font-bold text-emerald-800 font-serif">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-all duration-200 transform hover:scale-110"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map(day => (
            <div key={day} className="text-center py-2 text-emerald-700 font-semibold text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => (
            <button
              key={index}
              onClick={() => handleDateClick(day.date)}
              className={`
                relative p-3 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105
                ${day.isCurrentMonth 
                  ? 'text-gray-800 hover:bg-emerald-100' 
                  : 'text-gray-400 hover:bg-gray-100'
                }
                ${day.isToday 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg' 
                  : 'bg-white/60'
                }
                ${day.hasSchedule && !day.isToday 
                  ? 'bg-emerald-50 border-2 border-emerald-200' 
                  : 'border border-emerald-100'
                }
              `}
            >
              {day.date.getDate()}
              {day.hasSchedule && (
                <div className="absolute top-1 right-1">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="backdrop-blur-md bg-white/90 rounded-3xl p-8 max-w-md w-full border border-emerald-200/50 relative overflow-hidden">
            {/* Decorative vine border animation */}
            <div className="absolute inset-0 border-2 border-emerald-300/30 rounded-3xl animate-pulse"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-emerald-800 font-serif flex items-center">
                  <CalendarIcon className="w-6 h-6 mr-2" />
                  {editingEntry ? 'Edit' : 'Add'} Schedule
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4 text-center">
                <p className="text-emerald-600 font-medium">
                  {selectedDate?.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-emerald-700 font-medium mb-2">
                    ✨ Task Name *
                  </label>
                  <input
                    type="text"
                    value={formData.taskName}
                    onChange={(e) => setFormData({...formData, taskName: e.target.value})}
                    placeholder="Enter your magical task..."
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:border-emerald-400 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 bg-white/80 backdrop-blur-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-emerald-700 font-medium mb-2">
                    📝 Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Add magical details..."
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:border-emerald-400 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 bg-white/80 backdrop-blur-sm resize-none h-20"
                  />
                </div>

                <div>
                  <label className="block text-emerald-700 font-medium mb-2">
                    🕐 Time *
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:border-emerald-400 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 bg-white/80 backdrop-blur-sm"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="alarm"
                      checked={formData.alarm}
                      onChange={(e) => setFormData({...formData, alarm: e.target.checked})}
                      className="w-4 h-4 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor="alarm" className="text-emerald-700 font-medium flex items-center">
                      <Bell className="w-4 h-4 mr-1" />
                      Set Fairy Alarm
                    </label>
                  </div>

                  {formData.alarm && (
                    <div className="ml-7">
                      <label className="block text-emerald-600 text-sm mb-1">
                        Remind me before:
                      </label>
                      <select
                        value={formData.alarmMinutes}
                        onChange={(e) => setFormData({...formData, alarmMinutes: parseInt(e.target.value)})}
                        className="px-3 py-2 rounded-lg border border-emerald-200 focus:border-emerald-400 bg-white/80 text-sm"
                      >
                        <option value={5}>5 minutes</option>
                        <option value={10}>10 minutes</option>
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-3 text-emerald-600 border border-emerald-200 rounded-xl hover:bg-emerald-50 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Selected Date Schedules */}
      {selectedDate && selectedDateSchedules.length > 0 && (
        <div className="backdrop-blur-md bg-white/50 rounded-2xl p-6 border border-emerald-200/50">
          <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Schedules for {selectedDate.toLocaleDateString()}
          </h3>
          
          <div className="space-y-3">
            {selectedDateSchedules
              .sort((a, b) => a.time.localeCompare(b.time))
              .map(entry => (
                <div
                  key={entry.id}
                  className="bg-white/60 rounded-xl p-4 border border-emerald-200/50 hover:bg-white/80 transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-emerald-800">{entry.taskName}</h4>
                        <span className="text-sm text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg">
                          {entry.time}
                        </span>
                        {entry.alarm && (
                          <Bell className="w-4 h-4 text-amber-500" title={`Alarm set ${entry.alarmMinutes} minutes before`} />
                        )}
                      </div>
                      {entry.description && (
                        <p className="text-gray-600 text-sm">{entry.description}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditEntry(entry)}
                        className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100 rounded-lg transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry.id, entry.date)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Notification Permission Notice */}
      {'Notification' in window && Notification.permission === 'default' && (
        <div className="backdrop-blur-md bg-amber-50/80 rounded-2xl p-4 border border-amber-200/50">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-amber-800 font-medium">Enable notifications for fairy alarms!</p>
              <p className="text-amber-600 text-sm">Click "Allow" when prompted to receive magical reminders.</p>
            </div>
          </div>
        </div>
      )}

      {/* Browser Not Supported Notice */}
      {!('Notification' in window) && (
        <div className="backdrop-blur-md bg-gray-50/80 rounded-2xl p-4 border border-gray-200/50">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-gray-500" />
            <p className="text-gray-600">
              Alarm notifications are not supported in this browser. Schedules will still be saved!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
