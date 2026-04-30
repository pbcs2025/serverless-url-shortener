import React from 'react';
import { formatDate, formatUnixTimestamp } from '../utils/formatters';
import './StatsCard.css';

export default function StatsCard({ stats }) {
  if (!stats) return null;

  const clickCount = stats.clickCount ?? stats.totalClicks ?? 0;
  const shortCode = stats.shortCode || stats.code || 'N/A';
  const shortURL = stats.shortURL || stats.shortUrl || '';
  const targetURL = stats.longURL || stats.originalURL || stats.targetURL || '';
  const createdAt = stats.createdAt || stats.created_at;
  const expiry = stats.expiryAt || stats.expiresAt || stats.expiryTimestamp;

  return (
    <section className="stats-card">
      <h3 className="stats-card__title">URL Analytics</h3>
      <div className="stats-card__grid">
        <p><strong>Short Code:</strong> {shortCode}</p>
        <p><strong>Clicks:</strong> {clickCount}</p>
        <p><strong>Created:</strong> {formatDate(createdAt)}</p>
        <p><strong>Expires:</strong> {formatUnixTimestamp(expiry)}</p>
      </div>
      {shortURL && (
        <p className="stats-card__line">
          <strong>Short URL:</strong> <a href={shortURL}>{shortURL}</a>
        </p>
      )}
      {targetURL && (
        <p className="stats-card__line" title={targetURL}>
          <strong>Destination:</strong> {targetURL}
        </p>
      )}
    </section>
  );
}
