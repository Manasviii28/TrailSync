import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Trophy, CheckCircle, Footprints, Flame, Bike, Activity, ShieldCheck } from 'lucide-react';

export const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const res = await API.get('/challenges');
      if (res.data.success) {
        setChallenges(res.data.challenges);
      }
    } catch (err) {
      console.error('Error fetching challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleJoin = async (id) => {
    try {
      setJoiningId(id);
      await API.post(`/challenges/${id}/join`);
      fetchChallenges();
    } catch (err) {
      console.error('Failed to join challenge:', err);
      alert(err.response?.data?.message || 'Failed to join challenge');
    } finally {
      setJoiningId(null);
    }
  };

  const handleLeave = async (id) => {
    if (window.confirm('Are you sure you want to leave this challenge? Your current progress will be reset.')) {
      try {
        setJoiningId(id);
        await API.delete(`/challenges/${id}/leave`);
        fetchChallenges();
      } catch (err) {
        console.error('Failed to leave challenge:', err);
      } finally {
        setJoiningId(null);
      }
    }
  };

  const getChallengeIcon = (type) => {
    switch (type) {
      case 'Walking': return <Footprints color="#3b82f6" size={24} />;
      case 'Running': return <Flame color="#ef4444" size={24} />;
      case 'Cycling': return <Bike color="#10b981" size={24} />;
      default: return <Trophy color="#f59e0b" size={24} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc' }}>
          Fitness Challenges
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Join community wellness challenges designed for habit building and personal milestones.
        </p>
      </div>

      <div className="card" style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)', borderColor: 'rgba(6, 182, 212, 0.3)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <ShieldCheck color="#06b6d4" size={24} />
        <span style={{ fontSize: '0.875rem', color: '#67e8f9' }}>
          TrailSync challenges focus strictly on individual targets — zero leaderboards or public ranking tables!
        </span>
      </div>

      {/* Challenges Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading challenges...</div>
      ) : (
        <div className="grid grid-cols-2">
          {challenges.map((ch) => {
            const percent = Math.min(100, Math.round((ch.progress / ch.targetValue) * 100));
            return (
              <div key={ch._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ backgroundColor: '#0f172a', padding: '0.6rem', borderRadius: '10px', border: '1px solid #334155' }}>
                        {getChallengeIcon(ch.activityType)}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#f8fafc' }}>
                          {ch.title}
                        </h3>
                        <span className="badge badge-cycling" style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>
                          {ch.durationDays} Days Duration
                        </span>
                      </div>
                    </div>
                  </div>

                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                    {ch.description}
                  </p>

                  {ch.isJoined && (
                    <div style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem', border: '1px solid #334155' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                        <span style={{ color: '#94a3b8' }}>Your Progress:</span>
                        <span style={{ fontWeight: '700', color: ch.completed ? '#22c55e' : '#10b981' }}>
                          {ch.progress} / {ch.targetValue} {ch.type === 'distance' ? 'km' : 'workouts'}
                        </span>
                      </div>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ paddingTop: '1rem', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    Target: <strong>{ch.targetValue} {ch.type === 'distance' ? 'km' : 'workouts'}</strong> ({ch.activityType})
                  </span>

                  {ch.isJoined ? (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {ch.completed ? (
                        <span style={{ color: '#22c55e', fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <CheckCircle size={16} /> Completed
                        </span>
                      ) : (
                        <button
                          onClick={() => handleLeave(ch._id)}
                          className="btn btn-danger"
                          style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                          disabled={joiningId === ch._id}
                        >
                          Leave
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleJoin(ch._id)}
                      className="btn btn-primary"
                      style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                      disabled={joiningId === ch._id}
                    >
                      {joiningId === ch._id ? 'Joining...' : 'Join Challenge'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
