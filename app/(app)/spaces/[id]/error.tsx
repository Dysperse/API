"use client";

import ErrorPage from "@/components/Error/page";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorPage error={error} reset={reset} heading="Couldn't load group" />
  );
}
