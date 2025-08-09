import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, Edit, BookOpen } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const savedNotes = localStorage.getItem('fairyNotes');
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes);
      setNotes(parsedNotes);
      if (parsedNotes.length > 0) {
        setSelectedNote(parsedNotes[0]);
        setTitle(parsedNotes[0].title);
        setContent(parsedNotes[0].content);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fairyNotes', JSON.stringify(notes));
  }, [notes]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Magical Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setTitle(newNote.title);
    setContent(newNote.content);
    setIsEditing(true);
  };

  const saveNote = () => {
    if (selectedNote && (title.trim() || content.trim())) {
      const updatedNote = {
        ...selectedNote,
        title: title.trim() || 'Untitled',
        content: content.trim(),
        updatedAt: new Date().toISOString(),
      };
      setNotes(notes.map(note => 
        note.id === selectedNote.id ? updatedNote : note
      ));
      setSelectedNote(updatedNote);
      setIsEditing(false);
    }
  };

  const deleteNote = (noteToDelete: Note) => {
    const updatedNotes = notes.filter(note => note.id !== noteToDelete.id);
    setNotes(updatedNotes);
    
    if (selectedNote?.id === noteToDelete.id) {
      if (updatedNotes.length > 0) {
        const nextNote = updatedNotes[0];
        setSelectedNote(nextNote);
        setTitle(nextNote.title);
        setContent(nextNote.content);
      } else {
        setSelectedNote(null);
        setTitle('');
        setContent('');
      }
    }
    setIsEditing(false);
  };

  const selectNote = (note: Note) => {
    if (isEditing && selectedNote) {
      saveNote();
    }
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 font-serif mb-2">
          📖 Fairy Journal 📖
        </h2>
        <p className="text-emerald-600">Capture your magical thoughts and memories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
        {/* Notes List */}
        <div className="lg:col-span-1">
          <div className="backdrop-blur-md bg-white/50 rounded-2xl p-4 border border-emerald-200/50 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-emerald-800 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                My Notes
              </h3>
              <button
                onClick={createNewNote}
                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white p-2 rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {notes.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">📝</div>
                  <p className="text-emerald-600 text-sm">No notes yet. Create your first magical note!</p>
                </div>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => selectNote(note)}
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-200 border ${
                      selectedNote?.id === note.id
                        ? 'bg-gradient-to-r from-emerald-100 to-green-100 border-emerald-300'
                        : 'bg-white/50 hover:bg-white/70 border-emerald-200/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-emerald-800 truncate">
                          {note.title}
                        </h4>
                        <p className="text-sm text-emerald-600 truncate mt-1">
                          {note.content || 'No content'}
                        </p>
                        <p className="text-xs text-emerald-500 mt-2">
                          {new Date(note.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note);
                        }}
                        className="text-red-400 hover:text-red-600 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Note Editor */}
        <div className="lg:col-span-2">
          <div className="backdrop-blur-md bg-white/50 rounded-2xl p-6 border border-emerald-200/50 h-full">
            {selectedNote ? (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-2xl font-bold text-emerald-800 bg-transparent border-none outline-none focus:bg-white/50 rounded-lg px-2 py-1 w-full"
                        placeholder="Note title..."
                      />
                    ) : (
                      <h3 className="text-2xl font-bold text-emerald-800">{selectedNote.title}</h3>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <button
                        onClick={saveNote}
                        className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-h-0">
                  {isEditing ? (
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your magical thoughts here..."
                      className="w-full h-full resize-none bg-transparent border border-emerald-200 rounded-xl p-4 focus:border-emerald-400 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 text-gray-800"
                    />
                  ) : (
                    <div className="h-full bg-white/30 rounded-xl p-4 overflow-y-auto">
                      {selectedNote.content ? (
                        <pre className="whitespace-pre-wrap text-gray-800 font-sans">
                          {selectedNote.content}
                        </pre>
                      ) : (
                        <p className="text-emerald-600 italic">
                          This note is empty. Click "Edit" to add some magical content!
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 text-sm text-emerald-500">
                  Created: {new Date(selectedNote.createdAt).toLocaleString()}
                  {selectedNote.updatedAt !== selectedNote.createdAt && (
                    <> • Updated: {new Date(selectedNote.updatedAt).toLocaleString()}</>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📜</div>
                  <h3 className="text-xl font-semibold text-emerald-700 mb-2">No note selected</h3>
                  <p className="text-emerald-600 mb-4">
                    Select a note from the list or create a new one to get started!
                  </p>
                  <button
                    onClick={createNewNote}
                    className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create First Note</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;