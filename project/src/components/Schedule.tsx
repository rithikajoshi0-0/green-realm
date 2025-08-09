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
  monthIndex: number;
}

const Schedule: React.FC = () => {
  const [currentStartDate, setCurrentStartDate] = useState(() => {
    // Start from August 2025 (current month)
    return new Date(2025, 7, 1); // Month is 0-indexed, so 7 = August
  });
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

  // Generate 4 months of calendar data
  const generate4MonthsData = (): CalendarDay[] => {
    const allDays: CalendarDay[] = [];
    const today = new Date();
    
    for (let monthOffset = 0; monthOffset < 4; monthOffset++) {
      const currentMonth = new Date(currentStartDate.getFullYear(), currentStartDate.getMonth() + monthOffset, 1);
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - firstDay.getDay());
      
      // Generate 42 days (6 weeks) for each month
      for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dateKey = date.toDateString();
        const isCurrentMonth = date.getMonth() === month;
        const isToday = date.toDateString() === today.toDateString();
        const hasSchedule = schedules[dateKey] && schedules[dateKey].length > 0;
        
        allDays.push({
          date,
          isCurrentMonth,
          isToday,
          hasSchedule,
          monthIndex: monthOffset
        });
      }
    }
    
    return allDays;
  };

  const navigate4Months = (direction: 'prev' | 'next') => {
    const newStartDate = new Date(currentStartDate);
    newStartDate.setMonth(currentStartDate.getMonth() + (direction === 'next' ? 4 : -4));
    setCurrentStartDate(newStartDate);
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

  const get4MonthsRange = () => {
    const endDate = new Date(currentStartDate.getFullYear(), currentStartDate.getMonth() + 3, 0);
    return `${months[currentStartDate.getMonth()]} ${currentStartDate.getFullYear()} - ${months[endDate.getMonth()]} ${endDate.getFullYear()}`;
  };

  const getVisibleSchedules = () => {
    const visibleSchedules: ScheduleEntry[] = [];
    const startMonth = currentStartDate.getMonth();
    const startYear = currentStartDate.getFullYear();
    
    Object.entries(schedules).forEach(([dateKey, entries]) => {
      const date = new Date(dateKey);
      const dateMonth = date.getMonth();
      const dateYear = date.getFullYear();
      
      // Check if date falls within the 4-month range
      const monthsDiff = (dateYear - startYear) * 12 + (dateMonth - startMonth);
      if (monthsDiff >= 0 && monthsDiff < 4) {
        visibleSchedules.push(...entries);
      }
    });
    
    return visibleSchedules.sort((a, b) => {
      const dateA = new Date(a.date + ' ' + a.time);
      const dateB = new Date(b.date + ' ' + b.time);
      return dateA.getTime() - dateB.getTime();
    });
  };

  const calendarDays = generate4MonthsData();
  const visibleSchedules = getVisibleSchedules();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 font-serif mb-2">
          📅 Magical Schedule 📅
        </h2>
        <p className="text-emerald-600">Plan your fairy tale adventures across the seasons</p>
      </div>

      {/* 4-Month Calendar Container */}
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

        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate4Months('prev')}
            className="group flex items-center space-x-2 p-3 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-all duration-300 transform hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5 group-hover:animate-pulse" />
            <span className="hidden sm:inline font-medium">Previous </span>
          </button>
          
          <div className="text-center">
            <h3 className="text-2xl font-bold text-emerald-800 font-serif">
              {get4MonthsRange()}
            </h3>
            <p className="text-emerald-600 text-sm">✨ Your Magical Calendar ✨</p>
          </div>
          
          <button
            onClick={() => navigate4Months('next')}
            className="group flex items-center space-x-2 p-3 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-all duration-300 transform hover:scale-110"
          >
            <span className="hidden sm:inline font-medium">Next </span>
            <ChevronRight className="w-5 h-5 group-hover:animate-pulse" />
          </button>
        </div>

        {/* 4-Month Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[0, 1, 2, 3].map(monthIndex => {
            const monthDate = new Date(currentStartDate.getFullYear(), currentStartDate.getMonth() + monthIndex, 1);
            const monthDays = calendarDays.filter(day => day.monthIndex === monthIndex);
            
            return (
              <div key={monthIndex} className="backdrop-blur-sm bg-white/30 rounded-2xl p-4 border border-emerald-200/30 relative overflow-hidden">
                {/* Month decorative border */}
                <div className="absolute inset-0 border-2 border-emerald-300/20 rounded-2xl animate-pulse"></div>
                
                {/* Month Header */}
                <div className="text-center mb-4 relative z-10">
                  <h4 className="text-xl font-bold text-emerald-800 font-serif">
                    {months[monthDate.getMonth()]} {monthDate.getFullYear()}
                  </h4>
                </div>

                {/* Week Days Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map(day => (
                    <div key={day} className="text-center py-1 text-emerald-700 font-semibold text-xs">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {monthDays.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => handleDateClick(day.date)}
                      className={`
                        relative p-2 rounded-lg text-xs font-medium transition-all duration-200 transform hover:scale-105
                        ${day.isCurrentMonth 
                          ? 'text-gray-800 hover:bg-emerald-100' 
                          : 'text-gray-400 hover:bg-gray-100'
                        }
                        ${day.isToday 
                          ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg ring-2 ring-emerald-300' 
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
                        <div className="absolute top-0 right-0 transform translate-x-1 -translate-y-1">
                          <Sparkles className="w-2 h-2 text-emerald-500" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
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

      {/* Visible Schedules for 4-Month Range */}
      {visibleSchedules.length > 0 && (
        <div className="backdrop-blur-md bg-white/50 rounded-2xl p-6 border border-emerald-200/50">
          <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Upcoming Schedules ({get4MonthsRange()})
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {visibleSchedules.map(entry => (
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
                      <p className="text-gray-600 text-sm mb-2">{entry.description}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(entry.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
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
