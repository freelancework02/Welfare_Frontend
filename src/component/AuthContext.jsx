import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking', 'online', 'offline'

  useEffect(() => {
    if (token && !user) {
      fetchUserProfile(); // Only fetch if token exists but no user in state
    } else {
      setLoading(false);
      setBackendStatus('online');
    }
  }, [token]);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      return response.ok;
    } catch {
      return false;
    }
  };

  const fetchUserProfile = async () => {
    try {
      setBackendStatus('checking');
      const isBackendOnline = await checkBackendStatus();

      if (!isBackendOnline) {
        setBackendStatus('offline');
        setLoading(false);
        return;
      }

      setBackendStatus('online');

      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else if (response.status === 401) {
        logout(); // Token expired
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setBackendStatus('offline');
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, authToken) => {
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(userData); // Directly set user → no need to call profile again
    setBackendStatus('online');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    backendStatus,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {backendStatus === 'offline' && (
        <div className="bg-red-500 text-white p-2 text-center">
          Backend server is offline. Please make sure the server is running on port 5000.
        </div>
      )}
      {!loading && children}
    </AuthContext.Provider>
  );
};
