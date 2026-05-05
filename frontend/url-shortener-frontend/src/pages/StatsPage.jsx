import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiBarChart2, FiSearch, FiAlertCircle } from 'react-icons/fi';
import StatsCard from '../components/StatsCard';
import { getStats } from '../services/api';
import { isValidCustomCode } from '../utils/validators';

export default function StatsPage() {
  const { shortCode: shortCodeParam } = useParams();
  const navigate = useNavigate();

  const [shortCode, setShortCode] = useState(shortCodeParam || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setShortCode(shortCodeParam || '');
  }, [shortCodeParam]);

  useEffect(() => {
    const run = async () => {
      if (!shortCodeParam) return;
      if (!isValidCustomCode(shortCodeParam)) {
        setError('Enter a valid short code (3–20 characters: letters, numbers, - or _).');
        setStats(null);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const data = await getStats(shortCodeParam);
        setStats(data);
      } catch (err) {
        const msg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          (err.response?.status === 404
            ? 'No stats found for this short code.'
            : 'Failed to fetch stats. Please try again.');
        setError(msg);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [shortCodeParam]);

  const normalized = useMemo(() => {
    if (!stats) return null;
    const body = stats?.Item ?? stats?.item ?? stats;

    return {
      shortCode:
        body.shortCode ?? body.shortcode ?? body.code ?? shortCodeParam ?? null,
      longURL:
        body.longURL ?? body.longUrl ?? body.long_url ?? body.originalURL ?? body.originalUrl ?? null,
      clicks:
        body.clicks ?? body.clickCount ?? body.click_count ?? body.hits ?? body.visits ?? 0,
      createdAt: body.createdAt ?? body.created_at ?? body.created ?? null,
      lastAccessedAt:
        body.lastAccessedAt ?? body.last_accessed_at ?? body.lastAccessed ?? body.lastHitAt ?? null,
      expiresAt: body.expiresAt ?? body.expires_at ?? null,
    };
  }, [stats, shortCodeParam]);

  const onLookup = (e) => {
    e.preventDefault();
    setError('');
    setStats(null);

    const trimmed = shortCode.trim();
    if (!trimmed) {
      setError('Enter a short code to look up.');
      return;
    }
    if (!isValidCustomCode(trimmed)) {
      setError('Enter a valid short code (3–20 characters: letters, numbers, - or _).');
      return;
    }

    navigate(`/stats/${encodeURIComponent(trimmed)}`);
  };

  return (
    <section className="container container--wide animate-fade-in" style={{ padding: '26px 0 42px' }}>
      <header style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'var(--gradient-accent)',
              color: 'var(--text-inverse)',
              display: 'grid',
              placeItems: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <FiBarChart2 />
          </div>
          <div>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>Analytics</div>
            <div style={{ marginTop: 2, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              View click count and metadata for a short code.
            </div>
          </div>
        </div>
      </header>

      <form
        onSubmit={onLookup}
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'stretch',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 16,
          padding: 12,
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
          <FiSearch style={{ color: 'var(--text-muted)' }} />
          <input
            value={shortCode}
            onChange={(e) => setShortCode(e.target.value)}
            placeholder="Enter short code (e.g. my-link)"
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              color: 'var(--text-primary)',
              fontSize: 15,
              padding: '10px 0',
              outline: 'none',
            }}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            minWidth: 130,
            borderRadius: 12,
            padding: '10px 14px',
            background: 'var(--gradient-btn)',
            color: 'var(--text-inverse)',
            fontWeight: 700,
            transition: 'var(--transition-fast)',
            opacity: loading ? 0.85 : 1,
          }}
        >
          {loading ? 'Loading…' : 'Lookup'}
        </button>
      </form>

      {error && (
        <div
          style={{
            marginTop: 12,
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

      {normalized && (
        <div style={{ marginTop: 16 }}>
          <StatsCard stats={normalized} />
        </div>
      )}
    </section>
  );
}
