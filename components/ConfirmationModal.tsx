import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useStatusBar } from "../hooks/useStatusBar";
import { toastStyles } from "../lib/useCustomTheme";

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
    onClick: () => setOpen(true),
  });

  const handleClick = async () => {
    try {
      setLoading(true);
      await callback();
      setLoading(false);
      setOpen(false);
    } catch (e: any) {
      setLoading(false);
      toast.error(`An error occured: ${e.message}`, toastStyles);
    }
  };

  useEffect(() => {
    if (open && disabled) {
      handleClick();
    }
  }, [open, disabled]);

  useStatusBar(open, 1);

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
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
            onClick={() => {
              setOpen(false);
            }}
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
