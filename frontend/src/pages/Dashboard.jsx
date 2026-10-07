import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  Activity as ActivityIcon,
  Flame,
  MapPin,
  Clock,
  PlayCircle,
  TrendingUp,
  Target,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const Dashboard = () => {
  const { user, profile } = useAuth();
  const [activities, setActivities] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [actRes, goalRes] = await Promise.all([
          API.get('/activities'),
          API.get('/goals'),
        ]);

        if (actRes.data.success) {
          setActivities(actRes.data.activities);
        }
        if (goalRes.data.success) {
          setGoals(goalRes.data.goals);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Today's stats calculation
  const todayStr = new Date().toDateString();
  const todayActivities = activities.filter(
    (a) => new Date(a.createdAt).toDateString() === todayStr
  );

  const todayDistance = todayActivities.reduce((acc, curr) => acc + (curr.distance || 0), 0);
  const todayDuration = todayActivities.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const todayCalories = todayActivities.reduce((acc, curr) => acc + (curr.calories || 0), 0);

  // Overall totals
  const totalActivitiesCount = activities.length;
  const totalDistanceKm = activities.reduce((acc, curr) => acc + (curr.distance || 0), 0);
  const totalCaloriesBurned = activities.reduce((acc, curr) => acc + (curr.calories || 0), 0);

  // Weekly progress chart generation (Mon to Sun)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const now = new Date();
  const currentDay = now.getDay();
  const distToMon = currentDay === 0 ? -6 : 1 - currentDay;

  const weeklyChartData = daysOfWeek.map((dayName, idx) => {
    const dayDate = new Date(now);
    dayDate.setDate(now.getDate() + distToMon + idx);
    const dateStr = dayDate.toDateString();

    const dayActs = activities.filter(
      (a) => new Date(a.createdAt).toDateString() === dateStr
    );
    const dayDist = dayActs.reduce((acc, curr) => acc + (curr.distance || 0), 0);

    return {
      day: dayName,
      distance: parseFloat(dayDist.toFixed(1)),
    };
  });

  const activeGoal = goals[0]; // Active primary goal

  const formatDuration = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}m ${remainingSecs}s`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner & Quick Start */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))',
          borderColor: 'rgba(16, 185, 129, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc' }}>
            Hello, {user?.name || 'Runner'}! 👋
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            {profile?.fitnessGoal ? `Current Goal: ${profile.fitnessGoal}` : 'Track your workouts and reach your daily target.'}
          </p>
        </div>
        <Link to="/track" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
          <PlayCircle size={22} />
          <span>Start Activity</span>
        </Link>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-4">
        {/* Today's Summary Card */}
        <div className="card" style={{ borderColor: 'rgba(16, 185, 129, 0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#10b981', textTransform: 'uppercase' }}>Today's Summary</span>
            <MapPin size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc' }}>
            {todayDistance.toFixed(2)} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>km</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
            <span>⏱️ {formatDuration(todayDuration)}</span>
            <span>🔥 {todayCalories} kcal</span>
          </div>
        </div>

        {/* Total Distance Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8' }}>Total Distance</span>
            <TrendingUp size={20} color="#06b6d4" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc' }}>
            {totalDistanceKm.toFixed(1)} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>km</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>Across all workouts</p>
        </div>

        {/* Total Workouts Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8' }}>Total Workouts</span>
            <ActivityIcon size={20} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc' }}>
            {totalActivitiesCount} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>sessions</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>Logged activities</p>
        </div>

        {/* Total Calories Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8' }}>Est. Calories</span>
            <Flame size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc' }}>
            {totalCaloriesBurned} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>kcal</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>Estimated energy</p>
        </div>
      </div>

      {/* Main Charts & Active Goal Grid */}
      <div className="grid grid-cols-3">
        {/* Weekly Progress Chart */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#f8fafc' }}>Weekly Progress</h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Distance (km) recorded Mon - Sun</p>
            </div>
            <div className="badge badge-cycling">This Week</div>
          </div>

          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                  formatter={(val) => [`${val} km`, 'Distance']}
                />
                <Bar dataKey="distance" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Current Active Goal Sidebar */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Target color="#10b981" size={22} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#f8fafc' }}>Weekly Fitness Goal</h3>
            </div>

            {activeGoal ? (
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#f8fafc', marginBottom: '0.5rem' }}>
                  {activeGoal.title}
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                  <span>Progress</span>
                  <span style={{ fontWeight: '700', color: '#10b981' }}>
                    {activeGoal.currentValue} / {activeGoal.targetValue} {activeGoal.unit}
                  </span>
                </div>
                <div className="progress-bar-bg" style={{ marginBottom: '1rem' }}>
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${Math.min(100, Math.round((activeGoal.currentValue / activeGoal.targetValue) * 100))}%`,
                    }}
                  />
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Keep going! Every kilometer brings you closer to your personal goal.
                </p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  No active goals set for this week yet.
                </p>
                <Link to="/goals" className="btn btn-outline" style={{ width: '100%', fontSize: '0.85rem' }}>
                  + Set Personal Goal
                </Link>
              </div>
            )}
          </div>

          <Link to="/goals" style={{ fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '1rem', fontWeight: '600' }}>
            View All Goals <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc' }}>Recent Activities</h3>
          <Link to="/history" style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            View All History <ArrowRight size={16} />
          </Link>
        </div>

        {activities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <ActivityIcon size={40} color="#64748b" style={{ margin: '0 auto 1rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#f8fafc', marginBottom: '0.25rem' }}>
              You haven't recorded any activities yet.
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Start your first session to view your speed, route, and progress metrics here.
            </p>
            <Link to="/track" className="btn btn-primary">
              <PlayCircle size={18} />
              <span>Start Your First Activity</span>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activities.slice(0, 5).map((act) => (
              <div
                key={act._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: '#0f172a',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className={`badge badge-${act.activityType.toLowerCase()}`} style={{ width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                    {act.activityType === 'Walking' ? '🚶' : act.activityType === 'Running' ? '🏃' : '🚴'}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#f8fafc', fontSize: '0.95rem' }}>
                      {act.activityType}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      {new Date(act.createdAt).toLocaleDateString()} at {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', textAlign: 'right' }}>
                  <div>
                    <div style={{ fontWeight: '700', color: '#10b981', fontSize: '1rem' }}>
                      {act.distance} km
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Distance</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#f8fafc', fontSize: '0.9rem' }}>
                      {formatDuration(act.duration)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Duration</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#f59e0b', fontSize: '0.9rem' }}>
                      {act.calories} kcal
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Calories</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
