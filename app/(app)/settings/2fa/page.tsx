"use client";

import { ConfirmationModal } from "@/components/ConfirmationModal";
import { Prompt } from "@/components/TwoFactorModal";
import { useSession } from "@/lib/client/session";
import { updateSettings } from "@/lib/client/updateSettings";
import LoadingButton from "@mui/lab/LoadingButton";
import { Alert, Box, Link, Typography } from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import * as twofactor from "node-2fa";
import { useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import Layout from "../layout";

/**
 * Top-level component for the two-factor authentication settings page.
 */
export default function App() {
  const { session } = useSession();
  const secret = twofactor.generateSecret({
    name: "Dysperse",
    account: session.user.email,
  });
  const [newSecret] = useState(secret);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDisable, setLoadingDisable] = useState<boolean>(false);

  const handleCreate = () => {
    setLoading(true);
    fetch(
      `/api/user/settings/2fa/setup?${new URLSearchParams({
        ...newSecret,
        code,
        token: session.current.token,
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
        toast.success("2FA setup successful!");
        setLoading(false);
        mutate("/api/session");
      })
      .catch(() => {
        toast.error("Invalid code!");
        setLoading(false);
      });
  };

  const handleDisable = async () => {
    setLoadingDisable(true);
    await updateSettings(["twoFactorSecret", false], { session });
    mutate("/api/session");
    setLoadingDisable(false);
  };

  return (
    <Layout>
      {session.user.twoFactorSecret &&
      session.user.twoFactorSecret !== "false" ? (
        <Box>
          <Alert severity="info">
            2FA is enabled for your account &nbsp; 🎉
          </Alert>
          <Prompt callback={handleDisable}>
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
          <Typography sx={{ mt: 1 }}>
            Two-factor authentication (2FA) provides an additional layer of
            security to protect your Dysperse account. By implementing 2FA,
            Dysperse ensures that access to your account requires not just a
            password but also a second form of verification.
          </Typography>

          <Typography variant="h6" sx={{ mt: 4 }}>
            Step 1
          </Typography>
          <Typography sx={{ fontWeight: "700" }}>
            Download the Google Authenticator from the{" "}
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

          <Typography variant="h6" sx={{ mt: 4 }}>
            Step 2
          </Typography>
          <Typography sx={{ fontWeight: "700" }}>
            Click the &ldquo;+&rdquo; button in the bottom right corner of your
            screen, and scan the QR code below:
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
            <img
              src={newSecret.qr}
              alt="QR code"
              style={{
                width: "100%",
              }}
            />
          </div>

          <Typography variant="h6" sx={{ mt: 4 }}>
            Step 3
          </Typography>
          <Typography sx={{ fontWeight: "700" }}>
            Enter the code you see in the Google Authenticator app below:
          </Typography>
          <Box sx={{ maxWidth: "500px" }}>
            <MuiOtpInput
              value={code}
              sx={{ mt: 2 }}
              length={6}
              onChange={(value) => setCode(value)}
            />

            <ConfirmationModal
              title="Turn on 2FA?"
              question="Are you sure you want to turn on 2FA? If you lose access to your authenticator, you will be locked out of your account."
              callback={handleCreate}
            >
              <LoadingButton
                loading={loading}
                variant="contained"
                sx={{ mt: 2, boxShadow: 0, borderRadius: 5, mb: 4 }}
                fullWidth
                size="large"
                disabled={code.length < 6}
              >
                Verify
              </LoadingButton>
            </ConfirmationModal>
          </Box>
        </Box>
      )}
    </Layout>
  );
}
