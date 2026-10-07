import React from 'react';
import { Activity } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#0f172a', borderTop: '1px solid #334155', padding: '2rem 1rem', marginTop: 'auto', textAlign: 'center' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity color="#10b981" size={20} />
          <span style={{ fontWeight: '700', color: '#f8fafc' }}>TrailSync</span>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
          Track. Improve. Connect. — Empowering personal fitness & daily wellness habit tracking.
        </p>
        <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
          TrailSync &copy; {new Date().getFullYear()} College Software Engineering Project. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
