import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      setLoading(true);
      const res = await API.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        setProfile(res.data.profile);
      }
    } catch (err) {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    if (res.data.success) {
      setUser(res.data.user);
      await fetchMe();
    }
    return res.data;
  };

  const register = async (name, email, password, confirmPassword) => {
    const res = await API.post('/auth/register', { name, email, password, confirmPassword });
    if (res.data.success) {
      setUser(res.data.user);
      await fetchMe();
    }
    return res.data;
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setProfile(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        logout,
        fetchMe,
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
