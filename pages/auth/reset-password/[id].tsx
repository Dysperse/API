import LoadingButton from "@mui/lab/LoadingButton";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Layout } from "../../../components/Auth/Layout";
import { colors } from "../../../lib/colors";

import { Box, Paper, TextField, Typography } from "@mui/material";
import { toastStyles } from "../../../lib/useCustomTheme";

/**
 * Top-level component for the signup page.
 */
export default function Prompt() {
  const router = useRouter();
  global.themeColor = "brown";

  // Login form
  const [buttonLoading, setButtonLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: (values) => {
      setButtonLoading(true);
      if (values.password !== values.confirmPassword) {
        toast.error("Passwords do not match.");
        setButtonLoading(false);
        return;
      }
      fetch("/api/change-password", {
        method: "POST",
        body: JSON.stringify({
          token: router.query.id,
          password: values.password,
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            toast.success("Successfully changed your password!", toastStyles);
            router.push("/tasks");
            // setButtonLoading(false);
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
            background: "#c4b5b5",
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
                  Create a new password
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  Create a new password for your account.
                </Typography>
              </Box>
              <TextField
                required
                disabled={buttonLoading}
                label="New password"
                value={formik.values.password}
                name="password"
                type="password"
                onChange={formik.handleChange}
                sx={{ mb: 1.5 }}
                variant="filled"
              />
              <TextField
                required
                disabled={buttonLoading}
                label="Confirm new password"
                value={formik.values.confirmPassword}
                name="confirmPassword"
                type="password"
                onChange={formik.handleChange}
                sx={{ mb: 1.5 }}
                variant="filled"
              />
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
                  width: { xs: "100vw", sm: "100%" },
                }}
              >
                <div />
                <LoadingButton
                  loading={buttonLoading}
                  type="submit"
                  variant="contained"
                  id="_loading"
                  sx={{
                    background: `${colors.brown[900]}!important`,
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
