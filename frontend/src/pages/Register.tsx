import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsAlert, setShowTermsAlert] = useState(false);  // popup: "please tick T&C"
  const [showTermsModal, setShowTermsModal] = useState(false);  // full T&C content modal
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Block submission and show popup if T&C not ticked
    if (!agreedToTerms) {
      setShowTermsAlert(true);
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/signup', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err: unknown) {
      const errorResponse = err as { response?: { data?: string | Record<string, unknown> } };
      const serverMessage =
        typeof errorResponse.response?.data === 'object'
          ? JSON.stringify(errorResponse.response.data)
          : errorResponse.response?.data;
      setError(serverMessage || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-primary rounded-full mb-4">
            <UserPlus size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-500 mt-2">Join TechcodeSolution today</p>
        </div>

        {/* Error / Success banners */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <User size={18} />
              </span>
              <input
                type="text"
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="XYZ@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          {/* Register as Admin */}
          {/* <div className="flex items-center">
            <input
              id="admin-role"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              checked={formData.role === 'admin'}
              onChange={(e) => setFormData({ ...formData, role: e.target.checked ? 'admin' : 'user' })}
            />
            <label htmlFor="admin-role" className="ml-2 block text-sm text-gray-700">
              Register as Admin
            </label>
          </div> */}

          {/* ── Terms & Conditions Checkbox ── */}
          <div
            className={`flex items-start gap-2 p-3 rounded-lg border transition-all ${showTermsAlert && !agreedToTerms
              ? 'border-orange-400 bg-orange-50'
              : 'border-transparent'
              }`}
          >
            <input
              id="terms-checkbox"
              type="checkbox"
              className="mt-0.5 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
              checked={agreedToTerms}
              onChange={(e) => {
                setAgreedToTerms(e.target.checked);
                if (e.target.checked) setShowTermsAlert(false);
              }}
            />
            <label htmlFor="terms-checkbox" className="text-sm text-gray-600 cursor-pointer select-none">
              I agree to the{' '}
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="text-primary font-semibold hover:underline focus:outline-none"
              >
                Terms and Conditions
              </button>
              {' '}and{' '}
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="text-primary font-semibold hover:underline focus:outline-none"
              >
                Privacy Policy
              </button>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-blue-700">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          POPUP: Please tick T&C before continuing
      ══════════════════════════════════════════ */}
      {showTermsAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-7 text-center animate-fade-in">
            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-500 rounded-full mx-auto mb-4">
              <AlertCircle size={34} />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Accept Terms &amp; Conditions
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Please tick the <strong>Terms and Conditions</strong> checkbox
              before creating your account.
            </p>

            <div className="flex flex-col gap-3">
              {/* Accept and continue */}
              <button
                onClick={() => {
                  setAgreedToTerms(true);
                  setShowTermsAlert(false);
                }}
                className="w-full py-2.5 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
              >
                ✓ &nbsp;I Agree — Continue
              </button>

              {/* Read terms first */}
              <button
                onClick={() => {
                  setShowTermsAlert(false);
                  setShowTermsModal(true);
                }}
                className="w-full py-2.5 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all"
              >
                Read Terms &amp; Conditions
              </button>

              {/* Dismiss */}
              <button
                onClick={() => setShowTermsAlert(false)}
                className="text-sm text-gray-400 hover:text-gray-600 transition-all mt-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          MODAL: Full Terms & Conditions content
      ══════════════════════════════════════════ */}
      {showTermsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={() => setShowTermsModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTermsModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold leading-none"
              aria-label="Close"
            >
              &times;
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-5">Terms and Conditions</h3>
            <div className="text-sm text-gray-600 space-y-4 leading-relaxed">
              <p><strong>1. Acceptance of Terms</strong><br />By registering on TechcodeSolution, you agree to be bound by these Terms and Conditions. If you do not agree, please do not register.</p>
              <p><strong>2. Use of the Platform</strong><br />You agree to use the platform only for lawful purposes. Any misuse, including submitting malicious code or attempting to exploit the system, will result in immediate account termination.</p>
              <p><strong>3. Account Responsibility</strong><br />You are responsible for maintaining the confidentiality of your account credentials and all activities that occur under your account.</p>
              <p><strong>4. Intellectual Property</strong><br />All content, problem sets, and materials on this platform are the intellectual property of TechcodeSolution. Reproduction without permission is prohibited.</p>
              <p><strong>5. Privacy Policy</strong><br />We collect only the information necessary to operate the platform (username, email). Your data will never be sold to third parties.</p>
              <p><strong>6. Modifications</strong><br />We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of the updated terms.</p>
              <p><strong>7. Limitation of Liability</strong><br />TechcodeSolution is not liable for any indirect or consequential damages arising from your use of the platform.</p>
            </div>

            <button
              onClick={() => {
                setAgreedToTerms(true);
                setShowTermsModal(false);
                setShowTermsAlert(false);
              }}
              className="mt-6 w-full py-2.5 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
            >
              ✓ &nbsp;I Agree &amp; Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
