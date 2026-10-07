import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Compass, Target, Users, ShieldCheck, ArrowRight } from 'lucide-react';

export const Home = () => {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', padding: '2rem 0' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <div className="badge badge-cycling" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
          Fitness & Self-Improvement Platform
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1.15, color: '#f8fafc' }}>
          Track. Improve. <span style={{ color: '#10b981' }}>Connect.</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8', lineHeight: 1.6 }}>
          TrailSync helps you monitor your activities, build healthy habits, and track your personal progress — free from competitive leaderboards.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {user ? (
            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
              Go to Dashboard <ArrowRight size={20} />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
                Get Started Free <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div>
        <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: '700', marginBottom: '2rem', color: '#f8fafc' }}>
          Key Platform Features
        </h2>
        <div className="grid grid-cols-4">
          <div className="card">
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Activity color="#10b981" size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '600', marginBottom: '0.5rem', color: '#f8fafc' }}>
              Track Activities
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Real-time GPS tracking for walking, running, and cycling with speed, duration, and route logging.
            </p>
          </div>

          <div className="card">
            <div style={{ backgroundColor: 'rgba(6, 182, 212, 0.15)', width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Compass color="#06b6d4" size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '600', marginBottom: '0.5rem', color: '#f8fafc' }}>
              Monitor Progress
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Visual weekly charts, daily activity summaries, and calorie burn estimates tailored to your body.
            </p>
          </div>

          <div className="card">
            <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Target color="#3b82f6" size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '600', marginBottom: '0.5rem', color: '#f8fafc' }}>
              Set Personal Goals
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Define weekly distance and workout targets. Focused purely on self-improvement with no leaderboards.
            </p>
          </div>

          <div className="card">
            <div style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)', width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Users color="#a855f7" size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '600', marginBottom: '0.5rem', color: '#f8fafc' }}>
              Connect With Friends
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Follow fellow fitness enthusiasts, join wellness challenges, and send direct 1-on-1 messages.
            </p>
          </div>
        </div>
      </div>

      {/* Philosophy Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))', borderColor: 'rgba(16, 185, 129, 0.3)', padding: '2.5rem', textAlign: 'center' }}>
        <ShieldCheck color="#10b981" size={40} style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#f8fafc' }}>
          Personal Improvement First
        </h3>
        <p style={{ maxWidth: '650px', margin: '0 auto', color: '#94a3b8', fontSize: '1rem' }}>
          TrailSync eliminates toxic competition by replacing public leaderboards with individual goal tracking and supportive friend connections.
        </p>
      </div>
    </div>
  );
};
