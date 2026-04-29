// URL validation — must start with http:// or https://
export const isValidURL = (url) => {
  if (!url || typeof url !== 'string') return false;
  const pattern = /^https?:\/\/.+\..+/;
  return pattern.test(url.trim());
};

// Short code validation — alphanumeric only, 3-20 chars
export const isValidCustomCode = (code) => {
  if (!code) return true; // empty is fine (optional)
  const pattern = /^[a-zA-Z0-9_-]{3,20}$/;
  return pattern.test(code.trim());
};