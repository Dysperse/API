import { Turnstile } from "@marsidev/react-turnstile";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  Icon,
  IconButton,
  InputAdornment,
  NoSsr,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { authStyles, Layout } from "../../components/Auth/Layout";
import { isEmail } from "../../components/Group/MemberList";
import { useBackButton } from "../../lib/client/useBackButton";
import { toastStyles } from "../../lib/client/useTheme";

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

/**
 * Login prompt
 */
export default function Prompt() {
  const ref: any = useRef();
  const proTips = [
    "SECURITY TIP: Dysperse staff will NEVER ask for your password.",
    "PRO TIP: You can customize your theme color by visiting your appearance settings.",
    "DID YOU KNOW: Dysperse started in 2020, and has been growing ever since.",
    "PRO TIP: Hit CTRL / to view a list of all the keyboard shortcuts.",
    "PRO TIP: Hit CTRL + K to quickly jump between pages, rooms, tasks, and more.",
    "DID YOU KNOW: Dysperse is open source! You can contribute to the project on GitHub.",
    "PRO TIP: Dysperse Coach is here to help you with goals, big and small. Set a goal by navigating to the Coach tab in the sidebar.",
    "PRO TIP: Accidentally placed an item in the wrong room? You can move an item by selecting the desired room.",
    "PRO TIP: You can view your home's audit log by clicking on the changelog icon in the navigation bar.",
    "PRO TIP: You can switch between light and dark mode by visiting your appearance settings.",
    "DID YOU KNOW: Dysperse is built using React and Next",
    "DID YOU KNOW: Dysperse is sponsored by Neon and Vercel",
    "DID YOU KNOW: Dysperse was built with the intention of being a free, open-source alternative to other task management apps, which would be all-in-one.",
    "DID YOU KNOW: You can sign up to be a volunteer by visiting dysperse.com/join",
    "DID YOU KNOW: Dysperse was built with the intention of becoming a home inventory app, but has since evolved into much more!",
    "DID YOU KNOW: Dysperse is the first cloud home inventory app available on the web.",
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

  const router = useRouter();

  // Login form
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState<boolean>(false);

  useBackButton(() => setTwoFactorModalOpen(false));

  const [captchaToken, setCaptchaToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");

  const handleSubmit = async (e?: any) => {
    if (e) e.preventDefault();
    console.log("Submitted");
    setButtonLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          Credentials: "same-origin",
        },
        body: new URLSearchParams({
          appId: window.location.pathname.split("oauth/")[1],
          email,
          password,
          twoFactorCode,
          token: captchaToken,
          ...(router.pathname.includes("?application=") && {
            application: router.pathname.split("?application=")[1],
          }),
        }),
      }).then((res) => res.json());

      if (res.message && res.message.includes(`Can't reach database server`)) {
        toast.error(
          "Oh no! Our servers are down. Please try again later!",
          toastStyles
        );
        setButtonLoading(false);
        setStep(1);
        ref.current?.reset();
        return;
      }

      if (res.twoFactor) {
        setStep(3);
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
      if (router && router.pathname.includes("?close=true")) {
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
        mutate("/api/user");
        return;
      }
      // Success
      toast.promise(
        // thou shalt load forever
        new Promise(() => {}),
        {
          loading: "Logging you in...",
          success: "Success!",
          error: "An error occured. Please try again later",
        },
        toastStyles
      );

      if (router.pathname.includes("?application=")) {
        router.pathname =
          "https://availability.dysperse.com/api/oauth/redirect?token=" +
          res.accessToken;
      } else {
        mutate("/api/user");
        router.push("/");
        router.pathname = "/";
      }
    } catch (e) {
      setStep(1);
      alert(1);
      ref?.current?.reset();
      setButtonLoading(false);
    }
  };

  useEffect(() => {
    document
      .querySelector(`meta[name="theme-color"]`)
      ?.setAttribute("content", "hsl(240,11%,90%)");
  }, []);

  useEffect(() => {
    if (captchaToken !== "" && !buttonLoading && step === 2) handleSubmit();
  }, [captchaToken, handleSubmit]);

  const [step, setStep] = useState(1);
  const [togglePassword, setTogglePassword] = useState<boolean>(false);
  const handleTogglePassword = useCallback(() => {
    if (!togglePassword) {
      if (
        confirm(
          "Are you sure you want to show your password? Make sure nobody is around you 🤫"
        )
      )
        setTogglePassword((e) => !e);
    } else {
      setTogglePassword((e) => !e);
    }
  }, [togglePassword, setTogglePassword]);

  return (
    <Layout>
      <Box sx={authStyles.container}>
        <Box
          sx={{
            color: "#202020",
            [`@media (prefers-color-scheme: dark)`]: {
              color: "hsl(240,11%,90%)",
              "&:hover": {
                color: "hsl(240,11%,100%)",
              },
            },
            alignItems: "center",
            gap: 2,
            userSelect: "none",
            display: { xs: "flex", sm: "none" },
            mt: -3,
          }}
        >
          <picture>
            <img
              src="https://assets.dysperse.com/v6/dark.png"
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
        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <Box sx={{ pt: 3 }}>
              <Typography
                variant="h3"
                sx={{ mb: 1, mt: { xs: 3, sm: 0 } }}
                className="font-heading"
              >
                Welcome back!
              </Typography>
              <Typography sx={{ my: 1.5, mb: 3 }}>
                We&apos;re so excited to see you again! Please sign in with your
                Dysperse ID.
              </Typography>
              <TextField
                disabled={buttonLoading}
                label="Your email address"
                placeholder="jeffbezos@gmail.com"
                value={email}
                spellCheck={false}
                fullWidth
                name="email"
                onChange={(e: any) => setEmail(e.target.value)}
                sx={authStyles.input}
                variant="outlined"
              />
              <TextField
                disabled={buttonLoading}
                label="Password"
                placeholder="********"
                value={password}
                fullWidth
                sx={authStyles.input}
                name="password"
                onChange={(e: any) => setPassword(e.target.value)}
                type={togglePassword ? "text" : "password"}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword}
                        sx={{
                          [`@media (prefers-color-scheme: dark)`]: {
                            color: "hsl(240,11%,70%)",
                          },
                        }}
                      >
                        <span className="material-symbols-outlined">
                          {togglePassword ? "visibility_off" : "visibility"}
                        </span>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  position: { xs: "fixed", sm: "unset" },
                  bottom: 0,
                  left: 0,
                  py: { xs: 1, sm: 0 },
                  background: "hsl(240,11%,90%)",
                  [`@media (prefers-color-scheme: dark)`]: {
                    background: "hsl(240,11%,10%)",
                  },
                  width: { xs: "100vw", sm: "auto" },
                  // "& .MuiTooltip-tooltip": {
                  //   "& .MuiTooltip-arrow::before": {
                  //     background: "hsl(240, 11%, 10%)",
                  //   },
                  //   borderRadius: "5px",
                  //   fontSize: "14px",
                  //   [`@media (prefers-color-scheme: dark)`]: {
                  //     color: "hsl(240, 11%, 10%)",
                  //     background: "hsl(240, 11%, 90%)",

                  //     "& .MuiTooltip-arrow::before": {
                  //       background: "hsl(240, 11%, 90%)",
                  //     },
                  //   },
                  //   padding: "6px 14px",
                  //   boxShadow:
                  //     "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                  // },
                }}
              >
                <Tooltip
                  title={
                    !isEmail(email)
                      ? "Please type a valid email address"
                      : password.length < 8 ||
                        !/\d/.test(password) ||
                        !/[a-z]/i.test(password)
                      ? "Your password looks incorrect"
                      : ""
                  }
                >
                  <span style={{ marginLeft: "auto" }}>
                    <LoadingButton
                      loading={buttonLoading}
                      type="submit"
                      variant="contained"
                      disableRipple
                      disableElevation
                      id="_loading"
                      sx={authStyles.submit}
                      size="large"
                      disabled={
                        !isEmail(email) ||
                        email.trim() === "" ||
                        password.length < 8 ||
                        !/\d/.test(password) ||
                        !/[a-z]/i.test(password)
                      }
                      onClick={() => setStep(2)}
                    >
                      Continue
                      <span
                        style={{ marginLeft: "10px" }}
                        className="material-symbols-rounded"
                      >
                        east
                      </span>
                    </LoadingButton>
                  </span>
                </Tooltip>
              </Box>
            </Box>
          ) : step == 2 ? (
            <Box>
              <Typography
                variant="h3"
                sx={{ mb: 1, mt: { xs: 3, sm: 0 } }}
                className="font-heading"
              >
                Verifying...
              </Typography>
              <Typography sx={{ my: 2, mb: 3 }}>
                Hang on while we verify that you&apos;re a human.
              </Typography>
              <NoSsr>
                <Turnstile
                  ref={ref}
                  siteKey="0x4AAAAAAABo1BKboDBdlv8r"
                  onError={() => {
                    ref.current?.reset();
                    toast.error("An error occured. Retrying...", toastStyles);
                  }}
                  onExpire={() => {
                    ref.current?.reset();
                    toast.error("Expired. Retrying...", toastStyles);
                  }}
                  autoResetOnExpire
                  scriptOptions={{
                    defer: true,
                  }}
                  options={{
                    retry: "auto",
                  }}
                  onSuccess={(token) => setCaptchaToken(token)}
                />
              </NoSsr>
            </Box>
          ) : (
            <Box>
              <Typography variant="h4" sx={{ mb: 1, mt: { xs: 5, sm: 0 } }}>
                Help us protect your account
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Please type in your 2FA code via your authenticator app.
              </Typography>
              <MuiOtpInput
                length={6}
                value={twoFactorCode}
                onChange={(value) => setTwoFactorCode(value)}
              />
              <LoadingButton
                variant="contained"
                loading={buttonLoading}
                onClick={() => setStep(2)}
                size="large"
                disableElevation
                sx={{
                  float: "right",
                  mt: 3,
                  borderRadius: 99,
                  ...(twoFactorCode.length == 6 && {
                    background: `#200923!important`,
                  }),
                  textTransform: "none",
                  gap: 2,
                }}
                disabled={twoFactorCode.length < 6}
              >
                Continue
                <span className="material-symbols-rounded">east</span>
              </LoadingButton>
            </Box>
          )}
        </form>
        {step === 1 && (
          <Box>
            <Link href="/signup?close=true" legacyBehavior>
              <Button sx={authStyles.link}>Create an account</Button>
            </Link>
            <Link href="/auth-reset-id?close=true" legacyBehavior>
              <Button sx={authStyles.link}>I forgot my ID</Button>
            </Link>
          </Box>
        )}
      </Box>

      <NoSsr>
        <Box
          onClick={() => {
            setProTip(proTips[Math.floor(Math.random() * proTips.length)]);
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
            background: "hsl(240,11%,90%)",
            [`@media (prefers-color-scheme: dark)`]: {
              background: "hsl(240,11%,10%)",
              color: "hsl(240,11%,90%)",
            },
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
      </NoSsr>
    </Layout>
  );
}
