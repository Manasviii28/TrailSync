import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: '#10b981' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #334155', borderTop: '4px solid #10b981', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: '#94a3b8' }}>Loading TrailSync...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
