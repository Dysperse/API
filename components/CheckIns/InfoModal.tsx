import { Alert, Dialog, Icon, IconButton, Typography } from "@mui/material";
import { useCallback, useState } from "react";

export function InfoModal() {
  const [open, setOpen] = useState<boolean>(false);
  const handleClose = useCallback(() => setOpen(false), []);
  const handleOpen = useCallback(() => setOpen(true), []);

  return (
    <>
      <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { p: 3 } }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Mental health
        </Typography>
        <Alert severity="info" sx={{ mb: 1 }}>
          Dysperse mental health is a tool to help track your mood over time
        </Alert>
        <Alert severity="info" sx={{ mb: 1 }}>
          Your mood is only visible to you, meaning that other members in your
          group won&apos;t be able to see how you&apos;re feeling
        </Alert>
        <Alert severity="warning" sx={{ mb: 1 }}>
          Mood data is only stared for 1 year
        </Alert>
      </Dialog>
      <IconButton onClick={handleOpen}>
        <Icon className="outlined">info</Icon>
      </IconButton>
    </>
  );
}
