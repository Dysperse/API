import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AuthCode from "react-auth-code-input";
import { useSWRConfig } from "swr";
import { Layout } from "../../components/Auth/Layout";
import { Puller } from "../../components/Puller";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { colors } from "../../lib/colors";

/**
 * Login prompt
 */
export default function Prompt() {
  global.themeColor = "brown";
  const { mutate } = useSWRConfig();
  const router = useRouter();
  // Login form
  const [buttonLoading, setButtonLoading] = useState(false);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);

  useEffect(() => {
    twoFactorModalOpen
      ? neutralizeBack(() => setTwoFactorModalOpen(false))
      : revivalBack();
  }, [twoFactorModalOpen]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      twoFactorCode: "",
    },
    onSubmit: (values) => {
      setButtonLoading(true);
      fetch("/api/login", {
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
          if (res.twoFactor) {
            setTwoFactorModalOpen(true);
            setButtonLoading(false);
            return;
          } else if (res.error) {
            throw new Error(res.error);
          }
          if (window.location.href.includes("?close=true")) {
            mutate("/api/user").then(() => {
              window.close();
            });
            return;
          }
          mutate("/api/user");
          router.push("/tasks");
        })
        .catch(() => setButtonLoading(false));
    },
  });

  // const toastStyles = {
  //   style: {
  //     borderRadius: "10px",
  //     background: "#333",
  //     color: "#fff",
  //     padding: "10px",
  //     paddingLeft: "20px",
  //   },
  // };

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
                containerClassName="auth-code-container"
                inputClassName="auth-code-input"
                allowedCharacters="numeric"
                onChange={(value) =>
                  formik.setFieldValue("twoFactorCode", value)
                }
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
                  Welcome back!
                </Typography>
                <Typography sx={{ mb: 2 }} className="font-secondary">
                  Sign in with your Carbon ID
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
                type="password"
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
                  py: 1,
                  background: "#c4b5b5",
                  width: { xs: "100vw", sm: "auto" },
                }}
              >
                <div />
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
          <Link
            href={
              window.location.href.includes("?close=true")
                ? "/signup?close=true"
                : "/signup"
            }
          >
            <Button
              sx={{
                textTransform: "none",
                mt: 1,
                py: 0,
                float: "right",
                textAlign: "center",
                mx: "auto",
                transition: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Create an account
            </Button>
          </Link>
          <Link
            href={
              window.location.href.includes("?close=true")
                ? "/auth/reset-id?close=true"
                : "/auth/reset-id"
            }
          >
            <Button
              sx={{
                textTransform: "none",
                mt: 1,
                py: 0,
                float: "right",
                textAlign: "center",
                mx: "auto",
                transition: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              I forgot my ID
            </Button>
          </Link>
        </Paper>
      </Box>
    </Layout>
  );
}
