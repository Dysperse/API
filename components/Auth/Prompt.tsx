import LoadingButton from "@mui/lab/LoadingButton";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import * as colors from "@mui/material/colors";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import OtpInput from "react-otp-input";
import { createTheme, useTheme } from "@mui/material/styles";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import Cookies from "universal-cookie";
import { Layout } from "./Layout";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Puller } from "../Puller";

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
export default function Prompt() {
  global.themeColor = "brown";
  // Login form
  const [buttonLoading, setButtonLoading] = useState(false);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(true);

  const fetcher = (e: any, o: any) => fetch(e, o).then((res) => res.json());
  const cookies = new Cookies();
  const theme = useTheme();

  const url = "/api/fetchApp?id=" + window.location.pathname.split("oauth/")[1];
  const { data, error } = useSWR(url, () => fetcher(url, {}));
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      twoFactorCode: "",
    },
    onSubmit: (values) => {
      setButtonLoading(true);
      fetch("/api/auth", {
        method: "POST",
        body: new URLSearchParams({
          appId: window.location.pathname.split("oauth/")[1],
          email: values.email,
          password: values.password,
          twoFactorCode: values.twoFactorCode,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success === false && res["2fa"] === false) {
            toast.error("Invalid email or password", toastStyles);
            setButtonLoading(false);
          } else if (res.success === false && res["2fa"] === true) {
            if (!twoFactorModalOpen) {
              setButtonLoading(false);
              toast.error("Invalid 2FA code", toastStyles);
              return;
            }
            setButtonLoading(false);
          } else {
            cookies.set("accessToken", res.token, { path: "/" });
            window.location.href = `${res.redirectUri}?token=${res.token}`;
          }
        });
    },
  });

  const toastStyles = {
    style: {
      borderRadius: "10px",
      background: "#333",
      color: "#fff",
      padding: "10px",
      paddingLeft: "20px",
    },
  };

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
              borderRadius: "30px 30px 0 0",
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
                display: "flex",
                justifyContent: "center",
                "& *::selection": {
                  background: colors.brown[900] + "!important",
                  color: "#fff!important",
                },
                "& input": {
                  p: 1,
                  fontSize: "1.3rem",
                  textAlign: "center",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  height: "35px",
                  px: 1.5,
                  fontWeight: "900",
                  // Selection
                  display: "block!important",
                  margin: "0 5px",
                  outline: "none",
                },
              }}
            >
              <OtpInput
                value={formik.values.twoFactorCode}
                onChange={(value) =>
                  formik.setFieldValue("twoFactorCode", value)
                }
                numInputs={6}
                //   separator={<span>-</span>}
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
            left: 0,
            position: { xs: "fixed", sm: "unset" },
            mx: "auto",
            maxWidth: "100vw",
            overflowY: "auto",
            width: { sm: "400px" },
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
                src="https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@latest/v2/windows11/LargeTile.scale-125.png"
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
                  Welcome to Carbon.
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  We&apos;re so excited to have you back
                </Typography>
              </Box>
              <TextField
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
              <Box sx={{ pb: { xs: 15, sm: 0 } }}></Box>
              <Box
                sx={{
                  display: "flex",
                  mt: { sm: 2 },
                  position: { xs: "fixed", sm: "unset" },
                  bottom: 0,
                  left: 0,
                  py: 1,
                  background: "#c4b5b5",
                  width: { xs: "100vw", sm: "auto" },
                }}
              >
                <div></div>
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
        {/* <Link href={"/signup/" + window.location.pathname.split("oauth/")[1]}>
          <Button
            sx={{
              textTransform: "none",
              mt: 1,
              py: 0,
              transition: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Create an account
          </Button>
        </Link> */}
      </Box>
    </Layout>
  );
}
