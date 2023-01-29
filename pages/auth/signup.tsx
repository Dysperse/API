import LoadingButton from "@mui/lab/LoadingButton";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useSWRConfig } from "swr";
import { Layout } from "../../components/Auth/Layout";

import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { toastStyles } from "../../lib/useCustomTheme";

/**
 * Top-level component for the signup page.
 */
export default function Prompt() {
  const router = useRouter();
  global.themeColor = "brown";
  const { mutate } = useSWRConfig();
  // Login form
  const [buttonLoading, setButtonLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: (values) => {
      setButtonLoading(true);
      fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            throw new Error(res.message);
          }
          alert(JSON.stringify(res));
          if (window.location.href.includes("?close=true")) {
            mutate("/api/user").then(() => {
              window.close();
              router.push("/");
            });
            return;
          }
          mutate("/api/user");
          router.push("/");
          toast.success("Welcome to Dysperse!", toastStyles);
        })
        .catch((err) => {
          setButtonLoading(false);
          toast.error(err.message, toastStyles);
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
      <Box
        sx={{
          "& *": {
            overscrollBehavior: "auto!important",
          },
        }}
      >
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
            width: { sm: "500px" },
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
              display: { xs: "flex", sm: "none" },
              mt: -3,
            }}
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
                <Typography variant="h4" sx={{ mb: 1, fontWeight: "600" }}>
                  Welcome to Dysperse!
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  Create a Dysperse ID to keep track of your lists, home
                  inventory, and start working towards your goals!
                </Typography>
              </Box>
              <TextField
                required
                disabled={buttonLoading}
                label="Your name"
                value={formik.values.name}
                name="name"
                fullWidth
                onChange={formik.handleChange}
                sx={{ mb: 1.5 }}
                variant="filled"
              />
              <TextField
                required
                disabled={buttonLoading}
                label="Your email address"
                value={formik.values.email}
                name="email"
                onChange={formik.handleChange}
                fullWidth
                sx={{ mb: 1.5 }}
                variant="filled"
              />
              <TextField
                required
                disabled={buttonLoading}
                label="Password"
                value={formik.values.password}
                fullWidth
                sx={{ mb: 1.5 }}
                name="password"
                type="password"
                onChange={formik.handleChange}
                variant="filled"
              />
              <TextField
                required
                fullWidth
                disabled={buttonLoading}
                type="password"
                label="Repeat password"
                value={formik.values.confirmPassword}
                sx={{ mb: 1.5 }}
                name="confirmPassword"
                onChange={formik.handleChange}
                variant="filled"
              />
              <Link href="/?close=true" legacyBehavior>
                <Button
                  sx={{
                    textTransform: "none",
                    mt: 1,
                    py: 0,
                    mb: { xs: 10, sm: 0 },
                    float: "right",
                    textAlign: "center",
                    transition: "none",
                    color: "#200923",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  I already have an account
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
                  background: "#F4CEEB",
                  width: { xs: "100vw", sm: "100%" },
                }}
              >
                <LoadingButton
                  loading={buttonLoading}
                  type="submit"
                  variant="contained"
                  id="_loading"
                  disableElevation
                  sx={{
                    background: "#200923!important",
                    borderRadius: 2,
                    ml: "auto",
                    mr: 1,
                    mt: { sm: 2 },
                    textTransform: "none",
                    transition: "none",
                  }}
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
