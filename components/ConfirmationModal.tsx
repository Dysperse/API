import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { LoadingButton } from "@mui/lab";
import { Box, Button, SwipeableDrawer, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
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
}: {
  disabled?: boolean;
  title: string;
  question?: string;
  children: JSX.Element;
  callback: any;
  buttonText?: string;
}) {
  const { session } = useSession();
  const isDark = useDarkMode(session?.darkMode || "system");

  const palette = useColor(session?.themeColor || "violet", isDark);

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const trigger = React.cloneElement(children, {
    onClick: (e) => {
      e.stopPropagation();
      if (disabled) {
        callback();
      } else {
        setOpen(true);
      }
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

  return (
    <>
      {trigger}
      {!disabled && (
        <SwipeableDrawer
          disableSwipeToOpen
          open={open}
          anchor="bottom"
          onClose={() => setOpen(false)}
          onClick={(e) => e.stopPropagation()}
          sx={{
            zIndex: 9999999,
          }}
          PaperProps={{
            sx: {
              userSelect: "none",
              width: { xs: "100%", sm: "350px" },
              maxWidth: "calc(100vw - 30px)",
              borderRadius: 5,
              mx: { xs: "15px", sm: "auto" },
              mb: "15px",
              border: `2px solid ${palette[4]}`,
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
      )}
    </>
  );
}
