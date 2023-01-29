import { Turnstile } from "@marsidev/react-turnstile";
import LoadingButton from "@mui/lab/LoadingButton";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AuthCode from "react-auth-code-input";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import { Layout } from "../../components/Auth/Layout";
import { Puller } from "../../components/Puller";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";

import {
  Box,
  Button,
  Icon,
  NoSsr,
  Paper,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";

/**
 * Login prompt
 */
export default function Prompt() {
  const proTips = [
    "PRO TIP: You can customize your theme color by visiting your appearance settings.",
    "DID YOU KNOW: Dysperse started in 2020, and has been growing ever since.",
    "PRO TIP: Hit CTRL / to view a list of all the keyboard shortcuts.",
    "PRO TIP: Hit CTRL + K to quickly jump between pages, rooms, tasks, and more.",
    "DID YOU KNOW: Dysperse is open source! You can contribute to the project on GitHub.",
    "PRO TIP: Dysperse Coach is here to help you with goals, big and small. Set a goal by navigating to the Coach tab in the sidebar.",
    "PRO TIP: Accidentally placed an item in the wrong room? You can move an item by selecting the desired room.",
    "PRO TIP: You can view your home's audit log by clicking on the changelog icon in the navigation bar.",
    "PRO TIP: You can switch between light and dark mode by visiting your appearance settings.",
    "DID YOU KNOW: Dysperse is built using ReactJS",
    "DID YOU KNOW: Dysperse is sponsored by the amazing people @ Vercel.",
    "DID YOU KNOW: Dysperse was built with the intention of being a free, open-source alternative to other task management apps, which would be all-in-one.",
    "DID YOU KNOW: You can sign up to be a volunteer by visiting dysperse.com/join",
    "DID YOU KNOW: Dysperse was built with the intention of becoming a home inventory app, but has since evolved into much more!",
    "DID YOU KNOW: Dysperse is the #1 home inventory app available on the web.",
    "PRO TIP: Join the Dysperse Discord server by visiting dysperse.com/discord",
    "DID YOU KNOW: Dysperse uses AES-256 encryption to protect your data.",
    "PRO TIP: Dysperse saves your dark mode preference, so you don't have to worry about it changing when you switch devices.",
    "PRO TIP: Invite members to your home by clicking on your home's name in the navigation bar.",
    "DID YOU KNOW: Dysperse keeps UX in mind, and is designed to be as intuitive as possible.",
    "DID YOU KNOW: Dysperse keeps you logged in for 30 days, so you don't have to worry about logging in every time you visit.",
  ];
  const [proTip, setProTip] = useState(
    proTips[Math.floor(Math.random() * proTips.length)]
  );

  global.themeColor = "brown";
  const { mutate } = useSWRConfig();
  const router = useRouter();
  // Login form
  const [buttonLoading, setButtonLoading] = useState(false);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const toastStyles = {
    style: {
      borderRadius: "10px",
      background: "#333",
      color: "#fff",
      padding: "10px",
      paddingLeft: "20px",
    },
  };
  useEffect(() => {
    twoFactorModalOpen
      ? neutralizeBack(() => setTwoFactorModalOpen(false))
      : revivalBack();
  }, [twoFactorModalOpen]);

  const formik = useFormik({
    initialValues: {
      token: "",
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
          token: values.token,

          ...(window.location.href.includes("?application=") && {
            application: window.location.href.split("?application=")[1],
          }),
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.twoFactor) {
            setTwoFactorModalOpen(true);
            setButtonLoading(false);
            return;
          } else if (res.error) {
            setStep(1);
            throw new Error(res.error);
          }
          if (res.message) {
            setStep(1);
            toast.error(res.message, toastStyles);
            setButtonLoading(false);
            return;
          }
          if (
            typeof window !== "undefined" &&
            window.location.href.includes("?close=true")
          ) {
            // Success
            toast.promise(
              new Promise(() => {}),
              {
                loading: "Logging you in...",
                success: "Success!",
                error: "An error occured. Please try again later",
              },
              toastStyles
            );
            mutate("/api/user").then(() => {
              window.close();
            });
            return;
          }
          // Success
          toast.promise(
            new Promise(() => {}),
            {
              loading: "Logging you in...",
              success: "Success!",
              error: "An error occured. Please try again later",
            },
            toastStyles
          );
          if (window.location.href.includes("?application=")) {
            window.location.href =
              "https://availability.dysperse.com/api/oauth/redirect?token=" +
              res.accessToken;
          } else {
            mutate("/api/user");
            router.push("/");
            window.location.href = "/";
          }
        })
        .catch(() => {
          setStep(1);
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
  const [step, setStep] = useState(1);

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
                mb: "20px",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              Help us protect your account
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: "20px",
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
              disableElevation
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
            background: "#F4CEEB",
            borderRadius: { sm: 5 },
            top: 0,
            left: 0,
            position: { xs: "fixed", sm: "unset" },
            mx: "auto",
            maxWidth: "100vw",
            overflowY: "auto",
            width: { xs: "100vw", sm: "450px" },
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
                src="https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@master/v6/dark.png"
                width="40"
                height="40"
                style={{
                  borderRadius: "999px",
                }}
                alt="logo"
              />
            </picture>
            <Typography variant="h6">Dysperse</Typography>
          </Box>
          <form onSubmit={formik.handleSubmit}>
            {step === 1 ? (
              <Box sx={{ pt: 3 }}>
                <Box sx={{ px: 1 }}>
                  <NoSsr>
                    <Typography
                      variant="h4"
                      sx={{ mb: 1, fontWeight: "600", mt: { xs: 3, sm: 0 } }}
                    >
                      {router.pathname.includes("?application=availability")
                        ? "Sign into Dysperse Availability"
                        : "Welcome back!"}
                    </Typography>
                  </NoSsr>
                  <Typography sx={{ mb: 2 }}>
                    Sign in with your Dysperse ID
                  </Typography>
                </Box>
                <TextField
                  disabled={buttonLoading}
                  label="Your email address"
                  value={formik.values.email}
                  fullWidth
                  name="email"
                  onChange={formik.handleChange}
                  sx={{ mb: 1.5 }}
                  variant="filled"
                />
                <TextField
                  disabled={buttonLoading}
                  label="Password"
                  value={formik.values.password}
                  fullWidth
                  sx={{ mb: 1.5 }}
                  name="password"
                  onChange={formik.handleChange}
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
                    background: "#F4CEEB",
                    width: { xs: "100vw", sm: "auto" },
                  }}
                >
                  <div />
                  <LoadingButton
                    loading={buttonLoading}
                    type="submit"
                    variant="contained"
                    disableElevation
                    id="_loading"
                    sx={{
                      background: `#200923!important`,
                      borderRadius: 2,
                      ml: "auto",
                      mr: 1,
                      mt: { sm: 2 },
                      textTransform: "none",
                      transition: "none",
                    }}
                    size="large"
                    onClick={() => {
                      setStep(2);
                    }}
                  >
                    Continue
                    <span
                      style={{ marginLeft: "10px" }}
                      className="material-symbols-rounded"
                    >
                      arrow_forward
                    </span>
                  </LoadingButton>
                </Box>
              </Box>
            ) : (
              <Box>
                <Typography
                  variant="h4"
                  sx={{ mb: 1, mt: { xs: 5, sm: 0 }, fontWeight: "600" }}
                >
                  Verifying...
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  Hang on while we verify that you&apos;re a human.
                </Typography>
                <Turnstile
                  siteKey="0x4AAAAAAABo1BKboDBdlv8r"
                  onError={() => {
                    toast.error(
                      "An error occured. Please try again later",
                      toastStyles
                    );
                  }}
                  onExpire={() =>
                    toast.error("Expired. Please try again", toastStyles)
                  }
                  onSuccess={(token) => {
                    formik.setFieldValue("token", token);
                    setTimeout(() => {
                      formik.handleSubmit();
                    }, 500);
                  }}
                />
              </Box>
            )}
          </form>
          {step === 1 && (
            <Box>
              <Link
                href={
                  typeof window !== "undefined"
                    ? window.location.href.includes("?close=true")
                      ? "/signup?close=true"
                      : "/signup"
                    : "/signup"
                }
                legacyBehavior
              >
                <Button
                  sx={{
                    textTransform: "none",
                    mt: 1,
                    py: 0,
                    float: "right",
                    textAlign: "center",
                    mx: "auto",
                    color: "#200923",
                    transition: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Create an account
                </Button>
              </Link>
              <Link
                href={
                  typeof window !== "undefined"
                    ? window.location.href.includes("?close=true")
                      ? "/auth/reset-id?close=true"
                      : "/auth/reset-id"
                    : "/auth-reset-id"
                }
                legacyBehavior
              >
                <Button
                  sx={{
                    textTransform: "none",
                    mt: 1,
                    py: 0,
                    float: "right",
                    textAlign: "center",
                    mx: "auto",
                    color: "#200923",
                    transition: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  I forgot my ID
                </Button>
              </Link>
            </Box>
          )}
        </Paper>

        <Box
          onClick={() => {
            setProTip(proTips[Math.floor(Math.random() * proTips.length)]);
            // Scroll to bottom of page
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            });
          }}
          sx={{
            cursor: "pointer",
            transition: "all .2s",
            "&:active": {
              transform: "scale(.98)",
              transition: "none",
            },
            userSelect: "none",
            background: "#F4CEEB",
            borderRadius: { sm: 5 },
            mx: "auto",
            maxWidth: "100vw",
            display: { xs: "none", sm: "flex" },
            overflowY: "auto",
            width: { sm: "450px" },
            p: { xs: 2 },
            mt: { sm: 2 },
            mb: 2,
            height: { xs: "100vh", sm: "auto" },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Icon className="material-symbols-outlined outlined">
              lightbulb
            </Icon>
            <span>
              <i>
                <b>{proTip.split(":")[0]}</b>
              </i>
              <br />
              {proTip.split(":")[1]}
            </span>
          </Typography>
        </Box>
      </Box>
    </Layout>
  );
}
