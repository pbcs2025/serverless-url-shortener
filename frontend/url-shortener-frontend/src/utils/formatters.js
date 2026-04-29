// Format ISO date string to a readable format
export const formatDate = (isoString) => {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format Unix timestamp (seconds) to readable date
export const formatUnixTimestamp = (unixTs) => {
  if (!unixTs || unixTs === 'No expiry') return 'Never';
  const date = new Date(parseInt(unixTs, 10) * 1000);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Truncate long URLs for display
export const truncateURL = (url, maxLen = 55) => {
  if (!url) return '';
  return url.length > maxLen ? url.slice(0, maxLen) + '…' : url;
};

// Expiry seconds to human-readable label
export const expiryLabel = (seconds) => {
  if (!seconds) return 'No expiry';
  const hours = seconds / 3600;
  if (hours < 24) return `${hours}h`;
  const days = hours / 24;
  return `${days}d`;
};