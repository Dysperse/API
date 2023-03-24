import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { toastStyles } from "../lib/client/useTheme";

export function ConfirmationModal({
  disabled = false,
  title,
  question,
  children,
  callback,
  buttonText = "Continue",
}: any) {
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

  useEffect(() => {
    if (open && disabled) {
      handleClick();
    }
  }, [open, disabled, handleClick]);

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        onClick={(e) => e.stopPropagation()}
        sx={{
          zIndex: 9999,
        }}
        PaperProps={{
          sx: {
            userSelect: "none",
            width: "400px",
            maxWidth: "calc(100vw - 20px)",
            p: 1.5,
          },
        }}
      >
        <DialogTitle className="font-[800]">
          {title}
          <DialogContentText
            id="alert-dialog-slide-description"
            className="mt-1.5"
          >
            {question}
          </DialogContentText>
        </DialogTitle>
        <DialogActions>
          <Button
            variant="outlined"
            size="large"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            size="large"
            loading={loading}
            onClick={handleClick}
          >
            {buttonText}
          </LoadingButton>
        </DialogActions>
      </Dialog>
      {trigger}
    </>
  );
}
