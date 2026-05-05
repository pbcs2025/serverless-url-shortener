import React, { useMemo, useState } from 'react';
import { FiClock, FiExternalLink, FiLink2, FiMousePointer, FiCopy, FiCheck } from 'react-icons/fi';
import { buildRedirectURL } from '../services/api';
import { formatDate, formatUnixTimestamp, truncateURL } from '../utils/formatters';
import './StatsCard.css';

export default function StatsCard({ stats }) {
  const [copied, setCopied] = useState(false);

  const redirectURL = useMemo(() => {
    if (!stats?.shortCode) return '';
    return buildRedirectURL(stats.shortCode);
  }, [stats]);

  const copy = async () => {
    if (!redirectURL) return;
    try {
      await navigator.clipboard.writeText(redirectURL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  const createdLabel = useMemo(() => {
    // Accept ISO string or unix seconds
    if (!stats?.createdAt) return 'N/A';
    if (typeof stats.createdAt === 'number') return formatUnixTimestamp(stats.createdAt);
    if (/^\d+$/.test(String(stats.createdAt))) return formatUnixTimestamp(stats.createdAt);
    return formatDate(stats.createdAt);
  }, [stats]);

  const lastAccessedLabel = useMemo(() => {
    if (!stats?.lastAccessedAt) return 'N/A';
    if (typeof stats.lastAccessedAt === 'number') return formatUnixTimestamp(stats.lastAccessedAt);
    if (/^\d+$/.test(String(stats.lastAccessedAt))) return formatUnixTimestamp(stats.lastAccessedAt);
    return formatDate(stats.lastAccessedAt);
  }, [stats]);

  const expiryLabel = useMemo(() => {
    if (!stats?.expiresAt) return 'Never';
    if (typeof stats.expiresAt === 'number') return formatUnixTimestamp(stats.expiresAt);
    if (/^\d+$/.test(String(stats.expiresAt))) return formatUnixTimestamp(stats.expiresAt);
    return formatDate(stats.expiresAt);
  }, [stats]);

  return (
    <div className="stats-card">
      <div className="stats-card__header">
        <div className="stats-card__title">
          <div className="stats-card__title-icon">
            <FiLink2 />
          </div>
          Stats for <span className="stats-card__code">{stats?.shortCode || '—'}</span>
        </div>

        <div className="stats-card__actions">
          <button className="stats-card__btn" type="button" onClick={copy} disabled={!redirectURL}>
            {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
            {copied ? 'Copied' : 'Copy link'}
          </button>
          <a
            className="stats-card__btn stats-card__btn--ghost"
            href={redirectURL || undefined}
            target="_blank"
            rel="noreferrer"
            aria-disabled={!redirectURL}
            onClick={(e) => {
              if (!redirectURL) e.preventDefault();
            }}
          >
            <FiExternalLink size={16} />
            Open
          </a>
        </div>
      </div>

      <div className="stats-card__grid">
        <div className="stats-card__metric">
          <div className="stats-card__metric-top">
            <FiMousePointer />
            Clicks
          </div>
          <div className="stats-card__metric-value">{Number(stats?.clicks ?? 0)}</div>
        </div>

        <div className="stats-card__metric">
          <div className="stats-card__metric-top">
            <FiClock />
            Created
          </div>
          <div className="stats-card__metric-value stats-card__metric-value--small">{createdLabel}</div>
        </div>

        <div className="stats-card__metric">
          <div className="stats-card__metric-top">
            <FiClock />
            Last accessed
          </div>
          <div className="stats-card__metric-value stats-card__metric-value--small">{lastAccessedLabel}</div>
        </div>

        <div className="stats-card__metric">
          <div className="stats-card__metric-top">
            <FiClock />
            Expires
          </div>
          <div className="stats-card__metric-value stats-card__metric-value--small">{expiryLabel}</div>
        </div>
      </div>

      <div className="stats-card__details">
        <div className="stats-card__details-label">Original URL</div>
        <div className="stats-card__details-value" title={stats?.longURL || ''}>
          {truncateURL(stats?.longURL || '', 120) || '—'}
        </div>
      </div>
    </div>
  );
}
