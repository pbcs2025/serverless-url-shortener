import React, { useEffect, useMemo, useState } from 'react';
import { FiGrid, FiLink, FiClock, FiRefreshCw, FiLogOut } from 'react-icons/fi';
import URLForm from '../components/URLForm';
import ResultCard from '../components/ResultCard';
import { listMyUrls } from '../services/api';
import { useAuth } from '../auth/AuthContext';

function TabButton({ active, icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        borderRadius: 999,
        padding: '10px 14px',
        background: active ? 'var(--bg-tag)' : 'transparent',
        border: `1px solid ${active ? 'rgba(79,70,229,0.25)' : 'var(--border-color)'}`,
        color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
        fontWeight: 800,
        transition: 'var(--transition-fast)',
      }}
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}

function HistoryTable({ items, loading, error, onRefresh }) {
  return (
    <div
      style={{
        marginTop: 12,
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 14px',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div style={{ fontWeight: 900, letterSpacing: '-0.01em' }}>Your history</div>
        <button
          onClick={onRefresh}
          type="button"
          style={{
            display: 'inline-flex',
            gap: 8,
            alignItems: 'center',
            borderRadius: 12,
            padding: '8px 10px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            fontWeight: 800,
          }}
        >
          <FiRefreshCw />
          Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 14, color: 'var(--text-secondary)' }}>Loading…</div>
      ) : error ? (
        <div style={{ padding: 14, color: 'var(--accent-danger)' }}>{error}</div>
      ) : items.length === 0 ? (
        <div style={{ padding: 14, color: 'var(--text-secondary)' }}>
          No saved links yet. Create one in the "Shorten" tab.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                <th style={{ textAlign: 'left', padding: 12, fontSize: 12, color: 'var(--text-muted)' }}>Short</th>
                <th style={{ textAlign: 'left', padding: 12, fontSize: 12, color: 'var(--text-muted)' }}>Long URL</th>
                <th style={{ textAlign: 'left', padding: 12, fontSize: 12, color: 'var(--text-muted)' }}>Created</th>
                <th style={{ textAlign: 'left', padding: 12, fontSize: 12, color: 'var(--text-muted)' }}>Clicks</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.shortCode} style={{ borderTop: '1px solid var(--border-color)' }}>
                  <td style={{ padding: 12, fontWeight: 900 }}>
                    <a href={it.shortUrl ?? it.shortURL} target="_blank" rel="noreferrer">
                      {it.shortCode}
                    </a>
                  </td>
                  <td style={{ padding: 12, color: 'var(--text-secondary)', maxWidth: 520 }}>
                    <a
                      href={it.longURL ?? it.originalUrl ?? it.originalURL ?? '#'}
                      target="_blank"
                      rel="noreferrer"
                      style={{ wordBreak: 'break-word' }}
                    >
                      {it.longURL ?? it.originalUrl ?? it.originalURL ?? '—'}
                    </a>
                  </td>
                  <td style={{ padding: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {it.createdAt ? new Date(it.createdAt).toLocaleString() : '—'}
                  </td>
                  <td style={{ padding: 12, color: 'var(--text-secondary)' }}>
                    {it.clicks ?? it.clickCount ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user, signOut, token } = useAuth();

  // Debug: Log user object to see what's available
  console.log('Dashboard user object:', user);
  console.log('Dashboard token:', token);

  // Helper to get display name
  const getDisplayName = () => {
    // First try user.name
    if (user?.name) return user.name;
    
    // Then try user.email
    if (user?.email) return user.email;
    
    // Try to decode JWT token to get email
    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          if (payload.email) return payload.email;
        }
      } catch (e) {
        console.error('Failed to decode token:', e);
      }
    }
    
    return 'user';
  };

  const [tab, setTab] = useState('shorten');
  const [result, setResult] = useState(null);

  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    setHistoryLoading(true);
    setHistoryError('');
    try {
      const data = await listMyUrls();
      const items = data.items ?? data.Items ?? data.urls ?? [];
      setHistory(Array.isArray(items) ? items : []);
    } catch (err) {
      setHistoryError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Failed to load your history.'
      );
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 'history') loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const normalized = useMemo(() => {
    if (!result) return null;
    const shortCode = result.shortCode ?? result.shortcode ?? result.code ?? result.id ?? null;
    const shortURL = result.shortURL ?? result.shortUrl ?? result.short_url ?? result.url ?? null;
    const longURL =
      result.longURL ?? result.longUrl ?? result.long_url ?? result.originalURL ?? result.originalUrl ?? null;
    return {
      shortCode,
      shortURL,
      longURL,
      createdAt: result.createdAt ?? result.created_at ?? result.timestamp ?? null,
      expiresAt: result.expiresAt ?? result.expires_at ?? null,
      expirySeconds: result.expirySeconds ?? null,
    };
  }, [result]);

  return (
    <section className="container container--wide animate-fade-in" style={{ padding: '26px 0 42px' }}>
      <header style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
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
              <FiGrid />
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em' }}>Dashboard</div>
              <div style={{ marginTop: 4, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Signed in as <span style={{ fontWeight: 900 }}>{getDisplayName()}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={signOut}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              borderRadius: 12,
              padding: '10px 12px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              fontWeight: 900,
            }}
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <TabButton
          active={tab === 'shorten'}
          onClick={() => setTab('shorten')}
          icon={<FiLink />}
          label="Shorten"
        />
        <TabButton
          active={tab === 'history'}
          onClick={() => setTab('history')}
          icon={<FiClock />}
          label="History"
        />
      </div>

      {tab === 'shorten' ? (
        <div style={{ marginTop: 12 }}>
          <URLForm onResult={setResult} />
          {normalized && (
            <div style={{ marginTop: 18 }}>
              <ResultCard result={normalized} />
            </div>
          )}
        </div>
      ) : (
        <HistoryTable
          items={history}
          loading={historyLoading}
          error={historyError}
          onRefresh={loadHistory}
        />
      )}
    </section>
  );
}