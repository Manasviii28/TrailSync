import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeolocation } from '../hooks/useGeolocation';
import API from '../services/api';
import {
  Play,
  Pause,
  Square,
  MapPin,
  Clock,
  Flame,
  Activity as ActivityIcon,
  AlertTriangle,
  CheckCircle,
  Save,
} from 'lucide-react';

export const TrackActivity = () => {
  const [activityType, setActivityType] = useState('Walking');
  const [seconds, setSeconds] = useState(0);
  const [manualDistance, setManualDistance] = useState('');
  const [isManualMode, setIsManualMode] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    isTracking,
    isPaused,
    distance,
    setDistance,
    routePoints,
    error: gpsError,
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
  } = useGeolocation();

  const navigate = useNavigate();

  // Timer interval effect
  useEffect(() => {
    let timer = null;
    if (isTracking && !isPaused) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isTracking, isPaused]);

  const handleStart = () => {
    setSeconds(0);
    if (isManualMode) {
      // In manual mode, we just start the timer
    } else {
      startTracking();
    }
  };

  const handleStop = () => {
    if (!isManualMode) {
      stopTracking();
    }
    setShowSummaryModal(true);
  };

  // Calculate Pace (min/km)
  const currentDistance = isManualMode ? parseFloat(manualDistance) || 0 : distance;
  const pace = currentDistance > 0 ? parseFloat(((seconds / 60) / currentDistance).toFixed(2)) : 0;

  // Calorie calculation estimation
  const metValues = { Walking: 3.5, Running: 8.0, Cycling: 6.0 };
  const met = metValues[activityType] || 3.5;
  const estimatedCalories = Math.round(met * 70 * (seconds / 3600));

  const formatTimer = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return hrs > 0 ? `${pad(hrs)}:${pad(mins)}:${pad(secs)}` : `${pad(mins)}:${pad(secs)}`;
  };

  const handleSaveActivity = async () => {
    try {
      setSaving(true);
      const activityData = {
        activityType,
        duration: seconds,
        distance: currentDistance,
        pace,
        calories: estimatedCalories,
        routePoints: isManualMode ? [] : routePoints,
        isManual: isManualMode,
      };

      await API.post('/activities', activityData);
      setShowSummaryModal(false);
      navigate('/history');
    } catch (err) {
      console.error('Failed to save activity:', err);
      alert('Error saving activity. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
      <div className="card">
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '1.5rem', textAlign: 'center', color: '#f8fafc' }}>
          Activity Tracker
        </h2>

        {/* Activity Type Selection Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
          {[
            { id: 'Walking', icon: '🚶', label: 'Walking' },
            { id: 'Running', icon: '🏃', label: 'Running' },
            { id: 'Cycling', icon: '🚴', label: 'Cycling' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => !isTracking && setActivityType(type.id)}
              disabled={isTracking}
              style={{
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid',
                borderColor: activityType === type.id ? '#10b981' : '#334155',
                backgroundColor: activityType === type.id ? 'rgba(16, 185, 129, 0.15)' : '#0f172a',
                color: activityType === type.id ? '#10b981' : '#94a3b8',
                fontWeight: '700',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <span>{type.icon}</span>
              <span>{type.label}</span>
            </button>
          ))}
        </div>

        {/* GPS Error & Manual Fallback Banner */}
        {gpsError && (
          <div className="alert alert-info" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle color="#06b6d4" size={24} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', color: '#67e8f9' }}>GPS Status Notice</div>
              <div style={{ fontSize: '0.85rem' }}>{gpsError}</div>
            </div>
            <button
              onClick={() => setIsManualMode(!isManualMode)}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
            >
              {isManualMode ? 'Try GPS Mode' : 'Use Manual Entry'}
            </button>
          </div>
        )}

        {/* Mode Toggle Switch */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <button
            onClick={() => !isTracking && setIsManualMode(!isManualMode)}
            disabled={isTracking}
            style={{
              background: 'none',
              border: 'none',
              color: isManualMode ? '#06b6d4' : '#94a3b8',
              fontSize: '0.85rem',
              textDecoration: 'underline',
              cursor: isTracking ? 'not-allowed' : 'pointer',
            }}
          >
            Switch to {isManualMode ? 'GPS Live Tracking' : 'Manual Distance Entry'} Mode
          </button>
        </div>

        {/* Live Metrics Display Screen */}
        <div
          style={{
            backgroundColor: '#0f172a',
            borderRadius: '16px',
            padding: '2.5rem 1.5rem',
            border: '2px solid #334155',
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          <div style={{ fontSize: '0.9rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
            Duration
          </div>
          <div style={{ fontSize: '3.5rem', fontWeight: '800', fontFamily: 'monospace', color: '#10b981', lineHeight: 1 }}>
            {formatTimer(seconds)}
          </div>

          <div className="grid grid-cols-3" style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #1e293b' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Distance</div>
              {isManualMode ? (
                <input
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  className="input-control"
                  style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: '700', padding: '0.4rem', marginTop: '0.25rem' }}
                  value={manualDistance}
                  onChange={(e) => setManualDistance(e.target.value)}
                  disabled={!isTracking}
                />
              ) : (
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f8fafc' }}>
                  {distance.toFixed(2)} <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>km</span>
                </div>
              )}
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Pace</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f8fafc' }}>
                {pace} <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>min/km</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Est. Calories</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f59e0b' }}>
                {estimatedCalories} <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>kcal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {!isTracking ? (
            <button onClick={handleStart} className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
              <Play size={22} />
              <span>Start Activity</span>
            </button>
          ) : (
            <>
              {isPaused ? (
                <button onClick={resumeTracking} className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                  <Play size={20} />
                  <span>Resume</span>
                </button>
              ) : (
                <button onClick={pauseTracking} className="btn btn-secondary" style={{ padding: '1rem 2rem' }}>
                  <Pause size={20} />
                  <span>Pause</span>
                </button>
              )}
              <button onClick={handleStop} className="btn btn-danger" style={{ padding: '1rem 2rem' }}>
                <Square size={20} />
                <span>Stop & Save</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Summary Modal */}
      {showSummaryModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <CheckCircle color="#10b981" size={48} style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f8fafc' }}>
                Activity Complete!
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                Great job completing your {activityType} session.
              </p>
            </div>

            <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                <span style={{ color: '#94a3b8' }}>Activity Type:</span>
                <span style={{ fontWeight: '700', color: '#10b981' }}>{activityType}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                <span style={{ color: '#94a3b8' }}>Duration:</span>
                <span style={{ fontWeight: '700', color: '#f8fafc' }}>{formatTimer(seconds)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                <span style={{ color: '#94a3b8' }}>Total Distance:</span>
                <span style={{ fontWeight: '700', color: '#f8fafc' }}>{currentDistance.toFixed(2)} km</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                <span style={{ color: '#94a3b8' }}>Average Pace:</span>
                <span style={{ fontWeight: '700', color: '#f8fafc' }}>{pace} min/km</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: '#94a3b8' }}>Estimated Calories:</span>
                <span style={{ fontWeight: '700', color: '#f59e0b' }}>{estimatedCalories} kcal</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.75rem', fontStyle: 'italic' }}>
                * Calories are estimated based on standard MET energy rates ({met} MET) for prototype reference.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setShowSummaryModal(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
                disabled={saving}
              >
                Discard
              </button>
              <button
                onClick={handleSaveActivity}
                className="btn btn-primary"
                style={{ flex: 2 }}
                disabled={saving}
              >
                <Save size={18} />
                <span>{saving ? 'Saving...' : 'Save Activity'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
