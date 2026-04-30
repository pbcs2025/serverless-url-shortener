import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="container" style={{ paddingTop: '50px', paddingBottom: '40px' }}>
      <h1 style={{ marginBottom: '10px' }}>404 - Page not found</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
        The page you requested does not exist.
      </p>
      <Link to="/">Go back home</Link>
    </section>
  );
}
