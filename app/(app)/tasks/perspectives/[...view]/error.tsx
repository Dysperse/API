"use client"; // Error components must be Client Components

import { ErrorModal } from "@/app/(auth)/auth/errorModal";
import { Emoji } from "@/components/Emoji";
import { Box, Button, Icon, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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

  const fix = () => {
    try {
      reset();
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong. Please try again later");
    }
  };

  const openDebug = () => setShowAdvanced(true);

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
          <Button onClick={fix} variant="contained">
            <Icon>refresh</Icon>
            Try again
          </Button>
        </Box>
      </Box>
    </>
  );
}
