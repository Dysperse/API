import LoadingButton from "@mui/lab/LoadingButton";
import * as twofactor from "node-2fa";
import { useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { Prompt } from "../TwoFactorModal";
import { updateSettings } from "./updateSettings";

import { Alert, Box, Link, TextField, Typography } from "@mui/material";
import { useSession } from "../../lib/client/useSession";
import { toastStyles } from "../../lib/client/useTheme";
import { ConfirmationModal } from "../ConfirmationModal";

/**
 * Top-level component for the two-factor authentication settings page.
 */
export default function App() {
  const session = useSession();
  const secret = twofactor.generateSecret({
    name: "Dysperse",
    account: session.user.email,
  });
  const [newSecret] = useState(secret);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDisable, setLoadingDisable] = useState<boolean>(false);

  return (
    <Box>
      {session.user.twoFactorSecret &&
      session.user.twoFactorSecret !== "false" ? (
        <Box>
          <Alert severity="info">
            2FA is enabled for your account &nbsp; 🎉
          </Alert>
          <Prompt
            callback={() => {
              setLoadingDisable(true);
              updateSettings("twoFactorSecret", "", false, () => {
                mutate("/api/user");
                setLoadingDisable(false);
              });
            }}
          >
            <LoadingButton
              loading={loadingDisable}
              sx={{ my: 3 }}
              fullWidth
              variant="contained"
              size="large"
            >
              Disable
            </LoadingButton>
          </Prompt>
        </Box>
      ) : (
        <Box>
          <Typography variant="h5">2FA Setup</Typography>
          <Typography sx={{ mt: 1 }}>
            Two-Factor Authentication (2FA) works by adding an additional layer
            of security to your Dysperse account.
          </Typography>

          <Typography sx={{ mt: 4, fontWeight: "700" }}>
            Step 1: Download the Google Authenticator from the{" "}
            <Link
              target="_blank"
              href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en_US&gl=US"
            >
              Play store (Android)
            </Link>{" "}
            or the{" "}
            <Link
              target="_blank"
              href="https://apps.apple.com/us/app/google-authenticator/id388497605"
            >
              App store (iOS)
            </Link>
          </Typography>

          <Typography sx={{ mt: 4, fontWeight: "700" }}>
            Step 2: Click the &ldquo;+&rdquo; button in the bottom right corner
            of your screen, and scan the QR code below:
          </Typography>
          <div
            style={{
              marginTop: "20px",
              background: "white",
              padding: "20px ",
              display: "inline-block",
              borderRadius: "28px",
              textAlign: "center",
            }}
          >
            <picture>
              <img
                src={newSecret.qr}
                alt="QR code"
                style={{
                  width: "100%",
                }}
              />
            </picture>
          </div>

          <Typography sx={{ mt: 4, fontWeight: "700" }}>
            Step 3: Enter the code you see in the Google Authenticator app
            below:
          </Typography>
          <TextField
            variant="filled"
            label="6-digit code (without spaces)"
            placeholder="*******"
            disabled={loading}
            type="number"
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            value={
              code.toString().length > 6
                ? code.toString().substring(0, 6)
                : code.toString()
            }
            onChange={(e: any) => {
              setCode(e.target.value.replace(" ", ""));
            }}
            sx={{ mt: 2 }}
          />

          <ConfirmationModal
            title="Turn on 2FA?"
            question="Are you sure you want to turn on 2FA? If you lose access to your authenticator, you will be locked out of your account."
            callback={() => {
              setLoading(true);
              fetch(
                `/api/user/2fa/setup?${new URLSearchParams({
                  ...newSecret,
                  code,
                  token: session.user.token,
                }).toString()}`,
                {
                  method: "POST",
                }
              )
                .then((res) => res.json())
                .then((res) => {
                  if (res.error) {
                    throw new Error(res.error);
                  }
                  toast.success("2FA setup successful!", toastStyles);
                  setLoading(false);
                  mutate("/api/user");
                })
                .catch(() => {
                  toast.error("Invalid code!", toastStyles);
                  setLoading(false);
                });
            }}
          >
            <LoadingButton
              loading={loading}
              variant="contained"
              sx={{ mt: 2, boxShadow: 0, borderRadius: 5, mb: 4 }}
              fullWidth
              size="large"
            >
              Verify
            </LoadingButton>
          </ConfirmationModal>
        </Box>
      )}
    </Box>
  );
}
