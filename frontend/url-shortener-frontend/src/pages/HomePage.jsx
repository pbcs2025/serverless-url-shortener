import React, { useState } from 'react';
import ResultCard from '../components/ResultCard';
import URLForm from '../components/URLForm';

export default function HomePage() {
  const [result, setResult] = useState(null);

  return (
    <section className="container" style={{ paddingTop: '28px', paddingBottom: '40px' }}>
      <URLForm onResult={setResult} />
      <ResultCard result={result} />
    </section>
  );
}
