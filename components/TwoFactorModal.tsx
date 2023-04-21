import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, SwipeableDrawer, Typography } from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useBackButton } from "../lib/client/useBackButton";
import { useSession } from "../lib/client/useSession";
import { toastStyles } from "../lib/client/useTheme";
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
  const [open, setOpen] = useState<boolean>(false);
  const trigger = React.cloneElement(children, {
    onClick: () => setOpen(true),
  });
  const session = useSession();

  const userHasEnabled2fa =
    session &&
    session?.user.twoFactorSecret !== "" &&
    session?.user.twoFactorSecret !== "false"; // Yes, it can be a string, "false" since it stores the code

  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
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
          token: session.user.token,
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
  useBackButton(() => setOpen(false));

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
        <Box sx={{ p: 3 }}>
          {userHasEnabled2fa ? (
            <>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  textAlign: "center",
                }}
              >
                Help us protect your account
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
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
                <MuiOtpInput
                  value={code}
                  length={6}
                  onChange={(value) => setCode(value)}
                />
              </Box>
              <LoadingButton
                variant="contained"
                loading={buttonLoading}
                onClick={handleSubmit}
                size="large"
                sx={{
                  mt: 3,
                  float: "right",
                }}
              >
                Continue
              </LoadingButton>
            </>
          ) : (
            <>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  textAlign: "center",
                }}
              >
                Help us protect your account
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
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
                    mt: 0.5,
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
                    mt: 0.5,
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
