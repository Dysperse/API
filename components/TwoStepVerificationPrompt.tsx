import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, SwipeableDrawer, Typography } from "@mui/material";
import React, { useState } from "react";
import AuthCode from "react-auth-code-input";
import toast from "react-hot-toast";
import { neutralizeBack, revivalBack } from "../hooks/useBackButton";
import { toastStyles } from "../lib/useCustomTheme";
import { Puller } from "./Puller";

/**
 * Verify if 2fa code is correct
 * @returns JSX.Element
 */
export function Prompt({
  callback,
  children,
}: {
  children: JSX.Element;
  callback: () => any;
}) {
  const [open, setOpen] = useState(false);
  const trigger = React.cloneElement(children, {
    onClick: () => setOpen(true),
  });
  const userHasEnabled2fa =
    user.twoFactorSecret !== "" && user.twoFactorSecret !== "false";

  const [buttonLoading, setButtonLoading] = useState(false);
  const [code, setCode] = useState("");

  /**
   * Handles verification of 2fa code
   */
  const handleSubmit = async () => {
    try {
      setButtonLoading(true);
      const res = await fetch(
        `/api/user/2fa/verify?${new URLSearchParams({
          code: code,
          token: global.user.token,
        }).toString()}`
      );
      const data = await res.json();
      if (data.success) {
        callback();
        setOpen(false);
      } else {
        toast.error("Invalid code!", toastStyles);
        setCode("");
      }
      setButtonLoading(false);
    } catch (error) {
      toast.error(
        "An error occured while verifying your code. Please try again later.",
        toastStyles
      );
      setButtonLoading(false);
    }
  };

  React.useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });

  return (
    <>
      {trigger}
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen
      >
        <Puller />
        <Box
          sx={{
            p: 3,
          }}
        >
          {userHasEnabled2fa ? (
            <>
              <Typography
                variant="h5"
                sx={{
                  mb: "20px",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                Help us protect your account.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: "20px",
                  textAlign: "center",
                }}
              >
                Enter the 6-digit code from your authenticator app
              </Typography>
              <Box
                sx={{
                  textAlign: "center",
                }}
              >
                <AuthCode
                  containerClassName="auth-code-container"
                  inputClassName="auth-code-input"
                  allowedCharacters="numeric"
                  onChange={(value) => setCode(value)}
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
                  mb: "20px",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                Help us protect your account
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: "20px",
                  textAlign: "center",
                }}
              >
                We highly recommend you to enable 2FA to protect your account.
                You can enable it in your settings.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => {
                    document.getElementById("settingsTrigger")?.click();
                    setOpen(false);
                  }}
                  size="large"
                  sx={{
                    width: "100%",
                    my: 0.5,
                    boxShadow: 0,
                    borderRadius: 99,
                    textTransform: "none",
                  }}
                >
                  Continue
                </Button>
                <Button
                  variant="contained"
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
                  Maybe later
                </Button>
              </Box>
            </>
          )}
        </Box>
      </SwipeableDrawer>
    </>
  );
}
