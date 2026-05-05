import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUserPlus, FiUser, FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../auth/AuthContext';

export default function SignupPage() {
  const { signUp, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signUp({ name, email, password });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Signup failed. Please try again.'
      );
    }
  };

  return (
    <section className="container animate-fade-in" style={{ padding: '28px 0 44px' }}>
      <div
        style={{
          maxWidth: 560,
          margin: '0 auto',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 18,
          padding: 18,
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'var(--gradient-accent)',
              color: 'var(--text-inverse)',
              display: 'grid',
              placeItems: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <FiUserPlus />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em' }}>Create your account</div>
            <div style={{ marginTop: 4, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Sign up to save links and view your history.
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} style={{ marginTop: 16, display: 'grid', gap: 12 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
              <FiUser />
              Name
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              type="text"
              required
              autoComplete="name"
              style={{
                width: '100%',
                borderRadius: 12,
                padding: '12px 12px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
              <FiMail />
              Email
            </div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
              required
              autoComplete="email"
              style={{
                width: '100%',
                borderRadius: 12,
                padding: '12px 12px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
              <FiLock />
              Password
            </div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              style={{
                width: '100%',
                borderRadius: 12,
                padding: '12px 12px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </label>

          {error && (
            <div
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                color: 'var(--accent-danger)',
                background: 'rgba(220,38,38,0.08)',
                border: '1px solid rgba(220,38,38,0.25)',
                padding: '10px 12px',
                borderRadius: 12,
              }}
            >
              <FiAlertCircle size={16} />
              <div style={{ lineHeight: 1.35 }}>{error}</div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4,
              borderRadius: 12,
              padding: '12px 14px',
              background: 'var(--gradient-btn)',
              color: 'var(--text-inverse)',
              fontWeight: 900,
              letterSpacing: '-0.01em',
              opacity: loading ? 0.85 : 1,
            }}
          >
            {loading ? 'Creating…' : 'Sign up'}
          </button>
        </form>

        <div style={{ marginTop: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Already have an account? <Link to="/login">Login</Link>.
        </div>
      </div>
    </section>
  );
}

