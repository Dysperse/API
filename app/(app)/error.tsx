"use client"; // Error components must be Client Components

import { Emoji } from "@/components/Emoji";
import { Puller } from "@/components/Puller";
import { Box, Button, Icon, SwipeableDrawer, Typography } from "@mui/material";
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

  const styles = {
    textTransform: "uppercase",
    fontWeight: 900,
    fontSize: "13px",
    opacity: 0.6,
    mt: 2,
  };

  return (
    <>
      <SwipeableDrawer
        open={showAdvanced}
        onClose={() => setShowAdvanced(false)}
        anchor="bottom"
        PaperProps={{
          sx: {
            width: "100vw",
            maxWidth: "100vw",
            p: 3,
          },
        }}
      >
        <Puller showOnDesktop />
        <Typography variant="h5">{error.name}</Typography>
        <Typography sx={styles}>Message</Typography>
        <Typography>{error.message}</Typography>
        <Typography sx={styles}>Call stack</Typography>
        <Typography>{error.stack}</Typography>
        <Typography sx={styles}>Cause</Typography>
        <Typography>
          Cause: {JSON.stringify(error.cause) || typeof error.cause}
        </Typography>
        <Button
          onClick={() => setShowAdvanced(false)}
          variant="contained"
          sx={{ py: 2, mt: 2 }}
        >
          Close
        </Button>
      </SwipeableDrawer>
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
          <Button onClick={openDebug} variant="outlined">
            <Icon>terminal</Icon>
            Show debug information
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
