import LoadingButton from "@mui/lab/LoadingButton";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AuthCode from "react-auth-code-input";
import toast from "react-hot-toast";
import { colors } from "../../lib/colors";

import { useSWRConfig } from "swr";
import { Layout } from "../../components/Auth/Layout";
import { Puller } from "../../components/Puller";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";

import {
  Box,
  Button,
  Paper,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";

/**
 * Top-level component for the signup page.
 */
export default function Prompt() {
  const router = useRouter();
  global.themeColor = "brown";
  const { mutate } = useSWRConfig();
  // Login form
  const [buttonLoading, setButtonLoading] = useState(false);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState<any>("");
  useEffect(() => {
    twoFactorModalOpen
      ? neutralizeBack(() => setTwoFactorModalOpen(false))
      : revivalBack();
  });
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
          if (res.message == "Email already in use") {
            throw new Error("Email already in use");
          }
          if (window.location.href.includes("?close=true")) {
            mutate("/api/user").then(() => {
              window.close();
            });
            return;
          }
          mutate("/api/user");
          router.push("/");
          toast.success("Welcome to Carbon!");
        })
        .catch((err) => {
          setButtonLoading(false);
          toast.error(err);
        });
    },
  });

  document
    .querySelector(`meta[name="theme-color"]`)
    ?.setAttribute("content", window.innerWidth < 600 ? "#c4b5b5" : "#6b4b4b");

  return (
    <Layout>
      <Box
        sx={{
          "& *": {
            overscrollBehavior: "auto!important",
          },
        }}
      >
        <SwipeableDrawer
          anchor="bottom"
          open={twoFactorModalOpen}
          onClose={() => setTwoFactorModalOpen(false)}
          onOpen={() => setTwoFactorModalOpen(true)}
          disableSwipeToOpen
          PaperProps={{
            sx: {
              background: colors.brown[50],
              borderRadius: "20px 20px 0 0",
              mx: "auto",
              maxWidth: "500px",
            },
          }}
        >
          <Puller />
          <Box
            sx={{
              p: 3,
              mt: 3,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                marginBottom: "20px",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              Help us protect your account
            </Typography>
            <Typography
              variant="body1"
              sx={{
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              Enter the 6-digit code from your authenticator app
            </Typography>

            {/* Six digit authenticator code input */}
            <Box
              sx={{
                textAlign: "center",
              }}
            >
              <AuthCode
                allowedCharacters="numeric"
                onChange={(value) => setOtpCode(value)}
              />
            </Box>
            <LoadingButton
              variant="contained"
              loading={buttonLoading}
              onClick={() => {
                formik.handleSubmit();
              }}
              size="large"
              sx={{
                width: "100%",
                mb: 1.4,
                mt: 3,
                boxShadow: 0,
                borderRadius: 99,
                textTransform: "none",
                border: "2px solid transparent !important",
              }}
            >
              Continue
            </LoadingButton>
          </Box>
        </SwipeableDrawer>

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
              Carbon
            </Typography>
          </Box>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ pt: 3 }}>
              <Box sx={{ px: 1 }}>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: "600" }}>
                  Welcome to Carbon!
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  Create a Carbon ID to keep track of your lists, home
                  inventory, and start working towards your goals!
                </Typography>
              </Box>
              <TextField
                required
                disabled={buttonLoading}
                autoComplete={"off"}
                label="Your name"
                value={formik.values.name}
                name="name"
                onChange={formik.handleChange}
                sx={{ mb: 1.5 }}
                fullWidth
                variant="filled"
              />
              <TextField
                required
                disabled={buttonLoading}
                autoComplete={"off"}
                label="Your email address"
                value={formik.values.email}
                name="email"
                onChange={formik.handleChange}
                sx={{ mb: 1.5 }}
                fullWidth
                variant="filled"
              />
              <TextField
                required
                autoComplete={"off"}
                disabled={buttonLoading}
                label="Password"
                value={formik.values.password}
                sx={{ mb: 1.5 }}
                name="password"
                onChange={formik.handleChange}
                fullWidth
                variant="filled"
              />
              <TextField
                required
                autoComplete={"off"}
                disabled={buttonLoading}
                label="Repeat password"
                value={formik.values.confirmPassword}
                sx={{ mb: 1.5 }}
                name="confirmPassword"
                onChange={formik.handleChange}
                fullWidth
                variant="filled"
              />
              <Link
                href={
                  window.location.href.includes("?close=true")
                    ? "/?close=true"
                    : "/"
                }
              >
                <Button
                  sx={{
                    textTransform: "none",
                    mt: 1,
                    py: 0,
                    mb: { xs: 10, sm: 0 },
                    float: "right",
                    textAlign: "center",
                    mx: "auto",
                    transition: "none",
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
                  background: "#c4b5b5",
                  width: { xs: "100vw", sm: "100%" },
                }}
              >
                <LoadingButton
                  loading={buttonLoading}
                  type="submit"
                  variant="contained"
                  id="_loading"
                  sx={{
                    borderRadius: 2,
                    ml: "auto",
                    mr: 1,
                    mt: { sm: 2 },
                    textTransform: "none",
                    transition: "none",
                  }}
                  disableElevation
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
