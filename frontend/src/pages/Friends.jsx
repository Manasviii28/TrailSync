import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Users, Search, UserPlus, UserCheck, MessageSquare } from 'lucide-react';

export const Friends = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const navigate = useNavigate();

  const fetchUsers = async (query = '') => {
    try {
      setLoading(true);
      const url = query ? `/users?search=${encodeURIComponent(query)}` : '/users';
      const res = await API.get(url);
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers(search);
  };

  const handleFollowToggle = async (userObj) => {
    try {
      setActionLoadingId(userObj._id);
      if (userObj.isFollowing) {
        await API.delete(`/users/${userObj._id}/follow`);
      } else {
        await API.post(`/users/${userObj._id}/follow`);
      }

      setUsers(
        users.map((u) => (u._id === userObj._id ? { ...u, isFollowing: !u.isFollowing } : u))
      );
    } catch (err) {
      console.error('Follow toggle error:', err);
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc' }}>
            Friends & Community
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Discover other TrailSync members, follow friends, and send encouragement.
          </p>
        </div>

        {/* Search input */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '360px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="input-control"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-secondary">
            Search
          </button>
        </form>
      </div>

      {/* Users Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading community users...</div>
      ) : users.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <Users size={48} color="#64748b" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.5rem' }}>
            No users found.
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Try searching for a different name or browse the entire list.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3">
          {users.map((u) => (
            <div key={u._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'center' }}>
              <div>
                <img
                  src={u.avatar}
                  alt={u.name}
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    margin: '0 auto 1rem',
                    border: '2px solid #10b981',
                  }}
                />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc' }}>
                  {u.name}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '0.2rem', marginBottom: '0.75rem', fontWeight: '500' }}>
                  {u.fitnessGoal}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
                <button
                  onClick={() => handleFollowToggle(u)}
                  className={`btn ${u.isFollowing ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}
                  disabled={actionLoadingId === u._id}
                >
                  {u.isFollowing ? (
                    <>
                      <UserCheck size={16} /> Following
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} /> Follow
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate(`/messages?user=${u._id}`)}
                  className="btn btn-outline"
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                  title="Send Message"
                >
                  <MessageSquare size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
