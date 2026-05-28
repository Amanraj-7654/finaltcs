import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getLeaderboard, type LeaderboardEntry } from '../services/codeService';
import { Trophy, Timer, Calendar, ChevronRight, ArrowLeft, Medal, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

interface QuestionData {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  type: string;
  constraints: string;
}

interface Contest {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  questions?: QuestionData[];
}

type ContestTab = 'problems' | 'leaderboard';

const ContestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());
  const [activeTab, setActiveTab] = useState<ContestTab>('problems');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await api.get(`/contests/${id}`);
        setContest(response.data);
      } catch (error) {
        console.error('Failed to fetch contest details', error);
        toast.error('Failed to load contest details.');
      } finally {
        setLoading(false);
      }
    };
    fetchContest();
  }, [id]);

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchLeaderboard = useCallback(async () => {
    if (!id) return;
    setLeaderboardLoading(true);
    try {
      const data = await getLeaderboard(Number(id));
      setLeaderboard(data);
    } catch {
      // silently fail
    } finally {
      setLeaderboardLoading(false);
    }
  }, [id]);

  // Fetch leaderboard when tab is opened; poll every 10s during active contest
  useEffect(() => {
    if (activeTab !== 'leaderboard') return;
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, [activeTab, fetchLeaderboard]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Contest not found</h2>
        <button onClick={() => navigate('/contests')} className="text-primary hover:underline">
          Return to Contests
        </button>
      </div>
    );
  }

  const startTime = new Date(contest.startTime);
  const endTime = new Date(contest.endTime);
  const isUpcoming = now < startTime;
  const isPast = now > endTime;
  const isActive = now >= startTime && now <= endTime;

  const getStatusBadge = () => {
    if (isUpcoming) return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">Upcoming</span>;
    if (isActive) return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium animate-pulse">Active Now</span>;
    return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">Past Contest</span>;
  };

  const formatTimeLeft = (targetTime: Date) => {
    const diff = targetTime.getTime() - now.getTime();
    if (diff <= 0) return '00:00:00';
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate('/contests')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft size={20} /> Back to Contests
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-slate-900 to-indigo-900 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <Trophy size={200} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">{getStatusBadge()}</div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{contest.title}</h1>
            <div className="flex flex-wrap gap-6 text-indigo-100">
              <div className="flex items-center gap-2">
                <Calendar size={20} />
                <span>{startTime.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer size={20} />
                <span>{contest.durationMinutes} Minutes</span>
              </div>
            </div>
          </div>
        </div>

        {isActive && (
          <div className="bg-green-50 p-6 border-b border-green-100 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-green-900">Contest is live!</h3>
              <p className="text-green-700">Good luck and happy coding.</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-600 font-medium uppercase tracking-wider mb-1">Time Remaining</p>
              <p className="text-3xl font-mono font-bold text-green-800">{formatTimeLeft(endTime)}</p>
            </div>
          </div>
        )}

        {isUpcoming && (
          <div className="bg-yellow-50 p-6 border-b border-yellow-100 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-yellow-900">Starts Soon</h3>
              <p className="text-yellow-700">Get ready to compete.</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-yellow-600 font-medium uppercase tracking-wider mb-1">Starts In</p>
              <p className="text-3xl font-mono font-bold text-yellow-800">{formatTimeLeft(startTime)}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          <button
            onClick={() => setActiveTab('problems')}
            className={`px-4 py-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'problems' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Trophy size={16} /> Problems
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'leaderboard' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Medal size={16} /> Leaderboard
            {isActive && <span className="ml-1 w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />}
          </button>
        </div>

        <div className="p-8">
          {/* Problems Tab */}
          {activeTab === 'problems' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contest Problems</h2>
              {isUpcoming ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                  <Timer size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900">Problems are hidden</h3>
                  <p className="text-gray-500 mt-2">The problems will be revealed once the contest begins.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(!contest.questions || contest.questions.length === 0) ? (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
                      No problems assigned to this contest yet.
                    </div>
                  ) : (
                    contest.questions.map((q, index) => (
                      <div key={q.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                        <div className="flex items-start gap-4">
                          <div className="bg-gray-100 text-gray-500 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{q.title}</h3>
                            <div className="flex gap-3 text-sm">
                              <span className={`px-2.5 py-1 rounded-md font-medium ${
                                q.difficulty === 'EASY' ? 'bg-green-100 text-green-700' :
                                q.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {q.difficulty}
                              </span>
                              <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">{q.type}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/programming/${q.id}`)}
                          className="w-full md:w-auto bg-gray-900 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                        >
                          {isPast ? 'Practice' : 'Solve'} <ChevronRight size={18} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Leaderboard</h2>
                {isActive && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
                    Live — updates every 10s
                  </span>
                )}
              </div>
              {leaderboardLoading && leaderboard.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600" />
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                  <Users size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No submissions yet. Be the first!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
                        <th className="pb-3 pr-4">Rank</th>
                        <th className="pb-3 pr-4">User</th>
                        <th className="pb-3 pr-4 text-center">Solved</th>
                        <th className="pb-3 text-right">Penalty (min)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {leaderboard.map((entry) => {
                        const isCurrentUser = user && entry.username === (user as { username?: string }).username;
                        return (
                          <tr key={entry.userId} className={`${isCurrentUser ? 'bg-blue-50' : 'hover:bg-gray-50'} transition-colors`}>
                            <td className="py-4 pr-4">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                entry.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                                entry.rank === 2 ? 'bg-gray-200 text-gray-700' :
                                entry.rank === 3 ? 'bg-orange-100 text-orange-700' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {entry.rank}
                              </div>
                            </td>
                            <td className="py-4 pr-4">
                              <span className={`font-semibold ${isCurrentUser ? 'text-blue-700' : 'text-gray-900'}`}>
                                {entry.username}
                                {isCurrentUser && <span className="ml-2 text-xs text-blue-500">(you)</span>}
                              </span>
                            </td>
                            <td className="py-4 pr-4 text-center">
                              <span className="text-lg font-bold text-green-600">{entry.totalSolved}</span>
                            </td>
                            <td className="py-4 text-right text-gray-500">{entry.totalPenaltyMinutes}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestDetail;
