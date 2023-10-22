import { Puller } from "@/components/Puller";
import { Button, SwipeableDrawer, Typography } from "@mui/material";
import { cloneElement, useState } from "react";

export function ErrorModal({ error, children }) {
  const [open, setOpen] = useState(false);
  const styles = {
    textTransform: "uppercase",
    fontWeight: 900,
    fontSize: "13px",
    opacity: 0.6,
    mt: 2,
  };
  const trigger = cloneElement(children, { onClick: () => setOpen(true) });

  return (
    <>
      {trigger}
      <SwipeableDrawer
        open={open}
        onClose={() => setOpen(false)}
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
          onClick={() => setOpen(false)}
          variant="contained"
          sx={{ py: 2, mt: 2 }}
        >
          Close
        </Button>
      </SwipeableDrawer>
    </>
  );
}
