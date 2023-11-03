"use client";

import { ConfirmationModal } from "@/components/ConfirmationModal";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useColor } from "@/lib/client/useColor";
import { Turnstile } from "@marsidev/react-turnstile";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  CircularProgress,
  Icon,
  IconButton,
  InputAdornment,
  NoSsr,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import QRCode from "react-qr-code";
import { mutate } from "swr";
import { AuthBranding } from "./branding";
import { authStyles } from "./styles";

function QrLogin({ handleRedirect }) {
  const isDark = useMediaQuery("(prefers-color-scheme: dark)");
  const palette = useColor("violet", isDark);

  const [data, setData] = useState<any>(null);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<any>(null);

  const generate = async () => {
    try {
      const d = await fetch("/api/auth/qr/generate").then((res) => res.json());
      setData(d);
    } catch {
      setError(true);
    }
  };

  useEffect(() => {
    generate();
  }, []);

  const url = data
    ? `https://${window.location.hostname}/api/auth/qr/scan?token=${data.token}`
    : "";

  const handleVerify = useCallback(async () => {
    const verifyUrl = `/api/auth/qr/verify?${new URLSearchParams({
      token: data ? data.token : "",
    })}`;
    if (url && data) {
      fetch(verifyUrl)
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            setVerified(true);
            toast.promise(new Promise(() => {}), {
              loading: "Logging you in...",
              success: "Success!",
              error: "An error occured. Please try again later",
            });
            handleRedirect(res);
          }
        });
    }
  }, [data, url, handleRedirect]);

  useEffect(() => {
    if (data && !verified) {
      const interval = setInterval(() => {
        handleVerify();
      }, 3000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [data, handleVerify, verified]);

  const handleCopy = () => {
    handleVerify();
    navigator.clipboard.writeText(url);
    toast.success("Copied to clipboard and rechecking if you scanned it...");
  };

  const containerStyles = {
    width: "250px",
    height: "250px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: palette[4],
    borderRadius: 5,
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          position: "relative",
          "&:hover .hover": {
            opacity: 1,
            transform: "scale(1)",
            transition: "transform .2s",
          },
          "& .hover": {
            opacity: 0,
            transform: "scale(.9)",
            transition: "all .2s",
          },
        }}
      >
        {error && (
          <Box sx={{ ...containerStyles, mb: "-250px", zIndex: 1, p: 2 }}>
            Something went wrong. Please try again later
          </Box>
        )}
        {data ? (
          <Box
            sx={{
              ...containerStyles,
            }}
          >
            <Box
              className="hover"
              sx={{
                position: "absolute",
                display: "flex",
                gap: 2,
                alignItems: "center",
                justifyContent: "center",
                background: addHslAlpha(palette[5], 0.8),
                top: 0,
                borderRadius: 5,
                left: 0,
                zIndex: 999,
                width: "100%",
                height: "100%",
                cursor: "pointer",
                backdropFilter: "blur(10px)",
              }}
              onClick={handleCopy}
            >
              <Box>
                <span className="material-symbols-rounded">content_copy</span>
                <Typography>Copy link</Typography>
              </Box>
            </Box>
            <QRCode
              value={url}
              bgColor="transparent"
              fgColor={isDark ? "#fff" : "#000"}
              style={{
                width: "200px",
                height: "200px",
              }}
            />
          </Box>
        ) : (
          <Box sx={containerStyles}>
            <CircularProgress color="inherit" />
          </Box>
        )}
        <Box
          sx={{
            width: "255px",
            mt: 2,
            background: palette[4],
            p: 3,
            borderRadius: 5,
          }}
        >
          <Typography variant="h6">Log in with QR Code</Typography>
          <Typography variant="body2">
            Scan this QR code with any logged in phone to sign in instantly
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

/**
 * Login prompt
 */
export default function Prompt() {
  const ref: any = useRef();
  const emailRef: any = useRef();
  const params = useParams();
  const pathname = usePathname();

  const router = useRouter();

  const handleRedirect = useCallback(
    (res) => {
      mutate("/api/session");
      if (params?.close) {
        window.close();
        return;
      }

      const url = (params?.next as any) || "/";
      window.location.href = url;
      toast.dismiss();
    },
    [params]
  );

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

  // Login form
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [step, setStep] = useState(1);

  const handleSubmit = useCallback(
    async (e?: any) => {
      if (e) e.preventDefault();
      setButtonLoading(true);

      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { Credentials: "same-origin" },
          body: JSON.stringify({
            appId: window.location.pathname.split("oauth/")[1],
            email,
            password,
            twoFactorCode,
            token: captchaToken,
            ...(pathname?.includes("?application=") && {
              application: pathname?.split("?application=")?.[1],
            }),
          }),
        }).then((res) => res.json());
        setCaptchaToken("");
        if (
          res.message &&
          res.message.includes("Can't reach database server")
        ) {
          toast.error("Oh no! Our servers are down. Please try again later!");
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
          toast.error(res.message);
          setButtonLoading(false);
          return;
        }
        toast.promise(new Promise(() => {}), {
          loading: "Logging you in...",
          success: "Success!",
          error: "An error occured. Please try again later",
        });

        handleRedirect(res);
      } catch (e) {
        setStep(1);
        ref?.current?.reset();
        setButtonLoading(false);
      }
    },
    [captchaToken, email, password, twoFactorCode, handleRedirect, pathname]
  );

  useEffect(() => {
    if (captchaToken !== "" && !buttonLoading && step === 2) handleSubmit();
  }, [captchaToken, handleSubmit, buttonLoading, step]);

  const [togglePassword, setTogglePassword] = useState<boolean>(false);

  const shuffle = () => {
    setProTip(proTips[Math.floor(Math.random() * proTips.length)]);
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => emailRef?.current?.focus(), []);

  const isDark = useMediaQuery("(prefers-color-scheme: dark)");
  const palette = useColor("violet", isDark);

  return (
    <>
      <Box
        sx={{
          ...authStyles(palette).container,
          width: "800px",
          maxWidth: "100vw",
        }}
      >
        <AuthBranding mobile />
        <Box sx={{ display: "flex", gap: 4 }}>
          <Box sx={{ flexGrow: 1 }}>
            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                <Box sx={{ pt: 3 }}>
                  <Typography
                    variant="h2"
                    sx={{ mt: { xs: 3, sm: 0 } }}
                    className="font-heading"
                  >
                    Welcome back!
                  </Typography>
                  <Typography sx={{ mb: 3 }}>
                    We&apos;re so excited to see you again! Please sign in with
                    your Dysperse ID.
                  </Typography>
                  <TextField
                    inputRef={emailRef}
                    disabled={buttonLoading}
                    label="Email or username"
                    placeholder="jeffbezos"
                    value={email}
                    spellCheck={false}
                    fullWidth
                    name="text"
                    onChange={(e: any) => setEmail(e.target.value)}
                    sx={authStyles(palette).input}
                    variant="outlined"
                  />
                  <TextField
                    disabled={buttonLoading}
                    label="Password"
                    placeholder="********"
                    value={password}
                    fullWidth
                    sx={authStyles(palette).input}
                    name="password"
                    onChange={(e: any) => setPassword(e.target.value)}
                    type={togglePassword ? "text" : "password"}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <ConfirmationModal
                            title="Are you sure you want to toggle your password's visibility?"
                            question="Make sure nobody is around you 🤫"
                            callback={() => setTogglePassword(!togglePassword)}
                          >
                            <Tooltip
                              title={`${
                                togglePassword ? "Hide" : "Show"
                              } password`}
                            >
                              <IconButton
                                sx={{
                                  color: palette[11],
                                }}
                              >
                                <span className="material-symbols-outlined">
                                  {togglePassword
                                    ? "visibility_off"
                                    : "visibility"}
                                </span>
                              </IconButton>
                            </Tooltip>
                          </ConfirmationModal>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Box sx={authStyles(palette).footer}>
                    <Tooltip
                      title={
                        password.length < 8 ||
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
                          sx={authStyles(palette).submit}
                          size="large"
                          disabled={email.trim() === "" || password.length < 8}
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
              ) : step === 2 ? (
                <Box>
                  <Typography
                    variant="h2"
                    sx={{ mt: { xs: 6, sm: 0 } }}
                    className="font-heading"
                  >
                    Verifying...
                  </Typography>
                  <Typography sx={{ mb: 3 }}>
                    Hang on while we verify that you&apos;re a human.
                  </Typography>
                  <NoSsr>
                    <Turnstile
                      ref={ref}
                      siteKey="0x4AAAAAAABo1BKboDBdlv8r"
                      onError={() => {
                        ref.current?.reset();
                        toast.error("An error occured. Retrying...");
                      }}
                      onExpire={() => {
                        ref.current?.reset();
                        toast.error("Captcha expired. Retrying...");
                      }}
                      scriptOptions={{ defer: true }}
                      options={{ retry: "auto" }}
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
                        background: "#200923!important",
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
              <Box sx={{ width: "100%" }}>
                <Link
                  href={`/auth/signup${params?.close ? "?close=true" : ""}${
                    params?.next ? "?next=" + params?.next : ""
                  }`}
                  legacyBehavior
                >
                  <Button sx={authStyles(palette).link}>
                    Create an account
                  </Button>
                </Link>
                <Link
                  href={`/auth/reset-id${params?.close ? "?close=true" : ""}${
                    params?.next ? "?next=" + params?.next : ""
                  }`}
                  legacyBehavior
                >
                  <Button sx={authStyles(palette).link}>I forgot my ID</Button>
                </Link>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              width: "250px",
              flexShrink: 0,
              display: { xs: "none", sm: "block" },
            }}
          >
            <QrLogin handleRedirect={handleRedirect} />
          </Box>
        </Box>
      </Box>

      <NoSsr>
        <Box
          onClick={shuffle}
          sx={{
            transition: "all .2s",
            "&:active": {
              transform: "scale(.98)",
              transition: "none",
            },
            userSelect: "none",
            background: palette[3],
            color: palette[11],
            borderRadius: { sm: 5 },
            mx: "auto",
            maxWidth: "100vw",
            display: { xs: "none", sm: "flex" },
            overflowY: "auto",
            width: { sm: "450px" },
            p: { xs: 2 },
            mt: { sm: 2 },
            mb: 2,
            height: { xs: "100dvh", sm: "auto" },
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
    </>
  );
}
