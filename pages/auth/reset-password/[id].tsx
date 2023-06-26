import { AuthBranding, Layout, authStyles } from "@/components/Auth/Layout";
import { useStatusBar } from "@/lib/client/useStatusBar";
import { toastStyles } from "@/lib/client/useTheme";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";

/**
 * Top-level component for the signup page.
 */
export default function Prompt() {
  const router = useRouter();
  // Login form
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      fetch("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          token: router.query.id,
          password: password,
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            toast.success("Successfully changed your password!", toastStyles);
            router.push("/agenda/week");
          } else {
            toast.error(
              "An error occurred while trying to change your password.",
              toastStyles
            );
            setButtonLoading(false);
          }
        })
        .catch(() => {
          toast.error(
            "An error occurred while trying to change your password",
            toastStyles
          );
          setButtonLoading(false);
        });
    },
    [router, password]
  );
  useStatusBar(window.innerWidth < 600 ? "#c4b5b5" : "#6b4b4b");

  return (
    <Layout>
      <Box>
        <Box sx={authStyles.container}>
          <AuthBranding mobile />
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
                sx={authStyles.input}
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
                sx={authStyles.input}
                variant="outlined"
              />
              <Link href="/" legacyBehavior>
                <Button sx={authStyles.link}>
                  Wait - I remember my password, take me back
                </Button>
              </Link>
              <Box sx={{ pb: { xs: 15, sm: 6 } }} />
              <Box sx={authStyles.footer}>
                <LoadingButton
                  loading={buttonLoading}
                  type="submit"
                  variant="contained"
                  id="_loading"
                  disableElevation
                  disableRipple
                  sx={authStyles.submit}
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
    </Layout>
  );
}
