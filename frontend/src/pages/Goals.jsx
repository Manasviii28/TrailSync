import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Target, Plus, Trash2, CheckCircle2, X } from 'lucide-react';

export const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [type, setType] = useState('weekly_distance');

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await API.get('/goals');
      if (res.data.success) {
        setGoals(res.data.goals);
      }
    } catch (err) {
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!title || !targetValue) return;

    try {
      await API.post('/goals', {
        title,
        targetValue: parseFloat(targetValue),
        type,
        unit: type === 'weekly_distance' ? 'km' : 'activities',
      });
      setShowModal(false);
      setTitle('');
      setTargetValue('');
      fetchGoals();
    } catch (err) {
      console.error('Failed to create goal:', err);
    }
  };

  const handleDeleteGoal = async (id) => {
    if (window.confirm('Are you sure you want to delete this fitness goal?')) {
      try {
        await API.delete(`/goals/${id}`);
        setGoals(goals.filter((g) => g._id !== id));
      } catch (err) {
        console.error('Failed to delete goal:', err);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc' }}>
            Personal Fitness Goals
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Set realistic weekly targets focused purely on self-improvement.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={20} />
          <span>New Goal</span>
        </button>
      </div>

      {/* Goal Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading goals...</div>
      ) : goals.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <Target size={48} color="#64748b" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.5rem' }}>
            No personal goals created yet.
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Define a weekly distance target (e.g., Walk 20 km) or workout count goal to stay motivated.
          </p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ margin: '0 auto' }}>
            <Plus size={20} />
            <span>Create Your First Goal</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2">
          {goals.map((g) => {
            const percent = Math.min(100, Math.round((g.currentValue / g.targetValue) * 100));
            return (
              <div key={g._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Target color={g.completed ? '#22c55e' : '#10b981'} size={20} />
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc' }}>
                        {g.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleDeleteGoal(g._id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', opacity: 0.8 }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#94a3b8' }}>Weekly Progress:</span>
                    <span style={{ fontWeight: '700', color: g.completed ? '#22c55e' : '#10b981' }}>
                      {g.currentValue} / {g.targetValue} {g.unit}
                    </span>
                  </div>

                  <div className="progress-bar-bg" style={{ marginBottom: '1rem' }}>
                    <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#94a3b8', paddingTop: '0.75rem', borderTop: '1px solid #334155' }}>
                  <span>{percent}% Completed</span>
                  {g.completed ? (
                    <span style={{ color: '#22c55e', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle2 size={14} /> Goal Reached!
                    </span>
                  ) : (
                    <span>{(g.targetValue - g.currentValue).toFixed(1)} {g.unit} remaining</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Goal Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc' }}>
                Set Personal Fitness Goal
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateGoal}>
              <div className="input-group">
                <label>Goal Title</label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. Walk 20 km this week"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Goal Category</label>
                <select className="input-control" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="weekly_distance">Weekly Distance Target (km)</option>
                  <option value="weekly_count">Weekly Workout Sessions Count</option>
                </select>
              </div>

              <div className="input-group">
                <label>Target Value ({type === 'weekly_distance' ? 'km' : 'workouts'})</label>
                <input
                  type="number"
                  step="0.5"
                  className="input-control"
                  placeholder="e.g. 20"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
