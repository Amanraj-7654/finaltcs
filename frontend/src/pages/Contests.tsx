import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { Trophy, Timer, Calendar, Users, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Contest {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

interface QuestionData {
  id?: number;
  title: string;
  description?: string;
  difficulty?: string;
  type?: string;
  constraints?: string;
}

const Contests: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [now, setNow] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContest, setNewContest] = useState({
    title: '',
    startTime: '',
    endTime: '',
    durationMinutes: 120
  });
  const [availableQuestions, setAvailableQuestions] = useState<QuestionData[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  const [newQuestions, setNewQuestions] = useState<QuestionData[]>([]);

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/questions');
      setAvailableQuestions(response.data);
    } catch (error) {
      console.error('Failed to fetch questions', error);
      toast.error('Failed to fetch questions.');
    }
  };

  const fetchContests = async () => {
    try {
      const response = await api.get('/contests');
      setContests(response.data);
    } catch (error) {
      console.error('Failed to fetch contests', error);
      toast.error('Failed to fetch contests.');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchContests();
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (location.state?.openCreateModal && isAdmin) {
      setShowAddModal(true);
      // Clear the state so it doesn't reopen on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state, isAdmin]);

  useEffect(() => {
    if (showAddModal) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchQuestions();
    }
  }, [showAddModal]);

  useEffect(() => {
    if (newContest.startTime && newContest.endTime) {
      const start = new Date(newContest.startTime).getTime();
      const end = new Date(newContest.endTime).getTime();
      if (end > start) {
        const diffInMinutes = Math.round((end - start) / 60000);
        if (diffInMinutes !== newContest.durationMinutes) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setNewContest(prev => ({ ...prev, durationMinutes: diffInMinutes }));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newContest.startTime, newContest.endTime]);

  const handleAddContest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const start = new Date(newContest.startTime).getTime();
    const end = new Date(newContest.endTime).getTime();
    if (end <= start) {
      toast.error('End time must be after start time.');
      return;
    }

    try {
      // 1. Create new inline questions
      const createdQuestions = [];
      for (const q of newQuestions) {
        if (q.title && q.description) {
          const res = await api.post('/questions', q);
          createdQuestions.push(res.data);
        }
      }

      // 2. Get selected existing questions
      const selected = availableQuestions.filter(q => q.id !== undefined && selectedQuestionIds.includes(q.id));

      // 3. Combine
      const allQuestions = [...selected, ...createdQuestions];

      await api.post('/contests', {
        ...newContest,
        startTime: new Date(newContest.startTime).toISOString(),
        endTime: new Date(newContest.endTime).toISOString(),
        questions: allQuestions
      });

      setShowAddModal(false);
      setNewContest({
        title: '',
        startTime: '',
        endTime: '',
        durationMinutes: 120
      });
      setSelectedQuestionIds([]);
      setNewQuestions([]);
      fetchContests();
      toast.success('Contest created successfully!');
    } catch (error: any) {
      console.error('Failed to create contest', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to create contest. Please check your inputs.';
      toast.error(errorMsg);
    }
  };

  const handleDeleteContest = async (contestId: number) => {
    if (window.confirm('Are you sure you want to delete this contest?')) {
      try {
        await api.delete(`/contests/${contestId}`);
        fetchContests();
        toast.success('Contest deleted successfully.');
      } catch (error: any) {
        console.error('Failed to delete contest', error);
        toast.error('Failed to delete contest.');
      }
    }
  };

  const handleAddInlineQuestion = () => {
    setNewQuestions([...newQuestions, { title: '', description: '', difficulty: 'EASY', type: 'program', constraints: '' }]);
  };

  const updateInlineQuestion = (index: number, field: string, value: string) => {
    const updated = [...newQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setNewQuestions(updated);
  };

  const removeInlineQuestion = (index: number) => {
    setNewQuestions(newQuestions.filter((_, i) => i !== index));
  };

  const toggleQuestionSelection = (id: number | undefined) => {
    if (id === undefined) return;
    if (selectedQuestionIds.includes(id)) {
      setSelectedQuestionIds(selectedQuestionIds.filter(qId => qId !== id));
    } else {
      setSelectedQuestionIds([...selectedQuestionIds, id]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">Active Contests</h1>
          <p className="text-gray-500 mt-2 text-lg">Compete with others and prove your skills.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Plus size={20} /> Create Contest
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {contests.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl border border-gray-100 text-center">
            <Trophy size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No Active Contests</h3>
            <p className="text-gray-500 mt-2">Check back later for upcoming challenges!</p>
          </div>
        ) : (
          contests.map((contest) => {
            const start = new Date(contest.startTime);
            const end = new Date(contest.endTime);
            const isUpcoming = now < start;
            const isPast = now > end;
            const isActive = now >= start && now <= end;

            return (
              <div key={contest.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                <div className={`h-2 ${isActive ? 'bg-green-500' : isUpcoming ? 'bg-yellow-400' : 'bg-gray-400'}`}></div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{contest.title}</h3>
                    <div className="flex items-center gap-1.5">
                      {isActive && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold animate-pulse">LIVE</span>}
                      {isUpcoming && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">UPCOMING</span>}
                      {isPast && <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-bold">PAST</span>}
                      {isAdmin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteContest(contest.id);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          title="Delete Contest"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 flex-grow">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Calendar size={16} />
                      <span>{start.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Timer size={16} />
                      <span>{contest.durationMinutes} Minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Users size={16} />
                      <span>Registration Open</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate(`/contests/${contest.id}`)}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-auto ${
                      isActive ? 'bg-primary text-white hover:bg-blue-700 shadow-md hover:shadow-lg' : 
                      isUpcoming ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' : 
                      'bg-gray-50 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {isActive ? 'Enter Contest' : isUpcoming ? 'View Details' : 'Practice'} <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Example static card for demo */}
      {contests.length === 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Upcoming Challenges</h2>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                <Trophy size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Techcode Weekly #42</h3>
                <p className="text-blue-100 mt-1">Starts in 2 days • 1500+ developers joined</p>
              </div>
            </div>
            <button className="bg-white text-blue-700 px-8 py-3 rounded-xl font-bold whitespace-nowrap hover:bg-blue-50 transition-colors">
              Remind Me
            </button>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Trophy className="text-primary" size={24} />
                Create New Contest
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300">
              <form id="create-contest-form" onSubmit={handleAddContest} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  value={newContest.title}
                  onChange={(e) => setNewContest({ ...newContest, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  value={newContest.startTime}
                  onChange={(e) => setNewContest({ ...newContest, startTime: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="datetime-local"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  value={newContest.endTime}
                  onChange={(e) => setNewContest({ ...newContest, endTime: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  required
                  min="1"
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary bg-gray-50 text-gray-500"
                  value={newContest.durationMinutes}
                  onChange={(e) => setNewContest({ ...newContest, durationMinutes: parseInt(e.target.value) || 0 })}
                  title="Auto-calculated from Start Time and End Time"
                />
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Select Existing Questions</h3>
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
                  {availableQuestions.length === 0 ? (
                    <p className="text-sm text-gray-500 p-2">No questions available.</p>
                  ) : (
                    availableQuestions.map(q => (
                      <label key={q.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={q.id !== undefined && selectedQuestionIds.includes(q.id)}
                          onChange={() => q.id !== undefined && toggleQuestionSelection(q.id)}
                          className="rounded text-primary focus:ring-primary"
                        />
                        <span className="text-sm font-medium">{q.title}</span>
                        <span className="text-xs text-gray-500 ml-auto bg-gray-100 px-2 py-0.5 rounded">{q.difficulty}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-gray-900">Create New Questions</h3>
                  <button
                    type="button"
                    onClick={handleAddInlineQuestion}
                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-lg flex items-center gap-1 font-medium transition-colors"
                  >
                    <Plus size={16} /> Add Question
                  </button>
                </div>

                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                  {newQuestions.map((q, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
                      <button
                        type="button"
                        onClick={() => removeInlineQuestion(idx)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                      <div className="space-y-3 mt-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            required
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary bg-white"
                            value={q.title}
                            onChange={(e) => updateInlineQuestion(idx, 'title', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            required
                            rows={2}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary bg-white"
                            value={q.description}
                            onChange={(e) => updateInlineQuestion(idx, 'description', e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Difficulty</label>
                            <select
                              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary bg-white"
                              value={q.difficulty}
                              onChange={(e) => updateInlineQuestion(idx, 'difficulty', e.target.value)}
                            >
                              <option value="EASY">Easy</option>
                              <option value="MEDIUM">Medium</option>
                              <option value="HARD">Hard</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                            <select
                              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary bg-white"
                              value={q.type}
                              onChange={(e) => updateInlineQuestion(idx, 'type', e.target.value)}
                            >
                              <option value="program">Program</option>
                              <option value="constant">Constant</option>
                              <option value="algorithm">Algorithm</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              </form>
            </div>
            
            <div className="flex justify-end gap-4 p-6 border-t border-gray-100 shrink-0 bg-gray-50">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2.5 text-gray-700 font-medium bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="create-contest-form"
                className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
              >
                Create Contest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contests;
