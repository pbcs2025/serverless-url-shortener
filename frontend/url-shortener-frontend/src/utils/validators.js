export const isValidURL = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (error) {
    return false;
  }
};

export const isValidCustomCode = (code) => {
  if (!code) return true;
  const pattern = /^[a-zA-Z0-9_-]{3,20}$/;
  return pattern.test(code.trim());
};