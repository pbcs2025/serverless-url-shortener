import axios from 'axios';

const API_URL =
  process.env.REACT_APP_API_URL ||
  'https://05rndb0vge.execute-api.ap-south-1.amazonaws.com/prod';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Shorten a long URL ──────────────────────────────────────────
// POST /shorten
// Body: { longURL, customCode?, expirySeconds? }
export const shortenURL = async (longURL, customCode = '', expirySeconds = null) => {
  const payload = { longURL };
  if (customCode && customCode.trim()) payload.customCode = customCode.trim();
  if (expirySeconds) payload.expirySeconds = parseInt(expirySeconds, 10);

  const res = await apiClient.post('/shorten', payload);
  return res.data;
};

// ── Get analytics stats for a short code ───────────────────────
// GET /stats/{shortCode}
export const getStats = async (shortCode) => {
  const res = await apiClient.get(`/stats/${shortCode}`);
  return res.data;
};

// ── Build the redirect URL (for display purposes) ───────────────
// The actual redirect endpoint is GET /{shortCode} — handled by API Gateway
export const buildRedirectURL = (shortCode) => {
  return `${API_URL}/${shortCode}`;
};