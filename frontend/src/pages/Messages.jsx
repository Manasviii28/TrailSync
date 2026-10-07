import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Send, User, Clock, Search } from 'lucide-react';

export const Messages = () => {
  const { user: currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const targetUserIdFromUrl = searchParams.get('user');

  const [conversations, setConversations] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await API.get('/messages/conversations');
      if (res.data.success) {
        setConversations(res.data.conversations);

        // If target user specified in URL params, set active
        if (targetUserIdFromUrl) {
          const existing = res.data.conversations.find((c) => c.user._id === targetUserIdFromUrl);
          if (existing) {
            setSelectedPartner(existing.user);
          } else {
            // Fetch target user info directly
            const uRes = await API.get(`/users/${targetUserIdFromUrl}`);
            if (uRes.data.success) {
              const uData = uRes.data.user;
              setSelectedPartner({
                _id: uData._id,
                name: uData.name,
                email: uData.email,
                avatar: uData.profile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
              });
            }
          }
        } else if (res.data.conversations.length > 0 && !selectedPartner) {
          setSelectedPartner(res.data.conversations[0].user);
        }
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchThread = async (partnerId) => {
    try {
      const res = await API.get(`/messages/${partnerId}`);
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error('Error fetching message thread:', err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [targetUserIdFromUrl]);

  useEffect(() => {
    if (selectedPartner) {
      fetchThread(selectedPartner._id);
    }
  }, [selectedPartner]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedPartner) return;

    try {
      setSending(true);
      const res = await API.post(`/messages/${selectedPartner._id}`, { content: newMessage });
      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.message]);
        setNewMessage('');
        fetchConversations();
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Error sending message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc' }}>
          Messages
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          Direct 1-on-1 conversations with your fitness friends.
        </p>
      </div>

      {/* Main Messaging Interface */}
      <div
        className="card"
        style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          padding: 0,
          minHeight: '520px',
          overflow: 'hidden',
        }}
      >
        {/* Left Conversation List */}
        <div style={{ borderRight: '1px solid #334155', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #334155', fontWeight: '700', color: '#f8fafc' }}>
            Conversations
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            {conversations.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                No active conversations yet. Visit the Friends page to start a chat!
              </div>
            ) : (
              conversations.map((conv) => {
                const isSelected = selectedPartner?._id === conv.user._id;
                return (
                  <div
                    key={conv.user._id}
                    onClick={() => setSelectedPartner(conv.user)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.85rem 1rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid #1e293b',
                      backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                    }}
                  >
                    <img
                      src={conv.user.avatar}
                      alt={conv.user.name}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontWeight: '600', color: '#f8fafc', fontSize: '0.9rem' }}>
                        {conv.user.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {conv.lastMessage?.content}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Active Chat Window */}
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#1e293b' }}>
          {selectedPartner ? (
            <>
              {/* Partner Header */}
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#0f172a' }}>
                <img
                  src={selectedPartner.avatar}
                  alt={selectedPartner.name}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: '700', color: '#f8fafc', fontSize: '1rem' }}>
                    {selectedPartner.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#10b981' }}>Active Member</div>
                </div>
              </div>

              {/* Messages Thread Container */}
              <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', margin: 'auto', color: '#94a3b8', fontSize: '0.9rem' }}>
                    Say hello to start the conversation with {selectedPartner.name}!
                  </div>
                ) : (
                  messages.map((m) => {
                    const isSelf = m.senderId === currentUser._id;
                    return (
                      <div
                        key={m._id}
                        style={{
                          alignSelf: isSelf ? 'flex-end' : 'flex-start',
                          maxWidth: '70%',
                        }}
                      >
                        <div
                          style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '12px',
                            backgroundColor: isSelf ? '#10b981' : '#0f172a',
                            color: isSelf ? '#042f2e' : '#f8fafc',
                            fontWeight: isSelf ? '600' : '400',
                            fontSize: '0.925rem',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                          }}
                        >
                          {m.content}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.25rem', textAlign: isSelf ? 'right' : 'left' }}>
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} style={{ padding: '1rem', borderTop: '1px solid #334155', display: 'flex', gap: '0.75rem', backgroundColor: '#0f172a' }}>
                <input
                  type="text"
                  className="input-control"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.25rem' }} disabled={sending}>
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
              <MessageSquare size={48} color="#64748b" style={{ marginBottom: '1rem' }} />
              <p style={{ fontSize: '1rem' }}>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
