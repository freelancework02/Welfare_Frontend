import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  LogIn, 
  Server, 
  AlertCircle, 
  User, 
  Lock,
  ArrowRight
} from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, backendStatus } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (backendStatus === 'offline') {
      setError('Backend server is offline. Please start the server on port 5000.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://welfare-a0jo.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      // Handle network errors
      if (!response.ok && response.status === 0) {
        throw new Error('Cannot connect to server. Please make sure the backend is running on port 5000.');
      }

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      if (error.message.includes('Failed to fetch')) {
        setError('Cannot connect to server. Please make sure the backend is running on port 5000.');
      } else {
        setError(error.message || 'Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Decorative Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Welcome Back
            </h2>
            <p className="text-indigo-100 mt-2">
              Sign in to your account
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {/* Server Status Alert */}
            {backendStatus === 'offline' && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start">
                <Server className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-red-700 dark:text-red-300">
                  <p className="font-medium">Backend server is offline</p>
                  <p className="mt-1">Please run: <code className="bg-red-100 dark:bg-red-900/30 px-1 py-0.5 rounded">node server.js</code> in your backend directory</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </div>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <User className="w-4 h-4 mr-2 text-indigo-600" />
                  Username
                </label>
                <div className="relative">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="w-full px-4 py-3 pl-11 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading || backendStatus === 'offline'}
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-indigo-600" />
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-4 py-3 pl-11 pr-11 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading || backendStatus === 'offline'}
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    disabled={loading || backendStatus === 'offline'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || backendStatus === 'offline'}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  New to our platform?
                </span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <Link 
                to="/register" 
                className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium transition-colors group"
              >
                Create an account
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 border-t border-gray-100 dark:border-gray-600">
            {/* <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p> */}
          </div>
        </div>

        {/* Demo Credentials Hint */}
        {/* <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 text-indigo-600" />
            Demo Access
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Use admin/admin for testing purposes
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default Login;