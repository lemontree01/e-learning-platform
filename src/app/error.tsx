'use client';

import { ErrorPage } from '~/screens/ErrorPage';

export default function RouteError ({ reset, }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorPage onRetry={reset} />;
}
