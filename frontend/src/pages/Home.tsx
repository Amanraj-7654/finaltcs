import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Download, Users, Plus, Trash2, Code, Zap, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface Roadmap {
  id: number;
  title: string;
  description: string;
  pdfPath: string;
}

const Home: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [usersLoading, setUsersLoading] = useState(true);
  const { isAdmin } = useAuth();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoadmap, setNewRoadmap] = useState({ title: '', description: '', file: null as File | null });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const usersResponse = await api.get('/users/count');
        if (isMounted) {
          setTotalUsers(typeof usersResponse.data === 'number' ? usersResponse.data : 0);
        }
      } catch (error) {
        console.error('Failed to fetch total users', error);
        if (isMounted) {
          setTotalUsers(0);
        }
      } finally {
        if (isMounted) {
          setUsersLoading(false);
        }
      }

      try {
        const roadmapsResponse = await api.get('/roadmaps');
        if (isMounted) {
          setRoadmaps(roadmapsResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch roadmaps', error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);


  const handleAddRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoadmap.file) return;

    const formData = new FormData();
    formData.append('title', newRoadmap.title);
    formData.append('description', newRoadmap.description);
    formData.append('file', newRoadmap.file);

    try {
      await api.post('/roadmaps', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowAddModal(false);
      const response = await api.get('/roadmaps');
      setRoadmaps(response.data);
    } catch (error) {
      console.error('Failed to add roadmap', error);
    }
  };

  const handleDeleteRoadmap = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this roadmap?')) {
      try {
        await api.delete(`/roadmaps/${id}`);
        const response = await api.get('/roadmaps');
        setRoadmaps(response.data);
      } catch (error) {
        console.error('Failed to delete roadmap', error);
      }
    }
  };

  const handleDownload = (filename: string) => {
    // We should use the base API URL to ensure it works across environments
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8082/api';
    window.open(`${apiUrl}/roadmaps/download/${filename}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold text-gray-900 sm:text-6xl"
        >
          Master the Art of <span className="text-primary">Coding</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto"
        >
          TechcodeSolution is your ultimate platform to learn, practice, and compete. 
          Bridge the gap between learning and production-ready development.
        </motion.p>
        
        <div className="mt-10 flex justify-center items-center gap-4">
          <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold shadow-sm">
            <Users size={20} />
            <span>{usersLoading ? 'Loading...' : totalUsers} Total Users</span>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
            <Code size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3">Learn</h3>
          <p className="text-gray-500">Access structured roadmaps for Full Stack, Java, MERN, and DevOps.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
            <Zap size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3">Practice</h3>
          <p className="text-gray-500">Solve hundreds of questions in Java, C++, Python, and more.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
            <BookOpen size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3">Compete</h3>
          <p className="text-gray-500">Participate in real-time contests and climb the leaderboard.</p>
        </div>
      </div>

      {/* Roadmaps Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Learning Roadmaps</h2>
            <p className="text-gray-500 mt-2">Follow these paths to become an expert developer.</p>
          </div>
          {isAdmin && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} /> Add Roadmap
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {roadmaps.map((roadmap) => (
            <div key={roadmap.id} className="group relative bg-white border border-gray-200 rounded-xl p-6 hover:border-primary transition-all overflow-hidden">
              <div className="absolute top-0 right-0 p-2">
                {isAdmin && (
                  <button onClick={() => handleDeleteRoadmap(roadmap.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <h4 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">{roadmap.title}</h4>
              <p className="mt-2 text-sm text-gray-500 line-clamp-3">{roadmap.description}</p>
              <button 
                onClick={() => handleDownload(roadmap.pdfPath)}
                className="mt-6 flex items-center gap-2 text-primary font-semibold hover:underline"
              >
                <Download size={18} /> Download PDF
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Roadmap Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold mb-6">Add New Roadmap</h3>
            <form onSubmit={handleAddRoadmap}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={newRoadmap.title}
                  onChange={(e) => setNewRoadmap({...newRoadmap, title: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  value={newRoadmap.description}
                  onChange={(e) => setNewRoadmap({...newRoadmap, description: e.target.value})}
                ></textarea>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">PDF File</label>
                <input 
                  type="file" 
                  accept=".pdf"
                  required
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={(e) => setNewRoadmap({...newRoadmap, file: e.target.files ? e.target.files[0] : null})}
                />
              </div>
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
