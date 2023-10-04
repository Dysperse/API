import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  SwipeableDrawer,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import { Puller } from "./Puller";

export function ConfirmationModal({
  disabled = false,
  title,
  question,
  children,
  callback,
  buttonText = "Continue",
}: any) {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);

  const palette = useColor(session.themeColor, isDark);

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

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
      toast.error(`An error occured: ${e.message}`);
    }
  }, [callback]);

  useHotkeys("enter", () => {
    if (open) handleClick();
  });

  useEffect(() => {
    if (open && disabled) handleClick();
  }, [open, disabled, handleClick]);

  return (
    <>
      {trigger}
      <SwipeableDrawer
        disableSwipeToOpen
        open={open}
        anchor="bottom"
        onClose={() => setOpen(false)}
        onClick={(e) => e.stopPropagation()}
        sx={{
          zIndex: 9999999,
          ...(disabled && {
            display: "none!important",
            visibility: "hidden!important",
          }),
        }}
        PaperProps={{
          sx: {
            userSelect: "none",
            width: "350px",
            maxWidth: "calc(100vw - 20px)",
            borderRadius: 5,
            mx: { xs: "10px", sm: "auto" },
            border: `2px solid ${palette[3]}`,
          },
        }}
      >
        <Puller showOnDesktop />
        <Box sx={{ px: 3, pt: 0, pb: 3 }}>
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
            >
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              fullWidth
              size="large"
              loading={loading}
              onClick={handleClick}
            >
              {buttonText}
            </LoadingButton>
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
