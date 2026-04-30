import React from 'react';
import { buildRedirectURL } from '../services/api';
import { formatUnixTimestamp, truncateURL } from '../utils/formatters';
import './ResultCard.css';

export default function ResultCard({ result }) {
  if (!result) return null;

  const shortCode = result.shortCode || result.code;
  const shortURL = result.shortURL || buildRedirectURL(shortCode);
  const longURL = result.longURL || result.originalURL || '';
  const expiry = result.expiryAt || result.expiresAt || result.expiryTimestamp || result.expirySeconds;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortURL);
    } catch (error) {
      // Clipboard may fail on insecure contexts, so fallback to opening link.
      window.open(shortURL, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="result-card">
      <h3 className="result-card__title">Short URL Created</h3>
      <p className="result-card__long-url" title={longURL}>
        {truncateURL(longURL, 90)}
      </p>
      <a href={shortURL} target="_blank" rel="noreferrer" className="result-card__short-url">
        {shortURL}
      </a>
      <p className="result-card__meta">
        <span>Code: {shortCode || 'N/A'}</span>
        <span>Expires: {formatUnixTimestamp(expiry)}</span>
      </p>
      <div className="result-card__actions">
        <button type="button" onClick={handleCopy} className="result-card__btn">
          Copy URL
        </button>
      </div>
    </section>
  );
}
