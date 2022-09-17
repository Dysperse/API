import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as twofactor from "node-2fa";
import { useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { updateSettings } from "./updateSettings";

export default function App() {
  const secret = twofactor.generateSecret({
    name: "Carbon",
    account: global.user.email,
  });
  const [newSecret] = useState(secret);

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDisable, setLoadingDisable] = useState<boolean>(false);

  return (
    <Box sx={{ p: 5 }}>
      {global.user.twoFactorSecret &&
      global.user.twoFactorSecret !== "false" ? (
        <Box>
          <Typography>2FA is enabled for your account!</Typography>
          <LoadingButton
            loading={loadingDisable}
            onClick={() => {
              setLoadingDisable(true);
              updateSettings("twoFactorSecret", "", false, () => {
                mutate("/api/user");
                setLoadingDisable(false);
              });
            }}
            sx={{ mt: 5, boxShadow: 0, width: "100%", borderRadius: "100px" }}
            variant="contained"
            size="large"
          >
            Disable
          </LoadingButton>
        </Box>
      ) : (
        <Box>
          <Typography sx={{ fontWeight: "600" }} variant="h5">
            2FA Setup
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Two-Factor Authentication (2FA) works by adding an additional layer
            of security to your Carbon account.
          </Typography>

          <Typography variant="h6" sx={{ mt: 4, fontWeight: "700" }}>
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

          <Typography variant="h6" sx={{ mt: 4, fontWeight: "700" }}>
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

          <Typography variant="h6" sx={{ mt: 4, fontWeight: "700" }}>
            Step 3: Enter the code you see in the Google Authenticator app
            below:
          </Typography>
          <TextField
            variant="filled"
            label="6-digit code (without spaces)"
            placeholder="*******"
            fullWidth
            disabled={loading}
            type="number"
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            value={
              code.toString().length > 6
                ? code.toString().substring(0, 6)
                : code.toString()
            }
            onChange={(e) => {
              setCode(e.target.value.replace(" ", ""));
            }}
            sx={{ mt: 2 }}
          />

          <LoadingButton
            loading={loading}
            variant="contained"
            sx={{ mt: 1, boxShadow: 0, borderRadius: 5 }}
            size="large"
            onClick={() => {
              setLoading(true);
              fetch(
                "/api/user/2fa/setup?" +
                  new URLSearchParams({
                    ...newSecret,
                    code,
                    token: global.user.token,
                  }).toString(),
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
                  mutate("/api/user");
                })
                .catch(() => {
                  toast.error("Invalid code!");
                  setLoading(false);
                });
            }}
          >
            Verify
          </LoadingButton>
        </Box>
      )}
    </Box>
  );
}
