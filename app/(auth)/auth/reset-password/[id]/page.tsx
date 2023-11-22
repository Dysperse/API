"use client";
import { useColor } from "@/lib/client/useColor";
import { useStatusBar } from "@/lib/client/useStatusBar";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { authStyles } from "../../styles";

/**
 * Top-level component for the signup page.
 */
export default function Prompt() {
  const router = useRouter();
  // Login form
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const params = useParams();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      fetch("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          token: params?.id,
          password: password,
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            toast.success("Successfully changed your password!");
            router.push("/perspectives/weeks");
          } else {
            toast.error(
              "An error occurred while trying to change your password."
            );
            setButtonLoading(false);
          }
        })
        .catch(() => {
          toast.error("An error occurred while trying to change your password");
          setButtonLoading(false);
        });
    },
    [router, params, password]
  );
  useStatusBar(
    typeof window !== "undefined" && window.innerWidth < 600
      ? "#c4b5b5"
      : "#6b4b4b"
  );

  const isDark = useMediaQuery("(prefers-color-scheme: dark)");
  const palette = useColor("violet", isDark);

  return (
    <Box>
      <Box sx={authStyles(palette).container}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ pt: 3 }}>
            <Box sx={{ px: 1 }}>
              <Typography
                variant="h3"
                sx={{ mb: 1, mt: { xs: 3, sm: 0 } }}
                className="font-heading"
              >
                Reset your password
              </Typography>
              <Typography sx={{ my: 2, mb: 3 }}>
                Password must be more than 8 characters long, containing at
                least one letter and number
              </Typography>
            </Box>
            <TextField
              required
              disabled={buttonLoading}
              label="New password"
              placeholder="********"
              value={password}
              name="email"
              onChange={(e: any) => setPassword(e.target.value)}
              fullWidth
              sx={authStyles(palette).input}
              variant="outlined"
            />
            <TextField
              required
              disabled={buttonLoading}
              label="Confirm new password"
              placeholder="********"
              value={confirmPassword}
              name="email"
              onChange={(e: any) => setConfirmPassword(e.target.value)}
              fullWidth
              sx={authStyles(palette).input}
              variant="outlined"
            />
            <Link href="/" legacyBehavior>
              <Button sx={authStyles(palette).link}>
                Wait - I remember my password, take me back
              </Button>
            </Link>
            <Box sx={{ pb: { xs: 15, sm: 6 } }} />
            <Box sx={authStyles(palette).footer}>
              <LoadingButton
                loading={buttonLoading}
                type="submit"
                variant="contained"
                id="_loading"
                disableElevation
                disableRipple
                sx={authStyles(palette).submit}
                disabled={
                  !/\d/.test(password) ||
                  !/[a-z]/i.test(password) ||
                  confirmPassword.trim().length < 8 ||
                  password !== confirmPassword
                }
                size="large"
              >
                Continue
                <span
                  style={{ marginLeft: "10px" }}
                  className="material-symbols-rounded"
                >
                  chevron_right
                </span>
              </LoadingButton>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
