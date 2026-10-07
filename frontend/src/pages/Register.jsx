import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password confirmation does not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password, confirmPassword);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account. Email may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '2rem auto', width: '100%' }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <UserPlus color="#10b981" size={26} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#f8fafc' }}>Create TrailSync Account</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Start tracking your activities & fitness goals
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="input-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

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
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                className="input-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#10b981', fontWeight: '600' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
