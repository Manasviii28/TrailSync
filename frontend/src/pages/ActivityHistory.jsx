import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import {
  History,
  Filter,
  Trash2,
  Eye,
  PlayCircle,
  Clock,
  MapPin,
  Flame,
  X,
} from 'lucide-react';

export const ActivityHistory = () => {
  const [activities, setActivities] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const fetchActivities = async (type = 'All') => {
    try {
      setLoading(true);
      const url = type === 'All' ? '/activities' : `/activities?type=${type}`;
      const res = await API.get(url);
      if (res.data.success) {
        setActivities(res.data.activities);
      }
    } catch (err) {
      console.error('Error fetching activity history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities(filterType);
  }, [filterType]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this activity record?')) {
      try {
        await API.delete(`/activities/${id}`);
        setActivities(activities.filter((a) => a._id !== id));
        if (selectedActivity?._id === id) {
          setSelectedActivity(null);
        }
      } catch (err) {
        console.error('Failed to delete activity:', err);
      }
    }
  };

  const formatDuration = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}m ${remainingSecs}s`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header & Filter Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc' }}>
            Activity History
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Review past workouts, personal records, and distance metrics.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#1e293b', padding: '0.35rem', borderRadius: '10px', border: '1px solid #334155' }}>
          <Filter size={16} color="#94a3b8" style={{ marginLeft: '0.5rem' }} />
          {['All', 'Walking', 'Running', 'Cycling'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: filterType === type ? '#10b981' : 'transparent',
                color: filterType === type ? '#042f2e' : '#94a3b8',
                fontWeight: '600',
                fontSize: '0.85rem',
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading activities...</div>
      ) : activities.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <History size={48} color="#64748b" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.5rem' }}>
            You haven't recorded any activities yet.
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
            {filterType !== 'All'
              ? `No ${filterType} activities logged in your history.`
              : 'Record your first workout using live GPS or manual distance input.'}
          </p>
          <Link to="/track" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
            <PlayCircle size={20} />
            <span>Start Your First Activity</span>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {activities.map((act) => (
            <div
              key={act._id}
              className="card"
              onClick={() => setSelectedActivity(act)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div
                  className={`badge badge-${act.activityType.toLowerCase()}`}
                  style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}
                >
                  {act.activityType === 'Walking' ? '🚶' : act.activityType === 'Running' ? '🏃' : '🚴'}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: '700', color: '#f8fafc', fontSize: '1.05rem' }}>
                      {act.activityType}
                    </span>
                    {act.isManual && <span className="badge badge-walking" style={{ fontSize: '0.65rem' }}>Manual</span>}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    {new Date(act.createdAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#10b981' }}>
                    {act.distance} km
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Distance</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#f8fafc' }}>
                    {formatDuration(act.duration)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Duration</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#f59e0b' }}>
                    {act.calories} kcal
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Calories</div>
                </div>

                <button
                  onClick={(e) => handleDelete(act._id, e)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', padding: '0.5rem', borderRadius: '6px' }}
                  title="Delete Activity"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div className="modal-backdrop" onClick={() => setSelectedActivity(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.6rem' }}>
                  {selectedActivity.activityType === 'Walking' ? '🚶' : selectedActivity.activityType === 'Running' ? '🏃' : '🚴'}
                </span>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc' }}>
                    {selectedActivity.activityType} Details
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {new Date(selectedActivity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedActivity(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8' }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ backgroundColor: '#0f172a', padding: '1.25rem', borderRadius: '12px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Total Distance:</span>
                <span style={{ fontWeight: '700', color: '#10b981' }}>{selectedActivity.distance} km</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Duration:</span>
                <span style={{ fontWeight: '700', color: '#f8fafc' }}>{formatDuration(selectedActivity.duration)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Average Pace:</span>
                <span style={{ fontWeight: '700', color: '#f8fafc' }}>{selectedActivity.pace} min/km</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Calories Burned:</span>
                <span style={{ fontWeight: '700', color: '#f59e0b' }}>{selectedActivity.calories} kcal</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Tracking Mode:</span>
                <span style={{ fontWeight: '600', color: '#06b6d4' }}>{selectedActivity.isManual ? 'Manual Entry' : 'GPS Coordinates'}</span>
              </div>
            </div>

            <button onClick={() => setSelectedActivity(null)} className="btn btn-secondary" style={{ width: '100%' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
