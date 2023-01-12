import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { colors } from "../lib/colors";

export function ConfirmationModal({
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

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        PaperProps={{
          sx: {
            width: "400px",
            maxWidth: "calc(100vw - 20px)",
            p: 1.5,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "800" }}>
          {title}
          <DialogContentText id="alert-dialog-slide-description" sx={{ mt: 1 }}>
            {question}
          </DialogContentText>
        </DialogTitle>
        <DialogActions>
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderRadius: 99,
              px: 2.5,
              py: 1,
              ...(global.user.darkMode && {
                borderColor: "hsl(240,11%,20%) !important",
                color: "hsl(240,11%,95%) !important",
              }),
            }}
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            size="large"
            sx={{
              background:
                (global.user.darkMode
                  ? "hsl(240,11%,18%)"
                  : colors[themeColor][900]) + "!important",
              borderRadius: 99,
              px: 2.5,
              py: 1,
              color: global.user.darkMode
                ? "hsl(240,11%,95%)"
                : colors[themeColor][50],
              border: "2px solid transparent",
            }}
            loading={loading}
            onClick={async () => {
              try {
                setLoading(true);
                await callback();
                setLoading(false);
                setOpen(false);
              } catch (e: any) {
                setLoading(false);
                toast.error("An error occured: " + e.message);
              }
            }}
          >
            {buttonText}
          </LoadingButton>
        </DialogActions>
      </Dialog>
      {trigger}
    </>
  );
}
