import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Edit2, Trash2, Star, Calendar } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    const savedTodos = localStorage.getItem('fairyTodos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fairyTodos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        priority,
        createdAt: new Date().toISOString(),
      };
      setTodos([todo, ...todos]);
      setNewTodo('');
      setPriority('medium');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEditing = (id: string, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = () => {
    if (editingId && editingText.trim()) {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editingText.trim() } : todo
      ));
      setEditingId(null);
      setEditingText('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 border-red-200';
      case 'medium': return 'text-amber-500 border-amber-200';
      case 'low': return 'text-green-500 border-green-200';
      default: return 'text-gray-500 border-gray-200';
    }
  };

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-amber-50 border-amber-200';
      case 'low': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 font-serif mb-2">
          ✨ Magical Tasks ✨
        </h2>
        <p className="text-emerald-600">Organize your fairy tale life, one task at a time</p>
      </div>

      {/* Add New Todo */}
      <div className="backdrop-blur-md bg-white/50 rounded-2xl p-6 border border-emerald-200/50">
        <div className="flex flex-col space-y-4">
          <div className="flex space-x-3">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="What magical task awaits? ✨"
              className="flex-1 px-4 py-3 rounded-xl border border-emerald-200 focus:border-emerald-400 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 bg-white/80 backdrop-blur-sm"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="px-3 py-3 rounded-xl border border-emerald-200 focus:border-emerald-400 bg-white/80 backdrop-blur-sm"
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
            <button
              onClick={addTodo}
              className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-center space-x-2">
        {[
          { key: 'all', label: 'All Tasks', emoji: '📝' },
          { key: 'active', label: 'Active', emoji: '⚡' },
          { key: 'completed', label: 'Completed', emoji: '✅' }
        ].map(({ key, label, emoji }) => (
          <button
            key={key}
            onClick={() => setFilter(key as typeof filter)}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              filter === key
                ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg transform scale-105'
                : 'bg-white/60 text-emerald-700 hover:bg-white/80 border border-emerald-200'
            }`}
          >
            <span className="mr-2">{emoji}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Todo Items */}
      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌸</div>
            <h3 className="text-xl font-semibold text-emerald-700 mb-2">No tasks here!</h3>
            <p className="text-emerald-600">
              {filter === 'completed' 
                ? "You haven't completed any magical tasks yet."
                : filter === 'active'
                ? "All your tasks are complete! Time for fairy celebrations! 🎉"
                : "Your magical task list is empty. Add some tasks to get started!"}
            </p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`backdrop-blur-md bg-white/60 rounded-2xl p-4 border transition-all duration-300 hover:shadow-lg ${
                todo.completed 
                  ? 'opacity-75 bg-emerald-50/50 border-emerald-200' 
                  : `${getPriorityBg(todo.priority)} border-emerald-200 hover:bg-white/80`
              }`}
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                    todo.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50'
                  }`}
                >
                  {todo.completed && <Check className="w-4 h-4" />}
                </button>

                <div className="flex-1 min-w-0">
                  {editingId === todo.id ? (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') saveEdit();
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        className="flex-1 px-3 py-1 rounded-lg border border-emerald-300 focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 bg-white/80"
                        autoFocus
                      />
                      <button
                        onClick={saveEdit}
                        className="text-green-600 hover:text-green-800 p-1"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`${
                            todo.completed 
                              ? 'line-through text-gray-500' 
                              : 'text-gray-800'
                          } font-medium`}
                        >
                          {todo.text}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(todo.priority).split(' ')[0].replace('text-', 'bg-')}`}></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Created {new Date(todo.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => startEditing(todo.id, todo.text)}
                    className="text-gray-400 hover:text-emerald-600 p-1 rounded-lg transition-colors duration-200"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-gray-400 hover:text-red-600 p-1 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      {todos.length > 0 && (
        <div className="backdrop-blur-md bg-white/50 rounded-2xl p-4 border border-emerald-200/50 text-center">
          <div className="flex justify-center space-x-6 text-sm">
            <span className="text-emerald-600">
              <strong>{todos.filter(t => !t.completed).length}</strong> active
            </span>
            <span className="text-emerald-600">
              <strong>{todos.filter(t => t.completed).length}</strong> completed
            </span>
            <span className="text-emerald-600">
              <strong>{todos.length}</strong> total
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;