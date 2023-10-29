import { ErrorModal } from "@/app/(auth)/auth/errorModal";
import { Emoji } from "@/components/Emoji";
import { Box, Button, Icon, Typography } from "@mui/material";
import { useEffect } from "react";

export default function ErrorPage({
  heading = "Yikes! Something went wrong.",
  subheading = "Our team has been notified, and we're working on a fix.",
  error,
  reset,
}: {
  heading?: string;
  subheading?: string;
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
          {heading}
        </Typography>
        <Typography sx={{ mb: 2 }}>{subheading}</Typography>
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
