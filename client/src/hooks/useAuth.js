import { useState, useEffect } from 'react';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await mockLogin(credentials);
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await mockRegister(userData);
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  };
}

// Mock functions - replace with actual API calls
async function mockLogin(credentials) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    user: {
      id: 1,
      name: 'John Doe',
      email: credentials.email,
    },
  };
}

async function mockRegister(userData) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    user: {
      id: 1,
      name: userData.name,
      email: userData.email,
    },
  };
}
