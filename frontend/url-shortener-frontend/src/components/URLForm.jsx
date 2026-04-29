import React, { useState } from 'react';
import { FiLink, FiZap, FiSliders, FiChevronDown, FiChevronUp, FiAlertCircle } from 'react-icons/fi';
import { shortenURL } from '../services/api';
import { isValidURL, isValidCustomCode } from '../utils/validators';
import './URLForm.css';

export default function URLForm({ onResult }) {
  const [longURL, setLongURL] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [expirySeconds, setExpirySeconds] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const [loading, setLoading] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [apiError, setApiError] = useState('');

  const validateAndSubmit = async (e) => {
    e.preventDefault();
    setUrlError('');
    setCodeError('');
    setApiError('');

    // Validate URL
    if (!longURL.trim()) {
      setUrlError('Please enter a URL to shorten.');
      return;
    }
    if (!isValidURL(longURL)) {
      setUrlError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    // Validate custom code
    if (customCode && !isValidCustomCode(customCode)) {
      setCodeError('Custom code must be 3–20 characters (letters, numbers, - or _)');
      return;
    }

    setLoading(true);
    try {
      const data = await shortenURL(longURL, customCode, expirySeconds || null);
      onResult({ ...data, longURL, expirySeconds });
      setLongURL('');
      setCustomCode('');
      setExpirySeconds('');
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Something went wrong. Check your connection and try again.';

      if (err.response?.status === 409) {
        setCodeError('That custom code is already taken. Try a different one.');
      } else {
        setApiError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="url-form" onSubmit={validateAndSubmit} noValidate>
      <div className="url-form__title">Paste your long URL</div>

      {/* Main URL input row */}
      <div className="url-form__main-row">
        <div className="url-form__input-wrap">
          <FiLink className="url-form__input-icon" />
          <input
            type="url"
            className={`url-form__input${urlError ? ' url-form__input--error' : ''}`}
            placeholder="https://example.com/very/long/url?with=params"
            value={longURL}
            onChange={(e) => {
              setLongURL(e.target.value);
              if (urlError) setUrlError('');
              if (apiError) setApiError('');
            }}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <button type="submit" className="url-form__submit-btn" disabled={loading}>
          {loading ? (
            <>
              <span className="btn-spinner" />
              Shortening…
            </>
          ) : (
            <>
              <FiZap size={15} />
              Shorten
            </>
          )}
        </button>
      </div>

      {/* URL Error */}
      {urlError && (
        <div className="url-form__error">
          <FiAlertCircle size={14} />
          {urlError}
        </div>
      )}

      {/* API Error */}
      {apiError && (
        <div className="url-form__error">
          <FiAlertCircle size={14} />
          {apiError}
        </div>
      )}

      {/* Toggle advanced options */}
      <div className="url-form__toggle">
        <button
          type="button"
          className={`url-form__toggle-btn${showOptions ? ' url-form__toggle-btn--active' : ''}`}
          onClick={() => setShowOptions((v) => !v)}
        >
          <FiSliders size={13} />
          Advanced Options
          {showOptions ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
        </button>
      </div>

      {/* Advanced options */}
      {showOptions && (
        <div className="url-form__options">
          <div className="url-form__field">
            <label className="url-form__label">Custom Alias</label>
            <input
              type="text"
              className={`url-form__option-input${codeError ? ' url-form__option-input--error' : ''}`}
              placeholder="e.g. my-link"
              value={customCode}
              onChange={(e) => {
                setCustomCode(e.target.value);
                if (codeError) setCodeError('');
              }}
              maxLength={20}
            />
            {codeError && <span className="url-form__field-error">{codeError}</span>}
          </div>

          <div className="url-form__field">
            <label className="url-form__label">Expiry</label>
            <select
              className="url-form__select"
              value={expirySeconds}
              onChange={(e) => setExpirySeconds(e.target.value)}
            >
              <option value="">Never</option>
              <option value="3600">1 hour</option>
              <option value="21600">6 hours</option>
              <option value="86400">1 day</option>
              <option value="604800">7 days</option>
              <option value="2592000">30 days</option>
            </select>
          </div>
        </div>
      )}
    </form>
  );
}