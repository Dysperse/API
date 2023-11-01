"use client"; // Error components must be Client Components

import ErrorPage from "@/components/Error/page";
import { useEffect, useState } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  const openDebug = () => setShowAdvanced(true);

  return (
    <>
      <ErrorPage reset={reset} error={error} />
    </>
  );
}
