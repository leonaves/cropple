'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { NoPuzzleError } from '@/lib/errors';
import { type } from 'node:os';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div>
      {error.stack?.includes('NoPuzzleError') ? (
        <h2>No puzzle found for today 😢</h2>
      ) : (
        <h2>Something went wrong!</h2>
      )}
    </div>
  );
}
