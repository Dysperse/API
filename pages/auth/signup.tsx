import { AuthBranding, Layout, authStyles } from "@/components/Auth/Layout";
import { useColor } from "@/lib/client/useColor";
import { Turnstile } from "@marsidev/react-turnstile";
import LoadingButton from "@mui/lab/LoadingButton";
import {
    Box,
    Button,
    CircularProgress,
    NoSsr,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";

/**
 * Top-level component for the signup page.
 */
export default function Prompt() {
  const router = useRouter();
  const ref: any = useRef();

  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = useCallback(() => {
    setButtonLoading(true);

    const body = {
      name,
      email,
      password,
      confirmPassword,
      captchaToken,
    };

    fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          throw new Error(res.message);
        }
        mutate("/api/session").then(() => {
          if (window.location.href.includes("close=true")) {
            window.close();
            return;
          }
          router.push(
            router.query.next
              ? "/onboarding?next=" + router.query.next
              : "/onboarding",
          );
        });
        return;
      })
      .catch((err) => {
        setButtonLoading(false);
        setStep(0);
        setCaptchaToken("");
        setAlreadySubmitted(false);
        toast.error(err.message);
      });
  }, [captchaToken, name, email, password, confirmPassword, router]);

  useEffect(() => {
    if (captchaToken && !alreadySubmitted) {
      handleSubmit();
      setAlreadySubmitted(true);
    }
  }, [captchaToken, handleSubmit, alreadySubmitted]);

  const isDark = useMediaQuery("(prefers-color-scheme: dark)");
  const palette = useColor("violet", isDark);

  return (
    <Layout>
      <Box sx={{ mb: 2 }}>
        <Box sx={authStyles(palette).container}>
          <AuthBranding mobile />
          <Box sx={{ pt: 3 }}>
            <Box sx={{ px: 1 }}>
              <Typography
                variant="h2"
                sx={{ mb: 1, mt: { xs: 3, sm: 0 } }}
                className="font-heading"
              >
                {step === 0 ? "Welcome to Dysperse!" : "Verifying..."}
              </Typography>
              <Typography sx={{ my: 2, mb: 3 }}>
                {step == 0
                  ? "Create a Dysperse ID to keep track of your lists, home inventory, and start working towards your goals!"
                  : "Hang on while we verify that you're a human."}
              </Typography>
            </Box>
            {step == 1 && (
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
                    toast.error("Expired. Retrying...");
                  }}
                  scriptOptions={{ defer: true }}
                  options={{ retry: "auto" }}
                  onSuccess={(token) => setCaptchaToken(token)}
                />
                {buttonLoading && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mt: 2,
                      gap: 2,
                    }}
                  >
                    <CircularProgress color="inherit" size={20} />
                    Almost there...
                  </Box>
                )}
              </NoSsr>
            )}
            {step === 0 && (
              <>
                <TextField
                  required
                  disabled={buttonLoading}
                  label="Your name"
                  placeholder="Jeff Bezos"
                  value={name}
                  name="name"
                  fullWidth
                  onChange={(e: any) => setName(e.target.value)}
                  sx={authStyles(palette).input}
                  variant="outlined"
                />
                <TextField
                  required
                  disabled={buttonLoading}
                  label="Your email address"
                  placeholder="jeffbezos@gmail.com"
                  value={email}
                  name="email"
                  onChange={(e: any) => setEmail(e.target.value)}
                  fullWidth
                  sx={authStyles(palette).input}
                  variant="outlined"
                />
                <TextField
                  required
                  disabled={buttonLoading}
                  label="Password"
                  value={password}
                  placeholder="********"
                  fullWidth
                  sx={authStyles(palette).input}
                  name="password"
                  type="password"
                  {...((password.length < 8 ||
                    !/\d/.test(password) ||
                    !/[a-z]/i.test(password)) && {
                    helperText: (
                      <Typography
                        sx={{
                          ["@media (prefers-color-scheme: dark)"]: {
                            color: "hsl(240,11%,90%)",
                          },
                        }}
                      >
                        Password must be more than 8 characters long, containing
                        at least one letter and number
                      </Typography>
                    ),
                  })}
                  onChange={(e: any) => setPassword(e.target.value)}
                  variant="outlined"
                />
                <TextField
                  required
                  fullWidth
                  disabled={buttonLoading}
                  type="password"
                  placeholder="********"
                  label="Repeat password"
                  value={confirmPassword}
                  sx={authStyles(palette).input}
                  name="confirmPassword"
                  onChange={(e: any) => setConfirmPassword(e.target.value)}
                  variant="outlined"
                  {...(password !== confirmPassword && {
                    helperText: (
                      <Typography
                        sx={{
                          ["@media (prefers-color-scheme: dark)"]: {
                            color: "hsl(240,11%,90%)",
                          },
                        }}
                      >
                        Passwords do not match
                      </Typography>
                    ),
                  })}
                />

                <Link
                  href={`/auth/${router.query.close ? "?close=true" : ""}${
                    router.query.next ? "?next=" + router.query.next : ""
                  }`}
                  legacyBehavior
                >
                  <Button sx={authStyles(palette).link}>
                    I already have an account
                  </Button>
                </Link>
                <Box sx={{ pb: { xs: 15, sm: 6 } }} />
                <Box sx={authStyles(palette).footer}>
                  <LoadingButton
                    loading={buttonLoading}
                    type="submit"
                    variant="contained"
                    id="_loading"
                    disableElevation
                    disableRipple
                    onClick={() => setStep(1)}
                    sx={authStyles(palette).submit}
                    disabled={
                      name.trim() === "" ||
                      email.trim() === "" ||
                      password.length < 8 ||
                      !/\d/.test(password) ||
                      !/[a-z]/i.test(password) ||
                      confirmPassword.trim().length < 8 ||
                      password !== confirmPassword
                    }
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
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
