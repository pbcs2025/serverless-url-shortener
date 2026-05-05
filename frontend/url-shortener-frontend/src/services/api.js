import axios from 'axios';
import { getStoredToken } from '../auth/authStorage';

// Reads from .env — REACT_APP_API_URL must be set
const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
  console.error('[SwiftLink] REACT_APP_API_URL is not set in your .env file!');
}

const client = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

function withAuthHeaders(token) {
  const t = token ?? getStoredToken();
  if (!t) return {};
  return { Authorization: `Bearer ${t}` };
}

// ── Shorten a long URL ──────────────────────────────────────────
// POST /shorten
// Body: { longURL, customCode?, expirySeconds? }
export const shortenURL = async (longURL, customCode = '', expirySeconds = null) => {
  const payload = { longURL };
  if (customCode && customCode.trim()) payload.customCode = customCode.trim();
  if (expirySeconds) payload.expirySeconds = parseInt(expirySeconds, 10);

  // If user is logged in, we attach Authorization so backend can store "createdBy"
  const res = await client.post(`/shorten`, payload, {
    headers: { ...withAuthHeaders() },
  });
  return res.data;
};

// ── Get analytics stats for a short code ───────────────────────
// GET /stats/{shortCode}
export const getStats = async (shortCode) => {
  const res = await client.get(`/stats/${shortCode}`);
  return res.data;
};

// ── Auth ───────────────────────────────────────────────────────
// POST /auth/signup  Body: { name, email, password }
export const signup = async (name, email, password) => {
  const res = await client.post(`/auth/signup`, { name, email, password });
  return res.data;
};

// POST /auth/login  Body: { email, password }
export const login = async (email, password) => {
  const res = await client.post(`/auth/login`, { email, password });
  return res.data;
};

// ── User Dashboard APIs ────────────────────────────────────────
// GET /me/urls  (Authorization: Bearer <token>)
export const listMyUrls = async () => {
  const res = await client.get(`/me/urls`, { headers: { ...withAuthHeaders() } });
  return res.data;
};

// ── Build the redirect URL (for display purposes) ───────────────
// The actual redirect endpoint is GET /{shortCode} — handled by API Gateway
export const buildRedirectURL = (shortCode) => {
  return `${API_URL}/${shortCode}`;
};