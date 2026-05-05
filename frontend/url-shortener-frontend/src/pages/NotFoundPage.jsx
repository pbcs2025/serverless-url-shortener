import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';

export default function NotFoundPage() {
  return (
    <section className="container animate-fade-in" style={{ padding: '34px 0 52px' }}>
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 18,
          padding: 20,
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'rgba(217,119,6,0.12)',
              color: 'var(--accent-warning)',
              display: 'grid',
              placeItems: 'center',
              border: '1px solid rgba(217,119,6,0.25)',
            }}
          >
            <FiAlertTriangle />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>Page not found</div>
            <div style={{ marginTop: 4, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              The page you’re looking for doesn’t exist.
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--gradient-btn)',
              color: 'var(--text-inverse)',
              padding: '10px 14px',
              borderRadius: 12,
              fontWeight: 800,
            }}
          >
            Go back home
          </Link>
        </div>
      </div>
    </section>
  );
}

