import axios from 'axios';

// Reads from .env — REACT_APP_API_URL must be set
const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
  console.error('[SwiftLink] REACT_APP_API_URL is not set in your .env file!');
}

// ── Shorten a long URL ──────────────────────────────────────────
// POST /shorten
// Body: { longURL, customCode?, expirySeconds? }
export const shortenURL = async (longURL, customCode = '', expirySeconds = null) => {
  const payload = { longURL };
  if (customCode && customCode.trim()) payload.customCode = customCode.trim();
  if (expirySeconds) payload.expirySeconds = parseInt(expirySeconds, 10);

  const res = await axios.post(`${API_URL}/shorten`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
};

// ── Get analytics stats for a short code ───────────────────────
// GET /stats/{shortCode}
export const getStats = async (shortCode) => {
  const res = await axios.get(`${API_URL}/stats/${shortCode}`);
  return res.data;
};

// ── Build the redirect URL (for display purposes) ───────────────
// The actual redirect endpoint is GET /{shortCode} — handled by API Gateway
export const buildRedirectURL = (shortCode) => {
  return `${API_URL}/${shortCode}`;
};