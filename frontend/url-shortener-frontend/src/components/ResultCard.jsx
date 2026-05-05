import React, { useMemo, useState } from 'react';
import { FiCheck, FiClipboard, FiExternalLink, FiBarChart2, FiLink2 } from 'react-icons/fi';
import { QRCodeCanvas } from 'qrcode.react';
import { Link } from 'react-router-dom';
import { buildRedirectURL } from '../services/api';
import { expiryLabel, truncateURL } from '../utils/formatters';
import './ResultCard.css';

export default function ResultCard({ result }) {
  const [copied, setCopied] = useState(false);

  const redirectURL = useMemo(() => {
    if (result?.shortURL) return result.shortURL;
    if (result?.shortCode) return buildRedirectURL(result.shortCode);
    return '';
  }, [result]);

  const showExpiry = useMemo(() => {
    if (result?.expiresAt) return 'Has expiry';
    if (result?.expirySeconds) return expiryLabel(Number(result.expirySeconds));
    return 'No expiry';
  }, [result]);

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

  return (
    <div className="result-card">
      <div className="result-card__top">
        <div className="result-card__title">
          <div className="result-card__title-icon">
            <FiLink2 />
          </div>
          Your short link
        </div>

        {result?.shortCode && (
          <Link className="result-card__stats-link" to={`/stats/${encodeURIComponent(result.shortCode)}`}>
            <FiBarChart2 size={15} />
            View stats
          </Link>
        )}
      </div>

      <div className="result-card__url-row">
        <div className="result-card__url" title={redirectURL || ''}>
          {redirectURL || '—'}
        </div>

        <button className="result-card__btn" type="button" onClick={copy} disabled={!redirectURL}>
          {copied ? <FiCheck size={16} /> : <FiClipboard size={16} />}
          {copied ? 'Copied' : 'Copy'}
        </button>

        <a
          className="result-card__btn result-card__btn--ghost"
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

      <div className="result-card__meta">
        <div className="result-card__meta-item">
          <div className="result-card__meta-label">Original</div>
          <div className="result-card__meta-value" title={result?.longURL || ''}>
            {truncateURL(result?.longURL || '', 72) || '—'}
          </div>
        </div>
        <div className="result-card__meta-item">
          <div className="result-card__meta-label">Expiry</div>
          <div className="result-card__meta-value">{showExpiry}</div>
        </div>
      </div>

      {redirectURL && (
        <div className="result-card__qr">
          <div className="result-card__qr-label">Scan QR</div>
          <div className="result-card__qr-box" aria-label="QR code">
            <QRCodeCanvas value={redirectURL} size={132} fgColor="#111827" bgColor="#ffffff" includeMargin />
          </div>
        </div>
      )}
    </div>
  );
}
