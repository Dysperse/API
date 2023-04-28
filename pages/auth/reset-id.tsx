import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSWRConfig } from "swr";
import { AuthBranding, Layout, authStyles } from "../../components/Auth/Layout";
import { isEmail } from "../../components/Group/Members";
import { toastStyles } from "../../lib/client/useTheme";

/**
 * Top-level component for the signup page.
 */
export default function Prompt() {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  // Login form
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  const [email, setEmail] = useState("");

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      fetch("/api/auth/reset-id", {
        method: "POST",
        body: JSON.stringify({ email: email }),
      })
        .then((res) => {
          if (res.status === 200) {
            toast.success(
              "Check your email for further instructions.",
              toastStyles
            );
            router.push("/tasks");
            setButtonLoading(false);
          } else {
            toast.error("An error occurred.", toastStyles);
            setButtonLoading(false);
          }
        })
        .catch(() => {
          toast.error("An error occurred.", toastStyles);
          setButtonLoading(false);
        });
    },
    [router, email]
  );

  useEffect(() => {
    if (typeof document !== "undefined")
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute(
          "content",
          window.innerWidth < 600 ? "#c4b5b5" : "#6b4b4b"
        );
  });

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
                  Forgot your password!?
                </Typography>
                <Typography sx={{ my: 2, mb: 3 }}>
                  No worries! We&apos;ll just send you an email with a link to
                  reset your password!
                </Typography>
              </Box>
              <TextField
                required
                disabled={buttonLoading}
                label="Your email address"
                placeholder="jeffbezos@gmail.com"
                value={email}
                name="email"
                onChange={(e: any) => setEmail(e.target.value)}
                fullWidth
                sx={authStyles.input}
                variant="outlined"
              />
              <Link href="/?close=true" legacyBehavior>
                <Button sx={authStyles.link}>
                  Wait - I remember my password, take me back
                </Button>
              </Link>
              <Box sx={{ pb: { xs: 15, sm: 0 } }} />
              <Box
                sx={{
                  display: "flex",
                  mt: { sm: 2 },
                  position: { xs: "fixed", sm: "unset" },
                  bottom: 0,
                  left: 0,
                  zIndex: 1,
                  py: 1,
                  background: "hsl(240,11%,90%)",
                  ["@media (prefers-color-scheme: dark)"]: {
                    background: "hsl(240,11%,10%)",
                  },
                  width: { xs: "100vw", sm: "100%" },
                }}
              >
                <LoadingButton
                  loading={buttonLoading}
                  type="submit"
                  variant="contained"
                  id="_loading"
                  disableElevation
                  disableRipple
                  sx={authStyles.submit}
                  disabled={!isEmail(email)}
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
