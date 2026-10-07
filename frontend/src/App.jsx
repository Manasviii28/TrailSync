import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Import Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { TrackActivity } from './pages/TrackActivity';
import { ActivityHistory } from './pages/ActivityHistory';
import { Goals } from './pages/Goals';
import { Challenges } from './pages/Challenges';
import { Friends } from './pages/Friends';
import { Messages } from './pages/Messages';
import { Profile } from './pages/Profile';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Public Unauthenticated Routes */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* Authenticated Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="track" element={<TrackActivity />} />
              <Route path="history" element={<ActivityHistory />} />
              <Route path="goals" element={<Goals />} />
              <Route path="challenges" element={<Challenges />} />
              <Route path="friends" element={<Friends />} />
              <Route path="messages" element={<Messages />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
