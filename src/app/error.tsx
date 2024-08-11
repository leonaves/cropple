'use client'; // Error components must be Client Components

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div>
      {error.stack?.includes('NoPuzzleError') ? (
        <h2>No puzzle found for today 😢 {error.digest}</h2>
      ) : (
        <h2>Something went wrong!</h2>
      )}
    </div>
  );
}
