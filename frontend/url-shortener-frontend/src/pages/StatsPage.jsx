import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import { getStats } from '../services/api';

export default function StatsPage() {
  const navigate = useNavigate();
  const { shortCode: codeFromRoute } = useParams();
  const [shortCode, setShortCode] = useState(codeFromRoute || '');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedCode = shortCode.trim();
    if (!normalizedCode) {
      setError('Enter a short code first.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await getStats(normalizedCode);
      setStats(response);
      navigate(`/stats/${normalizedCode}`, { replace: true });
    } catch (err) {
      setStats(null);
      setError(err.response?.data?.message || 'Could not fetch stats for this short code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container" style={{ paddingTop: '28px', paddingBottom: '40px' }}>
      <form onSubmit={handleSubmit} className="url-form">
        <div className="url-form__title">Lookup URL analytics</div>
        <div className="url-form__main-row">
          <input
            type="text"
            value={shortCode}
            onChange={(event) => {
              setShortCode(event.target.value);
              if (error) setError('');
            }}
            placeholder="Enter short code (example: abc123)"
            className={`url-form__input${error ? ' url-form__input--error' : ''}`}
          />
          <button type="submit" className="url-form__submit-btn" disabled={loading}>
            {loading ? 'Loading...' : 'Get Stats'}
          </button>
        </div>
        {error && <p className="url-form__error">{error}</p>}
      </form>

      <StatsCard stats={stats} />
    </section>
  );
}
