import { LoadingButton } from "@mui/lab";
import { Box, Button, SwipeableDrawer, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import { useSession } from "../lib/client/useSession";
import { toastStyles } from "../lib/client/useTheme";
import { Puller } from "./Puller";

export function ConfirmationModal({
  rawStyles = false,
  disabled = false,
  title,
  question,
  children,
  callback,
  buttonText = "Continue",
}: any) {
  const session = useSession();

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const trigger = React.cloneElement(children, {
    onClick: (e) => {
      e.stopPropagation();
      setOpen(true);
    },
  });

  const handleClick: any = useCallback(async () => {
    try {
      setLoading(true);
      await callback();
      setLoading(false);
      setOpen(false);
    } catch (e: any) {
      setLoading(false);
      toast.error(`An error occured: ${e.message}`, toastStyles);
    }
  }, [callback]);

  useHotkeys("enter", () => {
    if (open) {
      handleClick();
    }
  });

  useEffect(() => {
    if (open && disabled) {
      handleClick();
    }
  }, [open, disabled, handleClick]);

  return (
    <>
      {trigger}
      <SwipeableDrawer
        open={open}
        anchor="bottom"
        disableSwipeToOpen
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        ModalProps={{ keepMounted: false }}
        onClick={(e) => e.stopPropagation()}
        sx={{ zIndex: 9999999 }}
        PaperProps={{
          sx: {
            ...(rawStyles && {
              boxShadow: "none",
              borderRadius: 5,
              mb: 2,
            }),
            mx: "auto",
            border: "none",
            userSelect: "none",
            width: "350px",
            maxWidth: "calc(100vw - 20px)",
          },
        }}
      >
        <Puller showOnDesktop />
        <Box sx={{ px: 3, pb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography color="text.secondary">{question}</Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              onClick={() => setOpen(false)}
              sx={{
                ...(rawStyles && {
                  borderRadius: 9,
                  textTransform: "none",
                  boxShadow: "none",
                }),
              }}
            >
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              fullWidth
              size="large"
              loading={loading}
              onClick={handleClick}
              sx={{
                ...(rawStyles && {
                  borderRadius: 9,
                  textTransform: "none",
                  boxShadow: "none",
                  background: "#000!important",
                }),
              }}
            >
              {buttonText}
            </LoadingButton>
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
