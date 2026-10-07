import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '3rem auto', width: '100%' }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <LogIn color="#10b981" size={26} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#f8fafc' }}>Welcome Back</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Sign in to continue your fitness journey
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                className="input-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                className="input-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#10b981', fontWeight: '600' }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
