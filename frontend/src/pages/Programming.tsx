import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getUserSubmissions } from '../services/codeService';
import { useAuth } from '../context/AuthContext';
import { Search, ChevronRight, BookOpen, CheckCircle2, Circle, ChevronLeft, Filter } from 'lucide-react';

interface Question {
  id: number;
  title: string;
  difficulty: string;
  type: string;
  tags: string | null;
}

const PAGE_SIZE = 20;

const Programming: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [search, setSearch] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [solvedIds, setSolvedIds] = useState<Set<number>>(new Set());
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('Failed to fetch questions', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch which questions the user has already solved
  const fetchSolvedIds = async () => {
    if (!user?.id) return;
    try {
      const subs = await getUserSubmissions(user.id);
      const solved = new Set<number>(
        subs
          .filter(s => (s.verdict === 'ACCEPTED' || s.status === 'ACCEPTED') && s.questionId)
          .map(s => Number(s.questionId))
      );
      setSolvedIds(solved);
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    fetchSolvedIds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterDifficulty, filterType]);

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase());
      const matchesDifficulty = filterDifficulty ? q.difficulty === filterDifficulty : true;
      const matchesType = filterType ? q.type?.toLowerCase() === filterType.toLowerCase() : true;
      return matchesSearch && matchesDifficulty && matchesType;
    });
  }, [questions, search, filterDifficulty, filterType]);

  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / PAGE_SIZE));
  const pagedQuestions = filteredQuestions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toUpperCase()) {
      case 'EASY': return 'bg-green-100 text-green-700';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700';
      case 'HARD': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const stats = useMemo(() => ({
    easy: questions.filter(q => q.difficulty === 'EASY').length,
    medium: questions.filter(q => q.difficulty === 'MEDIUM').length,
    hard: questions.filter(q => q.difficulty === 'HARD').length,
    solved: solvedIds.size,
  }), [questions, solvedIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">Practice Problems</h1>
          <p className="text-gray-500 mt-2 text-lg">Sharpen your skills with our curated challenges.</p>
        </div>
        {/* Quick stats */}
        <div className="flex gap-4 text-center text-sm">
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2">
            <div className="font-bold text-green-700 text-lg">{stats.easy}</div>
            <div className="text-green-600 text-xs">Easy</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2">
            <div className="font-bold text-yellow-700 text-lg">{stats.medium}</div>
            <div className="text-yellow-600 text-xs">Medium</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2">
            <div className="font-bold text-red-700 text-lg">{stats.hard}</div>
            <div className="text-red-600 text-xs">Hard</div>
          </div>
          {user && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2">
              <div className="font-bold text-blue-700 text-lg">{stats.solved}</div>
              <div className="text-blue-600 text-xs">Solved</div>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search problems..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary bg-white text-sm"
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
          >
            <option value="">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary bg-white text-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="program">Program</option>
            <option value="algorithm">Algorithm</option>
            <option value="data-structure">Data Structure</option>
            <option value="constant">Constant</option>
          </select>
        </div>
        <span className="text-sm text-gray-500 ml-auto">
          {filteredQuestions.length} problem{filteredQuestions.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">✓</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Difficulty</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-600" />
                    Loading problems...
                  </div>
                </td></tr>
              ) : pagedQuestions.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No problems found matching your criteria.
                </td></tr>
              ) : (
                pagedQuestions.map((q, i) => {
                  const isSolved = solvedIds.has(q.id);
                  const globalIdx = (currentPage - 1) * PAGE_SIZE + i + 1;
                  return (
                    <tr
                      key={q.id}
                      className="hover:bg-blue-50 transition-colors group cursor-pointer"
                      onClick={() => navigate(`/programming/${q.id}`)}
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        {isSolved ? (
                          <CheckCircle2 size={18} className="text-green-500" />
                        ) : (
                          <Circle size={18} className="text-gray-200" />
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">{globalIdx}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-bold transition-colors ${isSolved ? 'text-green-700' : 'text-gray-900 group-hover:text-primary'}`}>
                          {q.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getDifficultyColor(q.difficulty)}`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <BookOpen size={16} />
                          {q.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-primary hover:text-blue-900 inline-flex items-center gap-1">
                          {isSolved ? 'Practice' : 'Solve'} <ChevronRight size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={15} /> Prev
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Programming;
