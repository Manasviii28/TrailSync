import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Activity, MapPin, Trophy, Users, Save, CheckCircle } from 'lucide-react';

export const Profile = () => {
  const { user, profile: authProfile, fetchMe } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [avatar, setAvatar] = useState('');

  const fetchProfileDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get('/profile');
      if (res.data.success) {
        const p = res.data.profile;
        setProfileData(p);
        setName(p.name || '');
        setAge(p.age || 25);
        setHeight(p.height || 175);
        setWeight(p.weight || 70);
        setFitnessGoal(p.fitnessGoal || '');
        setAvatar(p.avatar || '');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileDetails();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    try {
      setUpdating(true);
      const res = await API.put('/profile', {
        name,
        age: Number(age),
        height: Number(height),
        weight: Number(weight),
        fitnessGoal,
        avatar,
      });

      if (res.data.success) {
        setSuccessMsg('Profile updated successfully!');
        await fetchMe();
        fetchProfileDetails();
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Error updating profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading profile...</div>;
  }

  const stats = profileData?.stats || {
    totalActivities: 0,
    totalDistance: 0,
    challengesJoined: 0,
    followers: 0,
    following: 0,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      {/* Top Header Card */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <img
          src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
          alt={name}
          style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #10b981' }}
        />
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc' }}>
            {name}
          </h1>
          <p style={{ color: '#10b981', fontWeight: '600', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            {fitnessGoal || 'Fitness Enthusiast'}
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Member since {new Date(user?.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-4">
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#10b981' }}>
            {stats.totalActivities}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>Total Activities</div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#06b6d4' }}>
            {stats.totalDistance} <span style={{ fontSize: '0.9rem' }}>km</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>Total Distance</div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f59e0b' }}>
            {stats.challengesJoined}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>Challenges Joined</div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#a855f7' }}>
            {stats.followers} <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>/ {stats.following}</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>Followers / Following</div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="card">
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1.5rem', color: '#f8fafc' }}>
          Edit Profile Information
        </h2>

        {successMsg && (
          <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={18} /> {successMsg}
          </div>
        )}

        <form onSubmit={handleUpdateProfile}>
          <div className="grid grid-cols-2">
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                className="input-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Age (years)</label>
              <input
                type="number"
                className="input-control"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Height (cm)</label>
              <input
                type="number"
                className="input-control"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Weight (kg) — used for calorie estimates</label>
              <input
                type="number"
                className="input-control"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Personal Fitness Goal Statement</label>
            <input
              type="text"
              className="input-control"
              placeholder="e.g. Build weekly endurance and walk 20 km"
              value={fitnessGoal}
              onChange={(e) => setFitnessGoal(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Profile Picture URL</label>
            <input
              type="url"
              className="input-control"
              placeholder="https://..."
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }} disabled={updating}>
            <Save size={18} />
            <span>{updating ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
