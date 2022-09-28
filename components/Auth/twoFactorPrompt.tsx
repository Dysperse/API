import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import toast from "react-hot-toast";
import OtpInput from "react-otp-input";
import { colors } from "../../lib/colors";
import { Puller } from "../Puller";

/**
 * Verify if 2fa code is correct
 * @returns JSX.Element
 */
export function Prompt({
  open,
  setOpen,
  callback,
}: {
  open: boolean;
  setOpen: (e: boolean) => any;
  callback: () => any;
}) {
  const userHasEnabled2fa =
    user.twoFactorSecret !== "" && user.twoFactorSecret !== "false";

  const [buttonLoading, setButtonLoading] = useState(false);
  const [code, setCode] = useState("");

  /**
   * Handles verification of 2fa code
   */
  const handleSubmit = () => {
    setButtonLoading(true);
    fetch(
      `/api/user/2fa/verify?${new URLSearchParams({
        code: code,
        token: global.user.token,
      }).toString()}`
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          callback();
          setOpen(false);
        } else {
          toast.error("Invalid code!");
          setCode("");
        }
        setButtonLoading(false);
      })
      .catch(() => {
        toast.error(
          "An error occured while verifying your code. Please try again later."
        );
        setButtonLoading(false);
      });
  };
  /**
   * handleOpen
   */
  const handleOpen = () => {
    setOpen(false);
    callback();
  };
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      disableSwipeToOpen
      PaperProps={{
        sx: {
          background: colors.brown[50],
          borderRadius: "20px 20px 0 0",
          mx: "auto",
          maxWidth: "500px",
        },
      }}
    >
      <Puller />
      <Box
        sx={{
          p: 3,
          mt: 3,
        }}
      >
        {userHasEnabled2fa ? (
          <>
            <Typography
              variant="h5"
              sx={{
                marginBottom: "20px",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              Help us protect your account
            </Typography>
            <Typography
              variant="body1"
              sx={{
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              Enter the 6-digit code from your authenticator app
            </Typography>

            <Box
              sx={{
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                "& *::selection": {
                  background: `${colors.brown[900]} !important`,
                  color: "#fff!important",
                },
                "& input": {
                  p: 1,
                  fontSize: "1.3rem",
                  textAlign: "center",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  height: "45px",
                  minWidth: "45px",
                  px: 1.5,
                  fontWeight: "900",
                  // Selection
                  display: "block!important",
                  margin: "0 5px",
                  outline: "none",
                },
              }}
            >
              <OtpInput
                value={code}
                onChange={(value) => setCode(value)}
                numInputs={6}
              />
            </Box>
            <LoadingButton
              variant="contained"
              loading={buttonLoading}
              onClick={handleSubmit}
              size="large"
              sx={{
                width: "100%",
                mb: 1.4,
                mt: 3,
                boxShadow: 0,
                borderRadius: 99,
                textTransform: "none",
                border: "2px solid transparent !important",
              }}
            >
              Continue
            </LoadingButton>
          </>
        ) : (
          <>
            <Typography
              variant="h5"
              sx={{
                marginBottom: "20px",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              Help us protect your account
            </Typography>
            <Typography
              variant="body1"
              sx={{
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              We highly recommend you to enable 2FA to protect your account. You
              can enable it in your settings.
            </Typography>
            <Button
              variant="contained"
              disableElevation
              onClick={() => {
                setOpen(false);
                callback();
              }}
              size="large"
              sx={{
                width: "100%",
                my: 0.5,
                boxShadow: 0,
                borderRadius: 99,
                textTransform: "none",
                border: "2px solid transparent !important",
              }}
            >
              Continue
            </Button>
            <Button
              variant="outlined"
              onClick={handleOpen}
              size="large"
              sx={{
                width: "100%",
                my: 0.5,
                boxShadow: 0,
                borderRadius: 99,
                textTransform: "none",
                borderWidth: "2px!important",
              }}
            >
              Open settings
            </Button>
          </>
        )}
      </Box>
    </SwipeableDrawer>
  );
}
