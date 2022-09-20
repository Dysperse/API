import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import QRCode from "react-qr-code";

/**
 * Description
 * @param {any} {item}
 * @returns {any}
 */
export function QrCodeModal({ item }: any): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const href = `https://${window.location.hostname}/share/${encodeURIComponent(
    JSON.stringify({
      name: global.user.name,
      title: item.title,
      quantity: item.quantity,
      room: item.room,
    })
  )}`;

  /**
   * Description
   * @returns {any}
   */
  const handleClickOpen = () => {
    setOpen(true);
  };

  /**
   * Closes the popup
   * @returns void
   */
  const handleClose = () => {
    setOpen(false);
  };

  /**
   * Description
   * @param {any} event
   * @returns {any}
   */
  const stopPropagationForTab = (event: any) => {
    if (event.key !== "Esc") {
      event.stopPropagation();
    }
  };

  return (
    <>
      <MenuItem disableRipple onClick={handleClickOpen}>
        <span
          className="material-symbols-rounded"
          style={{ marginRight: "15px" }}
        >
          qr_code_scanner
        </span>
        Generate QR code
      </MenuItem>
      <Dialog
        onKeyDown={stopPropagationForTab}
        open={open}
        onClose={handleClose}
        sx={{
          transition: "all .2s",
        }}
        PaperProps={{
          sx: {
            p: 2,
            borderRadius: "28px",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "800" }}>QR code</DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <QRCode value={href} />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            disableElevation
            size="large"
            sx={{ borderRadius: 99, px: 3, py: 1 }}
            onClick={handleClose}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
