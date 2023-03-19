import LoadingButton from "@mui/lab/LoadingButton";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authStyles, Layout } from "../../components/Auth/Layout";

import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { toastStyles } from "../../lib/client/useTheme";

/**
 * Top-level component for the signup page.
 */
export default function Prompt() {
  const router = useRouter();

  // Login form
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: (values) => {
      setButtonLoading(true);
      fetch("/api/auth/reset-id", {
        method: "POST",
        body: JSON.stringify({
          email: values.email,
        }),
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
  });

  useEffect(() => {
    if (typeof document !== "undefined")
      document
        .querySelector(`meta[name="theme-color"]`)
        ?.setAttribute(
          "content",
          window.innerWidth < 600 ? "#c4b5b5" : "#6b4b4b"
        );
  });
  return (
    <Layout>
      <Box>
        <Paper
          sx={{
            background: "#F4CEEB",
            borderRadius: { sm: 5 },
            top: 0,
            mb: 5,
            left: 0,
            position: { xs: "fixed", sm: "unset" },
            mx: "auto",
            maxWidth: "100vw",
            overflowY: "auto",
            width: { sm: "450px" },
            p: { xs: 2, sm: 5 },
            mt: { sm: 5 },
            pt: { xs: 6, sm: 5 },
            height: { xs: "100vh", sm: "auto" },
          }}
          elevation={0}
        >
          <Box
            sx={{
              color: "#202020",
              alignItems: "center",
              gap: "10px",
              userSelect: "none",
              cursor: "pointer",
              display: { xs: "flex", sm: "none" },
              mt: -3,
            }}
            onClick={() => window.open("//dysperse.com")}
          >
            <picture>
              <img
                src="https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@master/v2/rounded.png"
                width="80"
                height="80"
                alt="logo"
              />
            </picture>
            <Typography variant="h5" sx={{ mt: -1 }}>
              Dysperse
            </Typography>
          </Box>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ pt: 3 }}>
              <Box sx={{ px: 1 }}>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  Forgot your ID?
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  Enter your email address and we&apos;ll send you a link to
                  reset your ID.
                </Typography>
              </Box>
              <TextField
                required
                disabled={buttonLoading}
                label="Your email address"
                value={formik.values.email}
                name="email"
                onChange={formik.handleChange}
                sx={authStyles.input}
                variant="filled"
              />

              <Link
                href={
                  typeof window !== "undefined"
                    ? window.location.href.includes("?close=true")
                      ? "/auth?close=true"
                      : "/auth"
                    : "/auth"
                }
                legacyBehavior
              >
                <Button sx={authStyles.link}>Back to login</Button>
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
                  background: "#c4b5b5",
                  [`@media (prefers-color-scheme: dark)`]: {
                    background: "hsl(240,11%,10%)",
                  },
                  width: { xs: "100vw", sm: "100%" },
                }}
              >
                <div />
                <LoadingButton
                  loading={buttonLoading}
                  type="submit"
                  variant="contained"
                  id="_loading"
                  sx={authStyles.submit}
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
        </Paper>
      </Box>
    </Layout>
  );
}
