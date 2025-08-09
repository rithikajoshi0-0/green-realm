import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Save, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Leaf, 
  Moon, 
  Feather, 
  Settings,
  Heart,
  Star,
  Smile,
  Frown,
  Meh,
  X
} from 'lucide-react';

interface DiaryEntry {
  templateId: string;
  pageNumber: number;
  content: any;
  lastModified: string;
}

interface DiaryTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  pages: DiaryPage[];
}

interface DiaryPage {
  id: number;
  title: string;
  type: 'text' | 'list' | 'mood' | 'sketch' | 'table' | 'grid';
  placeholder?: string;
  fields?: string[];
}

interface CustomTemplate {
  name: string;
  description: string;
  pages: { type: string; title: string }[];
}

const Diary: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<DiaryTemplate | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [entries, setEntries] = useState<{ [key: string]: DiaryEntry[] }>({});
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customTemplate, setCustomTemplate] = useState<CustomTemplate>({
    name: '',
    description: '',
    pages: Array(5).fill({ type: 'text', title: '' })
  });

  const pageTypes = [
    { id: 'text', name: 'Text Area', icon: '📝' },
    { id: 'list', name: 'List/Bullets', icon: '📋' },
    { id: 'mood', name: 'Mood Tracker', icon: '😊' },
    { id: 'sketch', name: 'Sketch Area', icon: '🎨' },
    { id: 'table', name: 'Table/Grid', icon: '📊' },
    { id: 'grid', name: 'Photo Grid', icon: '🖼️' }
  ];

  const predefinedTemplates: DiaryTemplate[] = [
    {
      id: 'daily-reflection',
      name: 'Daily Reflection',
      description: 'Capture your daily thoughts and gratitude',
      icon: '🌅',
      color: 'from-emerald-400 to-green-500',
      pages: [
        { id: 1, title: 'Dear Fairy Friend', type: 'text', placeholder: 'Welcome to your magical day...' },
        { id: 2, title: 'Today\'s Journey', type: 'text', placeholder: 'Tell me about your day...' },
        { id: 3, title: 'Gratitude Garden', type: 'list', fields: ['What made you smile today?', 'Who are you grateful for?', 'What small miracle happened?'] },
        { id: 4, title: 'Mood Magic', type: 'mood' },
        { id: 5, title: 'Tomorrow\'s Intentions', type: 'text', placeholder: 'What magical intentions do you set for tomorrow?' }
      ]
    },
    {
      id: 'dream-journal',
      name: 'Dream Journal',
      description: 'Record and explore your mystical dreams',
      icon: '🌙',
      color: 'from-purple-400 to-indigo-500',
      pages: [
        { id: 1, title: 'Dream Portal', type: 'text', placeholder: 'Dream date and title...' },
        { id: 2, title: 'Dream Narrative', type: 'text', placeholder: 'Describe your dream journey...' },
        { id: 3, title: 'Symbols & Meanings', type: 'table', fields: ['Symbol', 'Meaning', 'Feeling'] },
        { id: 4, title: 'Dream Sketch', type: 'sketch' },
        { id: 5, title: 'Recurring Themes', type: 'list', fields: ['Common symbols', 'Recurring characters', 'Emotional patterns'] }
      ]
    },
    {
      id: 'creative-writing',
      name: 'Creative Writing',
      description: 'Craft magical stories and poetry',
      icon: '✍️',
      color: 'from-rose-400 to-pink-500',
      pages: [
        { id: 1, title: 'Story Seed', type: 'text', placeholder: 'Story title and inspiration...' },
        { id: 2, title: 'Main Narrative', type: 'text', placeholder: 'Let your story unfold...' },
        { id: 3, title: 'Character Constellation', type: 'table', fields: ['Character', 'Role', 'Traits'] },
        { id: 4, title: 'Plot Threads', type: 'list', fields: ['Beginning', 'Middle', 'End', 'Twist'] },
        { id: 5, title: 'Next Chapter Ideas', type: 'text', placeholder: 'Where does the story go next?' }
      ]
    }
  ];

  const [templates, setTemplates] = useState<DiaryTemplate[]>(predefinedTemplates);

  useEffect(() => {
    const savedEntries = localStorage.getItem('fairyDiaryEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }

    const savedCustomTemplates = localStorage.getItem('fairyCustomTemplates');
    if (savedCustomTemplates) {
      const customTemplates = JSON.parse(savedCustomTemplates);
      setTemplates([...predefinedTemplates, ...customTemplates]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fairyDiaryEntries', JSON.stringify(entries));
  }, [entries]);

  const saveEntry = (content: any) => {
    if (!selectedTemplate) return;

    const entryKey = `${selectedTemplate.id}-${currentPage}`;
    const newEntry: DiaryEntry = {
      templateId: selectedTemplate.id,
      pageNumber: currentPage,
      content,
      lastModified: new Date().toISOString()
    };

    setEntries(prev => ({
      ...prev,
      [entryKey]: [...(prev[entryKey] || []), newEntry]
    }));
  };

  const getCurrentEntry = () => {
    if (!selectedTemplate) return null;
    const entryKey = `${selectedTemplate.id}-${currentPage}`;
    const pageEntries = entries[entryKey] || [];
    return pageEntries[pageEntries.length - 1] || null;
  };

  const createCustomTemplate = () => {
    if (!customTemplate.name.trim()) return;

    const newTemplate: DiaryTemplate = {
      id: `custom-${Date.now()}`,
      name: customTemplate.name,
      description: customTemplate.description,
      icon: '🎨',
      color: 'from-teal-400 to-emerald-500',
      pages: customTemplate.pages.map((page, index) => ({
        id: index + 1,
        title: page.title || `Page ${index + 1}`,
        type: page.type as any,
        placeholder: `Enter your ${page.type} content...`,
        fields: page.type === 'list' ? ['Item 1', 'Item 2', 'Item 3'] : 
               page.type === 'table' ? ['Column 1', 'Column 2', 'Column 3'] : undefined
      }))
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    
    const customTemplates = updatedTemplates.filter(t => t.id.startsWith('custom-'));
    localStorage.setItem('fairyCustomTemplates', JSON.stringify(customTemplates));

    setShowCustomForm(false);
    setCustomTemplate({
      name: '',
      description: '',
      pages: Array(5).fill({ type: 'text', title: '' })
    });
  };

  const renderPageContent = (page: DiaryPage) => {
    const currentEntry = getCurrentEntry();
    const content = currentEntry?.content || {};

    switch (page.type) {
      case 'text':
        return (
          <textarea
            className="w-full h-64 p-4 bg-white/80 backdrop-blur-sm border-2 border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 resize-none font-serif text-gray-800"
            placeholder={page.placeholder}
            value={content.text || ''}
            onChange={(e) => saveEntry({ ...content, text: e.target.value })}
          />
        );

      case 'list':
        return (
          <div className="space-y-3">
            {(page.fields || ['Item 1', 'Item 2', 'Item 3']).map((field, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Sparkles className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <input
                  type="text"
                  placeholder={field}
                  className="flex-1 p-3 bg-white/80 backdrop-blur-sm border-2 border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 font-serif text-gray-800"
                  value={content.list?.[index] || ''}
                  onChange={(e) => {
                    const newList = [...(content.list || [])];
                    newList[index] = e.target.value;
                    saveEntry({ ...content, list: newList });
                  }}
                />
              </div>
            ))}
          </div>
        );

      case 'mood':
        const moods = [
          { emoji: '😊', label: 'Happy', color: 'text-yellow-500' },
          { emoji: '😌', label: 'Peaceful', color: 'text-green-500' },
          { emoji: '😔', label: 'Sad', color: 'text-blue-500' },
          { emoji: '😤', label: 'Frustrated', color: 'text-red-500' },
          { emoji: '😴', label: 'Tired', color: 'text-purple-500' },
          { emoji: '🤔', label: 'Thoughtful', color: 'text-gray-500' }
        ];

        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-emerald-800 font-serif">How are you feeling today?</h4>
            <div className="grid grid-cols-3 gap-4">
              {moods.map((mood, index) => (
                <button
                  key={index}
                  onClick={() => saveEntry({ ...content, mood: mood.label })}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    content.mood === mood.label
                      ? 'border-emerald-400 bg-emerald-100 transform scale-105'
                      : 'border-emerald-200 bg-white/80 hover:bg-emerald-50'
                  }`}
                >
                  <div className={`text-3xl mb-2 ${mood.color}`}>{mood.emoji}</div>
                  <div className="text-sm font-medium text-gray-700">{mood.label}</div>
                </button>
              ))}
            </div>
            {content.mood && (
              <div className="mt-4">
                <textarea
                  className="w-full h-20 p-3 bg-white/80 backdrop-blur-sm border-2 border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 resize-none font-serif text-gray-800"
                  placeholder="Tell me more about this feeling..."
                  value={content.moodNote || ''}
                  onChange={(e) => saveEntry({ ...content, moodNote: e.target.value })}
                />
              </div>
            )}
          </div>
        );

      case 'sketch':
        return (
          <div className="bg-white/80 backdrop-blur-sm border-2 border-emerald-200 rounded-xl p-4">
            <div className="h-64 bg-white rounded-lg border-2 border-dashed border-emerald-300 flex items-center justify-center">
              <div className="text-center text-emerald-600">
                <Feather className="w-12 h-12 mx-auto mb-2" />
                <p className="font-serif">Sketch Area</p>
                <p className="text-sm opacity-75">Drawing canvas coming soon!</p>
              </div>
            </div>
          </div>
        );

      case 'table':
        const tableFields = page.fields || ['Column 1', 'Column 2', 'Column 3'];
        const tableData = content.table || [];

        return (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              {tableFields.map((field, colIndex) => (
                <div key={colIndex} className="font-semibold text-emerald-800 text-center p-2 bg-emerald-100 rounded-lg">
                  {field}
                </div>
              ))}
            </div>
            {[0, 1, 2].map(rowIndex => (
              <div key={rowIndex} className="grid grid-cols-3 gap-3">
                {tableFields.map((_, colIndex) => (
                  <input
                    key={colIndex}
                    type="text"
                    className="p-3 bg-white/80 backdrop-blur-sm border-2 border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 font-serif text-gray-800"
                    value={tableData[rowIndex]?.[colIndex] || ''}
                    onChange={(e) => {
                      const newTable = [...tableData];
                      if (!newTable[rowIndex]) newTable[rowIndex] = [];
                      newTable[rowIndex][colIndex] = e.target.value;
                      saveEntry({ ...content, table: newTable });
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="text-center py-12 text-emerald-600">
            <Settings className="w-12 h-12 mx-auto mb-2" />
            <p>Custom content type</p>
          </div>
        );
    }
  };

  if (selectedTemplate) {
    const currentPageData = selectedTemplate.pages[currentPage];

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedTemplate(null)}
            className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-800 transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Templates</span>
          </button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-emerald-800 font-serif flex items-center justify-center">
              <span className="mr-2">{selectedTemplate.icon}</span>
              {selectedTemplate.name}
            </h2>
            <p className="text-emerald-600">{selectedTemplate.description}</p>
          </div>

          <div className="text-emerald-600 text-sm">
            Page {currentPage + 1} of {selectedTemplate.pages.length}
          </div>
        </div>

        {/* Page Navigation */}
        <div className="flex justify-center space-x-2">
          {selectedTemplate.pages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentPage
                  ? 'bg-emerald-500 transform scale-125'
                  : 'bg-emerald-200 hover:bg-emerald-300'
              }`}
            />
          ))}
        </div>

        {/* Page Content */}
        <div className="backdrop-blur-md bg-white/50 rounded-3xl p-8 border border-emerald-200/50 relative overflow-hidden min-h-[600px]">
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

          {/* Vine Border Animation */}
          <div className="absolute inset-0 border-2 border-emerald-300/30 rounded-3xl animate-pulse pointer-events-none"></div>

          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-emerald-800 font-serif mb-6 text-center">
              {currentPageData.title}
            </h3>

            {renderPageContent(currentPageData)}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              currentPage === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white transform hover:scale-105'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => setCurrentPage(Math.min(selectedTemplate.pages.length - 1, currentPage + 1))}
            disabled={currentPage === selectedTemplate.pages.length - 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              currentPage === selectedTemplate.pages.length - 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white transform hover:scale-105'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 font-serif mb-2">
          📔 Magical Diary 📔
        </h2>
        <p className="text-emerald-600">Choose your enchanted diary template and begin your magical journey</p>
      </div>

      {/* Template Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => setSelectedTemplate(template)}
            className="group cursor-pointer backdrop-blur-md bg-white/60 rounded-3xl p-6 border border-emerald-200/50 transition-all duration-300 hover:shadow-xl hover:transform hover:scale-105 relative overflow-hidden"
          >
            {/* Vine Border Animation */}
            <div className="absolute inset-0 border-2 border-emerald-300/0 group-hover:border-emerald-300/50 rounded-3xl transition-all duration-500 animate-pulse"></div>
            
            {/* Decorative Elements */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-60 transition-opacity duration-300">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
            <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-40 transition-opacity duration-300 delay-200">
              <Leaf className="w-3 h-3 text-green-400 transform rotate-12" />
            </div>

            <div className="relative z-10">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${template.color} flex items-center justify-center text-2xl transform group-hover:scale-110 transition-transform duration-300`}>
                {template.icon}
              </div>
              
              <h3 className="text-xl font-bold text-emerald-800 font-serif text-center mb-2 group-hover:text-emerald-900 transition-colors duration-200">
                {template.name}
              </h3>
              
              <p className="text-emerald-600 text-center text-sm mb-4 group-hover:text-emerald-700 transition-colors duration-200">
                {template.description}
              </p>
              
              <div className="text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 group-hover:bg-emerald-200 transition-colors duration-200">
                  {template.pages.length} Pages
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Custom Template Card */}
        <div
          onClick={() => setShowCustomForm(true)}
          className="group cursor-pointer backdrop-blur-md bg-gradient-to-br from-teal-100/60 to-emerald-100/60 rounded-3xl p-6 border-2 border-dashed border-emerald-300/50 transition-all duration-300 hover:shadow-xl hover:transform hover:scale-105 relative overflow-hidden"
        >
          {/* Animated Border */}
          <div className="absolute inset-0 border-2 border-emerald-400/0 group-hover:border-emerald-400/70 rounded-3xl transition-all duration-500"></div>
          
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 flex items-center justify-center text-2xl transform group-hover:scale-110 transition-transform duration-300">
              <Plus className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-xl font-bold text-emerald-800 font-serif mb-2">
              Create Custom
            </h3>
            
            <p className="text-emerald-600 text-sm mb-4">
              Design your own magical diary template
            </p>
            
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
              Customizable
            </span>
          </div>
        </div>
      </div>

      {/* Custom Template Form Modal */}
      {showCustomForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="backdrop-blur-md bg-white/90 rounded-3xl p-8 max-w-2xl w-full border border-emerald-200/50 relative overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Decorative vine border */}
            <div className="absolute inset-0 border-2 border-emerald-300/30 rounded-3xl animate-pulse"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-emerald-800 font-serif flex items-center">
                  <Settings className="w-6 h-6 mr-2" />
                  Create Custom Diary
                </h3>
                <button
                  onClick={() => setShowCustomForm(false)}
                  className="p-2 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-emerald-700 font-medium mb-2">
                    ✨ Diary Name *
                  </label>
                  <input
                    type="text"
                    value={customTemplate.name}
                    onChange={(e) => setCustomTemplate({...customTemplate, name: e.target.value})}
                    placeholder="My Magical Diary"
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:border-emerald-400 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 bg-white/80 backdrop-blur-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-emerald-700 font-medium mb-2">
                    📝 Description
                  </label>
                  <textarea
                    value={customTemplate.description}
                    onChange={(e) => setCustomTemplate({...customTemplate, description: e.target.value})}
                    placeholder="Describe your custom diary..."
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:border-emerald-400 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 bg-white/80 backdrop-blur-sm resize-none h-20"
                  />
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Configure Your 5 Pages
                  </h4>
                  
                  <div className="space-y-4">
                    {customTemplate.pages.map((page, index) => (
                      <div key={index} className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-200/50">
                        <h5 className="font-medium text-emerald-800 mb-3">Page {index + 1}</h5>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm text-emerald-700 mb-1">Page Title</label>
                            <input
                              type="text"
                              value={page.title}
                              onChange={(e) => {
                                const newPages = [...customTemplate.pages];
                                newPages[index] = { ...page, title: e.target.value };
                                setCustomTemplate({...customTemplate, pages: newPages});
                              }}
                              placeholder={`Page ${index + 1} Title`}
                              className="w-full px-3 py-2 rounded-lg border border-emerald-200 focus:border-emerald-400 bg-white/80 text-sm"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm text-emerald-700 mb-1">Page Type</label>
                            <select
                              value={page.type}
                              onChange={(e) => {
                                const newPages = [...customTemplate.pages];
                                newPages[index] = { ...page, type: e.target.value };
                                setCustomTemplate({...customTemplate, pages: newPages});
                              }}
                              className="w-full px-3 py-2 rounded-lg border border-emerald-200 focus:border-emerald-400 bg-white/80 text-sm"
                            >
                              {pageTypes.map(type => (
                                <option key={type.id} value={type.id}>
                                  {type.icon} {type.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCustomForm(false)}
                    className="flex-1 px-4 py-3 text-emerald-600 border border-emerald-200 rounded-xl hover:bg-emerald-50 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createCustomTemplate}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Create Diary</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Diary;
