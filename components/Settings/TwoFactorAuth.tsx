import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { mutate } from "swr";
import toast from "react-hot-toast";
import QRCode from "react-qr-code";
import base32 from "thirty-two";
import { v4 as uuidv4 } from "uuid";
import { updateSettings } from "./updateSettings";

const key = uuidv4();
const encoded = base32.encode(key);
const encodedForGoogle = encoded.toString().replace(/[=]/g, "");
const uri =
  "otpauth://totp/" +
  encodeURIComponent("Carbon") +
  "?secret=" +
  encodedForGoogle;

export default function App() {
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
            <QRCode value={uri} size={170} />
          </div>

          <Typography variant="h6" sx={{ mt: 4, fontWeight: "700" }}>
            Step 3: Enter the code you see in the Google Authenticator app
            below:
          </Typography>
          <TextField
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
              setCode(e.target.value);
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
                    secret: key,
                    code: code,
                    token: global.user.token,
                  }),
                {
                  method: "POST",
                }
              )
                .then((res) => res.json())
                .then((res) => {
                  toast.success("2FA setup successful!");
                  setLoading(false);
                  mutate("/api/user");
                })
                .catch((err) => {
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
