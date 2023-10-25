"use client"; // Error components must be Client Components

import { Emoji } from "@/components/Emoji";
import { Box, Button, Icon, Typography } from "@mui/material";
import { useEffect } from "react";
import { ErrorModal } from "../(auth)/auth/errorModal";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  const fix = () => {
    reset();
  };
  const clearCache = async () => {
    if ("serviceWorker" in navigator) {
      await caches.keys().then(function (cacheNames) {
        cacheNames.forEach(async function (cacheName) {
          await caches.delete(cacheName);
        });
      });
      window.location.reload();
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "100dvh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Emoji size={80} emoji="1f62c" />
        <Typography variant="h3" className="font-heading" sx={{ mt: 2 }}>
          Yikes! Something went wrong.
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Our team has been notified, and we&apos;re working on a fix.{" "}
        </Typography>
        <Box sx={{ gap: 2, display: "flex" }}>
          <ErrorModal error={error}>
            <Button variant="outlined">
              <Icon>terminal</Icon>
              Show debug information
            </Button>
          </ErrorModal>
          <Button onClick={clearCache} variant="outlined">
            <Icon>clear_all</Icon>
            Clear cache
          </Button>
          <Button onClick={fix} variant="contained">
            <Icon>refresh</Icon>
            Try again
          </Button>
        </Box>
      </Box>
    </>
  );
}
