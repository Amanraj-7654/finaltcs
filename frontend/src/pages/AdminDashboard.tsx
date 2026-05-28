import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { addTestCase, deleteTestCase, getAllTestCasesAdmin } from '../services/codeService';
import { Shield, Users, Database, Plus, Trash2, Edit, Search, FileCode, Trophy, Eye, EyeOff, X, CheckCircle2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface TestCaseItem {
  id: number;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  explanation: string | null;
}

const AdminDashboard: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [questions, setQuestions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'questions'>('users');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isExternalLink, setIsExternalLink] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    difficulty: 'EASY',
    type: 'program',
    description: '',
    examples: '',
    constraints: '',
    link: '',
    boilerplates: '',
    driverCode: ''
  });

  // Test case management state
  const [showTestCaseModal, setShowTestCaseModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<{ id: number; title: string } | null>(null);
  const [testCases, setTestCases] = useState<TestCaseItem[]>([]);
  const [tcLoading, setTcLoading] = useState(false);
  const [newTestCase, setNewTestCase] = useState({ input: '', expectedOutput: '', isHidden: false, explanation: '' });
  const [addingTc, setAddingTc] = useState(false);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('Failed to fetch questions', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchQuestions();
  }, []);

  const handleDeleteUser = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${id}`);
        fetchUsers();
        toast.success('User deleted.');
      } catch (error) {
        console.error('Delete failed', error);
        toast.error('Failed to delete user.');
      }
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await api.delete(`/questions/${id}`);
        fetchQuestions();
        toast.success('Question deleted.');
      } catch (error) {
        console.error('Delete failed', error);
        toast.error('Failed to delete question.');
      }
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/questions', newQuestion);
      setShowAddModal(false);
      setIsExternalLink(false);
      setNewQuestion({ title: '', difficulty: 'EASY', type: 'program', description: '', examples: '', constraints: '', link: '', boilerplates: '', driverCode: '' });
      fetchQuestions();
      toast.success('Question added!');
    } catch (error) {
      console.error('Add question failed', error);
      toast.error('Failed to add question.');
    }
  };

  // ── Test Case Management ──────────────────────────────────────────────────
  const openTestCaseModal = async (q: { id: number; title: string }) => {
    setSelectedQuestion(q);
    setShowTestCaseModal(true);
    setTcLoading(true);
    try {
      const data = await getAllTestCasesAdmin(q.id);
      setTestCases(data);
    } catch {
      toast.error('Failed to load test cases.');
    } finally {
      setTcLoading(false);
    }
  };

  const handleAddTestCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion) return;
    setAddingTc(true);
    try {
      await addTestCase(selectedQuestion.id, newTestCase);
      toast.success(`${newTestCase.isHidden ? 'Hidden' : 'Visible'} test case added!`);
      setNewTestCase({ input: '', expectedOutput: '', isHidden: false, explanation: '' });
      // Refresh list
      const data = await getAllTestCasesAdmin(selectedQuestion.id);
      setTestCases(data);
    } catch {
      toast.error('Failed to add test case.');
    } finally {
      setAddingTc(false);
    }
  };

  const handleDeleteTestCase = async (tcId: number) => {
    if (!selectedQuestion) return;
    if (!window.confirm('Delete this test case?')) return;
    try {
      await deleteTestCase(selectedQuestion.id, tcId);
      setTestCases(tc => tc.filter(t => t.id !== tcId));
      toast.success('Test case deleted.');
    } catch {
      toast.error('Failed to delete test case.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Shield size={32} className="text-red-600" />
          <h1 className="text-4xl font-extrabold text-gray-900">Admin Panel</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setActiveTab('questions'); setFilterType('program'); setShowAddModal(true); }}
            className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-gray-50 transition-colors shadow-sm"
          >
            <FileCode size={18} /> Create Program
          </button>
          <button
            onClick={() => navigate('/contests', { state: { openCreateModal: true } })}
            className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Trophy size={18} /> Create Contest
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Users size={18} /> Manage Users
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-6 py-3 font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'questions' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Database size={18} /> Manage Questions
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {activeTab === 'questions' && (
            <div className="flex gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="">All Types</option>
                <option value="program">Programs</option>
                <option value="constant">Constants</option>
                <option value="algorithm">Algorithms</option>
                <option value="data-structure">Data Structures</option>
              </select>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} /> Add Question
              </button>
            </div>
          )}
        </div>

        {/* Users Table */}
        {activeTab === 'users' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.filter(u => u.username.toLowerCase().includes(search.toLowerCase())).map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{u.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'ROLE_ADMIN' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button onClick={() => handleDeleteUser(u.id)} className="text-gray-400 hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Questions Table */
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Difficulty</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {questions.filter(q => {
                  const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase());
                  const matchesType = filterType ? q.type?.toLowerCase() === filterType.toLowerCase() : true;
                  return matchesSearch && matchesType;
                }).map((q) => (
                  <tr key={q.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {q.link ? (
                        <a href={q.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {q.title} <span className="text-xs text-gray-400 ml-1">↗</span>
                        </a>
                      ) : (
                        <Link to={`/programming/${q.id}`} className="text-primary hover:underline">
                          {q.title}
                        </Link>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 rounded text-xs font-bold bg-gray-100 text-gray-700">{q.difficulty}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{q.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end gap-3">
                        <button
                          title="Manage Test Cases"
                          onClick={() => openTestCaseModal({ id: q.id, title: q.title })}
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Question</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  value={newQuestion.title} onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})} />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <input type="checkbox" id="externalLinkToggle" checked={isExternalLink}
                  onChange={(e) => setIsExternalLink(e.target.checked)} className="rounded text-primary focus:ring-primary" />
                <label htmlFor="externalLinkToggle" className="text-sm font-medium text-gray-700">External link (redirects to another page)</label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    value={newQuestion.difficulty} onChange={(e) => setNewQuestion({...newQuestion, difficulty: e.target.value})}>
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    value={newQuestion.type} onChange={(e) => setNewQuestion({...newQuestion, type: e.target.value})}>
                    <option value="program">Program</option>
                    <option value="constant">Constant</option>
                    <option value="algorithm">Algorithm</option>
                    <option value="data-structure">Data Structure</option>
                  </select>
                </div>
              </div>
              {isExternalLink ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                  <input type="url" required placeholder="https://example.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    value={newQuestion.link} onChange={(e) => setNewQuestion({...newQuestion, link: e.target.value})} />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea required={!isExternalLink} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      value={newQuestion.description} onChange={(e) => setNewQuestion({...newQuestion, description: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Examples</label>
                    <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      value={newQuestion.examples} onChange={(e) => setNewQuestion({...newQuestion, examples: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Constraints</label>
                    <textarea rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      value={newQuestion.constraints} onChange={(e) => setNewQuestion({...newQuestion, constraints: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Boilerplates (JSON Map - Method Templates)</label>
                    <textarea rows={3} placeholder='{"java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}"}' className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary font-mono text-xs"
                      value={newQuestion.boilerplates} onChange={(e) => setNewQuestion({...newQuestion, boilerplates: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Driver Code (JSON Map - Wrapper Templates)</label>
                    <textarea rows={3} placeholder='{"java": "import java.util.*;\n\n// {{USER_CODE}}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for(int i=0; i<n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        int[] res = new Solution().twoSum(nums, target);\n        System.out.println(res[0] + \" \" + res[1]);\n    }\n}"}' className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary font-mono text-xs"
                      value={newQuestion.driverCode} onChange={(e) => setNewQuestion({...newQuestion, driverCode: e.target.value})} />
                  </div>
                </>
              )}
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">Add Question</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Test Case Management Modal */}
      {showTestCaseModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={() => setShowTestCaseModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Test Cases</h2>
                <p className="text-sm text-gray-500 mt-0.5">{selectedQuestion.title}</p>
              </div>
              <button onClick={() => setShowTestCaseModal(false)} className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              {/* Existing test cases */}
              {tcLoading ? (
                <div className="text-center py-8 text-gray-500">Loading test cases...</div>
              ) : testCases.length === 0 ? (
                <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                  No test cases yet. Add the first one below.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-700 text-sm">
                      {testCases.filter(t => !t.isHidden).length} visible, {testCases.filter(t => t.isHidden).length} hidden
                    </h3>
                  </div>
                  {testCases.map((tc) => (
                    <div key={tc.id} className={`border rounded-xl p-4 ${tc.isHidden ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${tc.isHidden ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                          {tc.isHidden ? <><EyeOff size={12} /> Hidden</> : <><Eye size={12} /> Visible</>}
                        </span>
                        <button onClick={() => handleDeleteTestCase(tc.id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                        <div>
                          <div className="text-gray-500 text-[10px] uppercase mb-1">Input</div>
                          <pre className="bg-white rounded p-2 border text-gray-800 whitespace-pre-wrap">{tc.input}</pre>
                        </div>
                        <div>
                          <div className="text-gray-500 text-[10px] uppercase mb-1">Expected Output</div>
                          <pre className="bg-white rounded p-2 border text-gray-800 whitespace-pre-wrap">{tc.expectedOutput}</pre>
                        </div>
                      </div>
                      {tc.explanation && (
                        <div className="mt-2 text-xs text-gray-500">💡 {tc.explanation}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add new test case form */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Plus size={16} /> Add Test Case
                </h3>
                <form onSubmit={handleAddTestCase} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Input</label>
                      <textarea required rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-primary"
                        value={newTestCase.input} onChange={e => setNewTestCase({ ...newTestCase, input: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Expected Output</label>
                      <textarea required rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-primary"
                        value={newTestCase.expectedOutput} onChange={e => setNewTestCase({ ...newTestCase, expectedOutput: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Explanation (optional)</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
                      value={newTestCase.explanation} onChange={e => setNewTestCase({ ...newTestCase, explanation: e.target.value })} />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isHiddenCheck" checked={newTestCase.isHidden}
                      onChange={e => setNewTestCase({ ...newTestCase, isHidden: e.target.checked })}
                      className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500" />
                    <label htmlFor="isHiddenCheck" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <EyeOff size={14} className="text-orange-500" /> Hidden test case (never shown to users)
                    </label>
                  </div>
                  <button type="submit" disabled={addingTc}
                    className="w-full py-2 bg-primary text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                    {addingTc ? 'Adding...' : <><CheckCircle2 size={16} /> Add Test Case</>}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
