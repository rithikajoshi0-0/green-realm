import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Save, 
  X, 
  Edit, 
  Trash2, 
  Award, 
  Star, 
  Sparkles, 
  Leaf, 
  Crown,
  Gift,
  Settings,
  Calendar,
  Target,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Quest {
  id: string;
  name: string;
  description: string;
  deadline: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  progress: number;
  status: 'active' | 'completed' | 'abandoned';
  createdAt: string;
  completedAt?: string;
}

interface Reward {
  id: string;
  name: string;
  icon: string;
  description: string;
  questId: string;
  milestone: number;
  claimed: boolean;
  claimedAt?: string;
}

interface FairyCustomization {
  name: string;
  color: 'green' | 'gold' | 'pink';
  wings: 'butterfly' | 'dragonfly';
}

const Goals: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [fairy, setFairy] = useState<FairyCustomization>({
    name: 'Sparkle',
    color: 'green',
    wings: 'butterfly'
  });
  const [showQuestForm, setShowQuestForm] = useState(false);
  const [showFairyCustomizer, setShowFairyCustomizer] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [questForm, setQuestForm] = useState({
    name: '',
    description: '',
    deadline: '',
    difficulty: 'Medium' as Quest['difficulty']
  });
  const [fairyTip, setFairyTip] = useState('');
  const [showFairyTip, setShowFairyTip] = useState(false);

  const fairyTips = [
    "Every great quest begins with a single step! ✨",
    "The forest whispers secrets to those who listen 🌿",
    "Your courage grows with each completed quest! 🧚‍♀️",
    "Magic happens when you believe in yourself! 💫",
    "The enchanted tree awaits your progress! 🌳",
    "Keep seeking, brave adventurer! 🌟"
  ];

  const rewardTemplates = [
    { name: "Fairy Wing Badge", icon: "🦋", description: "Earned for starting your first quest" },
    { name: "Magic Leaf Token", icon: "🍃", description: "Awarded for 25% progress" },
    { name: "Starlight Charm", icon: "⭐", description: "Granted for 50% progress" },
    { name: "Golden Acorn", icon: "🌰", description: "Bestowed for 75% progress" },
    { name: "Crown of Achievement", icon: "👑", description: "Ultimate reward for quest completion" }
  ];

  useEffect(() => {
    const savedQuests = localStorage.getItem('fairyQuests');
    const savedRewards = localStorage.getItem('fairyRewards');
    const savedFairy = localStorage.getItem('fairyCustomization');

    if (savedQuests) setQuests(JSON.parse(savedQuests));
    if (savedRewards) setRewards(JSON.parse(savedRewards));
    if (savedFairy) setFairy(JSON.parse(savedFairy));

    // Show random fairy tip on load
    const randomTip = fairyTips[Math.floor(Math.random() * fairyTips.length)];
    setFairyTip(randomTip);
    setShowFairyTip(true);
    setTimeout(() => setShowFairyTip(false), 4000);
  }, []);

  useEffect(() => {
    localStorage.setItem('fairyQuests', JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem('fairyRewards', JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem('fairyCustomization', JSON.stringify(fairy));
  }, [fairy]);

  const createQuest = () => {
    if (!questForm.name.trim() || !questForm.deadline) return;

    const newQuest: Quest = {
      id: Date.now().toString(),
      name: questForm.name.trim(),
      description: questForm.description.trim(),
      deadline: questForm.deadline,
      difficulty: questForm.difficulty,
      progress: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setQuests([...quests, newQuest]);
    
    // Create milestone rewards for the quest
    const questRewards = rewardTemplates.map((template, index) => ({
      id: `${newQuest.id}-${index}`,
      name: template.name,
      icon: template.icon,
      description: template.description,
      questId: newQuest.id,
      milestone: index === 0 ? 0 : (index * 25),
      claimed: false
    }));

    setRewards([...rewards, ...questRewards]);
    resetQuestForm();
  };

  const updateQuest = () => {
    if (!editingQuest || !questForm.name.trim() || !questForm.deadline) return;

    const updatedQuest = {
      ...editingQuest,
      name: questForm.name.trim(),
      description: questForm.description.trim(),
      deadline: questForm.deadline,
      difficulty: questForm.difficulty
    };

    setQuests(quests.map(q => q.id === editingQuest.id ? updatedQuest : q));
    setEditingQuest(null);
    resetQuestForm();
  };

  const resetQuestForm = () => {
    setQuestForm({
      name: '',
      description: '',
      deadline: '',
      difficulty: 'Medium'
    });
    setShowQuestForm(false);
    setEditingQuest(null);
  };

  const updateQuestProgress = (questId: string, progress: number) => {
    setQuests(quests.map(quest => {
      if (quest.id === questId) {
        const updatedQuest = {
          ...quest,
          progress,
          status: progress >= 100 ? 'completed' as const : quest.status,
          completedAt: progress >= 100 ? new Date().toISOString() : quest.completedAt
        };
        
        // Check for new rewards to unlock
        const questRewards = rewards.filter(r => r.questId === questId);
        questRewards.forEach(reward => {
          if (progress >= reward.milestone && !reward.claimed && reward.milestone > 0) {
            // Auto-claim milestone rewards
            setRewards(prev => prev.map(r => 
              r.id === reward.id ? { ...r, claimed: true, claimedAt: new Date().toISOString() } : r
            ));
          }
        });

        return updatedQuest;
      }
      return quest;
    }));
  };

  const abandonQuest = (questId: string) => {
    setQuests(quests.map(quest => 
      quest.id === questId ? { ...quest, status: 'abandoned' } : quest
    ));
  };

  const deleteQuest = (questId: string) => {
    setQuests(quests.filter(q => q.id !== questId));
    setRewards(rewards.filter(r => r.questId !== questId));
  };

  const claimReward = (rewardId: string) => {
    setRewards(rewards.map(reward => 
      reward.id === rewardId 
        ? { ...reward, claimed: true, claimedAt: new Date().toISOString() }
        : reward
    ));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100 border-green-200';
      case 'Medium': return 'text-amber-600 bg-amber-100 border-amber-200';
      case 'Hard': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getFairyColor = (color: string) => {
    switch (color) {
      case 'green': return 'text-emerald-500';
      case 'gold': return 'text-yellow-500';
      case 'pink': return 'text-pink-500';
      default: return 'text-emerald-500';
    }
  };

  const getProgressTreeBranches = () => {
    return quests.map((quest, index) => {
      const angle = (index * 60) - 30; // Spread branches around the tree
      const length = Math.min(quest.progress, 100);
      const isCompleted = quest.status === 'completed';
      
      return {
        id: quest.id,
        angle,
        length,
        isCompleted,
        quest
      };
    });
  };

  const activeQuests = quests.filter(q => q.status === 'active');
  const completedQuests = quests.filter(q => q.status === 'completed');
  const unclaimedRewards = rewards.filter(r => !r.claimed && r.milestone === 0);
  const claimedRewards = rewards.filter(r => r.claimed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 font-serif mb-2">
          🧚‍♀️ Fairy Quest Log 🧚‍♀️
        </h2>
        <p className="text-emerald-600">Embark on magical quests and watch your enchanted progress tree grow</p>
      </div>

      {/* Fairy Guide */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Fairy Sprite */}
          <div 
            className={`w-16 h-16 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 flex items-center justify-center cursor-pointer transform transition-all duration-300 hover:scale-110 animate-bounce ${getFairyColor(fairy.color)}`}
            onClick={() => {
              const randomTip = fairyTips[Math.floor(Math.random() * fairyTips.length)];
              setFairyTip(randomTip);
              setShowFairyTip(true);
              setTimeout(() => setShowFairyTip(false), 3000);
            }}
          >
            <span className="text-2xl">🧚‍♀️</span>
          </div>
          
          {/* Fairy Tip */}
          {showFairyTip && (
            <div className="absolute bottom-full right-0 mb-2 w-64 bg-white/90 backdrop-blur-sm rounded-2xl p-3 border border-emerald-200 shadow-lg animate-fade-in">
              <div className="text-sm text-emerald-800 font-medium">
                <span className="font-serif text-emerald-600">{fairy.name} says:</span>
                <br />
                {fairyTip}
              </div>
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/90"></div>
            </div>
          )}
          
          {/* Customize Fairy Button */}
          <button
            onClick={() => setShowFairyCustomizer(true)}
            className="absolute -top-2 -left-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-emerald-600 transition-colors duration-200"
          >
            <Settings className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setShowQuestForm(true)}
          className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Begin New Quest</span>
        </button>
        
        <button
          onClick={() => setShowRewards(true)}
          className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
        >
          <Gift className="w-5 h-5" />
          <span>Rewards ({claimedRewards.length})</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quest Log */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Quests */}
          <div className="backdrop-blur-md bg-white/50 rounded-3xl p-6 border border-emerald-200/50 relative overflow-hidden">
            {/* Decorative vine border */}
            <div className="absolute inset-0 border-2 border-emerald-300/30 rounded-3xl animate-pulse"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-emerald-800 font-serif mb-6 flex items-center">
                <Target className="w-6 h-6 mr-2" />
                Active Quests
              </h3>

              {activeQuests.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🌟</div>
                  <h4 className="text-xl font-semibold text-emerald-700 mb-2">No active quests</h4>
                  <p className="text-emerald-600">Begin your first magical quest to start your adventure!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeQuests.map(quest => (
                    <div key={quest.id} className="bg-white/60 rounded-2xl p-6 border border-emerald-200/50 relative overflow-hidden">
                      {/* Quest header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-emerald-800 font-serif mb-2">{quest.name}</h4>
                          {quest.description && (
                            <p className="text-emerald-600 mb-3">{quest.description}</p>
                          )}
                          <div className="flex items-center space-x-4 text-sm">
                            <span className={`px-3 py-1 rounded-full border ${getDifficultyColor(quest.difficulty)}`}>
                              {quest.difficulty}
                            </span>
                            <span className="flex items-center text-emerald-600">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(quest.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setEditingQuest(quest);
                              setQuestForm({
                                name: quest.name,
                                description: quest.description,
                                deadline: quest.deadline,
                                difficulty: quest.difficulty
                              });
                              setShowQuestForm(true);
                            }}
                            className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100 rounded-lg transition-colors duration-200"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteQuest(quest.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-emerald-700">Quest Progress</span>
                          <span className="text-sm text-emerald-600">{quest.progress}%</span>
                        </div>
                        <div className="relative">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={quest.progress}
                            onChange={(e) => updateQuestProgress(quest.id, parseInt(e.target.value))}
                            className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div 
                            className="absolute top-0 left-0 h-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg transition-all duration-300"
                            style={{ width: `${quest.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-3">
                        {quest.progress < 100 && (
                          <button
                            onClick={() => abandonQuest(quest.id)}
                            className="px-4 py-2 text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors duration-200 text-sm"
                          >
                            Abandon Quest
                          </button>
                        )}
                        {quest.progress >= 100 && (
                          <div className="flex items-center text-emerald-600 font-medium">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Quest Completed! 🎉
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Completed Quests */}
          {completedQuests.length > 0 && (
            <div className="backdrop-blur-md bg-white/50 rounded-3xl p-6 border border-emerald-200/50">
              <h3 className="text-xl font-bold text-emerald-800 font-serif mb-4 flex items-center">
                <Crown className="w-5 h-5 mr-2" />
                Completed Quests ({completedQuests.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedQuests.map(quest => (
                  <div key={quest.id} className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-xl p-4 border border-emerald-200">
                    <h4 className="font-bold text-emerald-800 mb-1">{quest.name}</h4>
                    <p className="text-sm text-emerald-600">
                      Completed {quest.completedAt ? new Date(quest.completedAt).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Enchanted Progress Tree */}
        <div className="backdrop-blur-md bg-white/50 rounded-3xl p-6 border border-emerald-200/50 relative overflow-hidden">
          <div className="absolute inset-0 border-2 border-emerald-300/30 rounded-3xl animate-pulse"></div>
          
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-emerald-800 font-serif mb-6 text-center flex items-center justify-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Enchanted Progress Tree
            </h3>

            {/* Tree Visualization */}
            <div className="relative h-80 flex items-end justify-center">
              {/* Tree Trunk */}
              <div className="w-8 h-32 bg-gradient-to-t from-amber-800 to-amber-600 rounded-t-lg relative">
                {/* Tree Base */}
                <div className="absolute -bottom-2 -left-2 w-12 h-6 bg-emerald-200 rounded-full opacity-50"></div>
              </div>

              {/* Tree Branches */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 320">
                {getProgressTreeBranches().map((branch, index) => {
                  const startX = 150;
                  const startY = 250;
                  const length = (branch.length / 100) * 80;
                  const endX = startX + Math.cos((branch.angle * Math.PI) / 180) * length;
                  const endY = startY - Math.sin((branch.angle * Math.PI) / 180) * length;

                  return (
                    <g key={branch.id}>
                      {/* Branch */}
                      <line
                        x1={startX}
                        y1={startY}
                        x2={endX}
                        y2={endY}
                        stroke={branch.isCompleted ? "#fbbf24" : "#10b981"}
                        strokeWidth={branch.isCompleted ? "4" : "3"}
                        className={branch.isCompleted ? "animate-pulse" : ""}
                      />
                      
                      {/* Leaves/Sparkles */}
                      {branch.length > 25 && (
                        <circle
                          cx={endX}
                          cy={endY}
                          r={branch.isCompleted ? "6" : "4"}
                          fill={branch.isCompleted ? "#fbbf24" : "#34d399"}
                          className={branch.isCompleted ? "animate-ping" : ""}
                        />
                      )}
                      
                      {/* Quest name tooltip */}
                      <text
                        x={endX + 10}
                        y={endY}
                        fontSize="10"
                        fill="#065f46"
                        className="font-medium"
                      >
                        {branch.quest.name.substring(0, 15)}...
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Magical Effects */}
              <div className="absolute inset-0 pointer-events-none">
                {completedQuests.length > 0 && (
                  <>
                    <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-60"></div>
                    <div className="absolute top-20 right-12 w-1 h-1 bg-emerald-300 rounded-full animate-ping delay-1000 opacity-80"></div>
                    <div className="absolute bottom-20 left-8 w-1.5 h-1.5 bg-green-300 rounded-full animate-ping delay-2000 opacity-70"></div>
                  </>
                )}
              </div>
            </div>

            {/* Tree Stats */}
            <div className="mt-6 text-center space-y-2">
              <div className="text-sm text-emerald-600">
                <strong>{activeQuests.length}</strong> active quests
              </div>
              <div className="text-sm text-emerald-600">
                <strong>{completedQuests.length}</strong> completed quests
              </div>
              <div className="text-sm text-emerald-600">
                <strong>{claimedRewards.length}</strong> rewards earned
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quest Form Modal */}
      {showQuestForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="backdrop-blur-md bg-white/90 rounded-3xl p-8 max-w-md w-full border border-emerald-200/50 relative overflow-hidden">
            <div className="absolute inset-0 border-2 border-emerald-300/30 rounded-3xl animate-pulse"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-emerald-800 font-serif">
                  {editingQuest ? 'Edit Quest' : 'Begin New Quest'}
                </h3>
                <button
                  onClick={resetQuestForm}
                  className="p-2 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-emerald-700 font-medium mb-2">
                    ✨ Quest Name *
                  </label>
                  <input
                    type="text"
                    value={questForm.name}
                    onChange={(e) => setQuestForm({...questForm, name: e.target.value})}
                    placeholder="Find the Golden Acorn"
                    maxLength={50}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:border-emerald-400 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 bg-white/80 backdrop-blur-sm"
                    required
                  />
                  <div className="text-xs text-emerald-600 mt-1">
                    {questForm.name.length}/50 characters
                  </div>
                </div>

                <div>
                  <label className="block text-emerald-700 font-medium mb-2">
                    📝 Quest Description
                  </label>
                  <textarea
                    value={questForm.description}
                    onChange={(e) => setQuestForm({...questForm, description: e.target.value})}
                    placeholder="Seek the enchanted forest's treasure..."
                    maxLength={200}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:border-emerald-400 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 bg-white/80 backdrop-blur-sm resize-none h-20"
                  />
                  <div className="text-xs text-emerald-600 mt-1">
                    {questForm.description.length}/200 characters
                  </div>
                </div>

                <div>
                  <label className="block text-emerald-700 font-medium mb-2">
                    📅 Quest Deadline *
                  </label>
                  <input
                    type="date"
                    value={questForm.deadline}
                    onChange={(e) => setQuestForm({...questForm, deadline: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:border-emerald-400 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 bg-white/80 backdrop-blur-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-emerald-700 font-medium mb-2">
                    ⚔️ Difficulty Level *
                  </label>
                  <select
                    value={questForm.difficulty}
                    onChange={(e) => setQuestForm({...questForm, difficulty: e.target.value as Quest['difficulty']})}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:border-emerald-400 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 bg-white/80 backdrop-blur-sm"
                    required
                  >
                    <option value="Easy">🟢 Easy</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Hard">🔴 Hard</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetQuestForm}
                    className="flex-1 px-4 py-3 text-emerald-600 border border-emerald-200 rounded-xl hover:bg-emerald-50 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingQuest ? updateQuest : createQuest}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingQuest ? 'Update Quest' : 'Begin Quest'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fairy Customizer Modal */}
      {showFairyCustomizer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="backdrop-blur-md bg-white/90 rounded-3xl p-8 max-w-md w-full border border-emerald-200/50 relative overflow-hidden">
            <div className="absolute inset-0 border-2 border-emerald-300/30 rounded-3xl animate-pulse"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-emerald-800 font-serif">
                  Customize Your Fairy Guide
                </h3>
                <button
                  onClick={() => setShowFairyCustomizer(false)}
                  className="p-2 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-emerald-700 font-medium mb-2">
                    ✨ Fairy Name
                  </label>
                  <input
                    type="text"
                    value={fairy.name}
                    onChange={(e) => setFairy({...fairy, name: e.target.value})}
                    placeholder="Sparkle"
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:border-emerald-400 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="block text-emerald-700 font-medium mb-2">
                    🎨 Fairy Color
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'green', name: 'Forest Green', class: 'from-emerald-400 to-green-500' },
                      { id: 'gold', name: 'Golden', class: 'from-yellow-400 to-amber-500' },
                      { id: 'pink', name: 'Rose Pink', class: 'from-pink-400 to-rose-500' }
                    ].map(color => (
                      <button
                        key={color.id}
                        onClick={() => setFairy({...fairy, color: color.id as any})}
                        className={`p-4 rounded-xl bg-gradient-to-r ${color.class} text-white font-medium transition-all duration-200 ${
                          fairy.color === color.id ? 'ring-2 ring-gray-400 transform scale-105' : 'hover:transform hover:scale-105'
                        }`}
                      >
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-emerald-700 font-medium mb-2">
                    🦋 Wing Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'butterfly', name: 'Butterfly Wings', emoji: '🦋' },
                      { id: 'dragonfly', name: 'Dragonfly Wings', emoji: '🪲' }
                    ].map(wing => (
                      <button
                        key={wing.id}
                        onClick={() => setFairy({...fairy, wings: wing.id as any})}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          fairy.wings === wing.id 
                            ? 'border-emerald-400 bg-emerald-100 transform scale-105' 
                            : 'border-emerald-200 bg-white/50 hover:bg-emerald-50'
                        }`}
                      >
                        <div className="text-2xl mb-2">{wing.emoji}</div>
                        <div className="text-sm font-medium text-emerald-800">{wing.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowFairyCustomizer(false)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Save Customization
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rewards Modal */}
      {showRewards && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="backdrop-blur-md bg-white/90 rounded-3xl p-8 max-w-2xl w-full border border-emerald-200/50 relative overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="absolute inset-0 border-2 border-emerald-300/30 rounded-3xl animate-pulse"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-emerald-800 font-serif flex items-center">
                  <Gift className="w-6 h-6 mr-2" />
                  Enchanted Rewards
                </h3>
                <button
                  onClick={() => setShowRewards(false)}
                  className="p-2 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Unclaimed Rewards */}
              {unclaimedRewards.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-emerald-700 mb-3">Available to Claim</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {unclaimedRewards.map(reward => (
                      <div key={reward.id} className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl p-4 border border-amber-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{reward.icon}</span>
                            <div>
                              <h5 className="font-bold text-amber-800">{reward.name}</h5>
                              <p className="text-sm text-amber-600">{reward.description}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => claimReward(reward.id)}
                            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
                          >
                            Claim
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Claimed Rewards */}
              <div>
                <h4 className="text-lg font-semibold text-emerald-700 mb-3">
                  Your Collection ({claimedRewards.length})
                </h4>
                {claimedRewards.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">🎁</div>
                    <p className="text-emerald-600">Complete quests to earn magical rewards!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {claimedRewards.map(reward => (
                      <div key={reward.id} className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-xl p-4 border border-emerald-200">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{reward.icon}</span>
                          <div>
                            <h5 className="font-bold text-emerald-800">{reward.name}</h5>
                            <p className="text-sm text-emerald-600">{reward.description}</p>
                            {reward.claimedAt && (
                              <p className="text-xs text-emerald-500">
                                Claimed {new Date(reward.claimedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(to right, #10b981, #059669);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(to right, #10b981, #059669);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default Goals;
