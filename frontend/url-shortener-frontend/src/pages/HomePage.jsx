import React, { useMemo, useState } from 'react';
import URLForm from '../components/URLForm';
import ResultCard from '../components/ResultCard';

export default function HomePage() {
  const [result, setResult] = useState(null);

  const normalized = useMemo(() => {
    if (!result) return null;

    const shortCode =
      result.shortCode ?? result.shortcode ?? result.code ?? result.id ?? null;

    const shortURL =
      result.shortURL ??
      result.shortUrl ??
      result.short_url ??
      result.url ??
      null;

    const longURL =
      result.longURL ?? result.longUrl ?? result.long_url ?? result.originalURL ?? result.originalUrl ?? null;

    return {
      shortCode,
      shortURL,
      longURL,
      createdAt: result.createdAt ?? result.created_at ?? result.timestamp ?? null,
      expiresAt: result.expiresAt ?? result.expires_at ?? null,
      expirySeconds: result.expirySeconds ?? null,
    };
  }, [result]);

  return (
    <section className="container animate-fade-in" style={{ padding: '26px 0 42px' }}>
      <header style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Short links. Fast.
        </div>
        <div style={{ marginTop: 10, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
          Create a short URL backed by your AWS serverless stack. Optionally set a custom alias and expiry.
        </div>
      </header>

      <URLForm onResult={setResult} />

      {normalized && (
        <div style={{ marginTop: 18 }}>
          <ResultCard result={normalized} />
        </div>
      )}
    </section>
  );
}
