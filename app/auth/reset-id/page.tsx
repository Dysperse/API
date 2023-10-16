"use client";
import { AuthBranding, Layout, authStyles } from "@/components/Auth/Layout";
import { isEmail } from "@/components/Group/Members/isEmail";
import { useColor } from "@/lib/client/useColor";
import { Turnstile } from "@marsidev/react-turnstile";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  NoSsr,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

/**
 * Top-level component for the signup page.
 */
export default function Prompt() {
  const router = useRouter();
  const params = useParams();
  const ref: any = useRef();

  // Login form
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [step, setStep] = useState(0);
  const [captchaToken, setCaptchaToken] = useState("");
  const [email, setEmail] = useState("");

  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  const handleSubmit = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/reset-id", {
        method: "POST",
        body: JSON.stringify({ email: email, captchaToken }),
      });
      if (res.status === 401) {
        const f = await res.json();
        throw new Error(f.message);
      }
      toast.success("Check your email for further instructions.");
      router.push("/auth");
    } catch (e: any) {
      setStep(0);
      setButtonLoading(false);
      setAlreadySubmitted(false);
      ref.current?.reset();
      setCaptchaToken("");
      toast.error(e.message);
    }
  }, [router, email, captchaToken]);

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
      <Box>
        <Box sx={authStyles(palette).container}>
          <AuthBranding mobile />
          <Box sx={{ pt: 3 }}>
            <Box sx={{ px: 1 }}>
              <Typography
                variant="h2"
                sx={{ mb: 1, mt: { xs: 3, sm: 0 } }}
                className="font-heading"
              >
                {step === 0 ? "Forgot your password!?" : "Verifying..."}
              </Typography>
              <Typography sx={{ my: 2, mb: 3 }}>
                {step == 0
                  ? "No worries! We'll just send you an email with a link to reset your password!"
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
              </NoSsr>
            )}
            {step == 0 && (
              <>
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
                <Link
                  href={`/auth/${params?.close ? "?close=true" : ""}${
                    params?.next ? "?next=" + params?.next : ""
                  }`}
                  legacyBehavior
                >
                  <Button sx={authStyles(palette).link}>
                    Wait - I remember my password, take me back
                  </Button>
                </Link>
                <Box sx={{ pb: { xs: 15, sm: 6 } }} />
                <Box sx={authStyles(palette).footer}>
                  <LoadingButton
                    loading={buttonLoading}
                    variant="contained"
                    onClick={() => setStep(1)}
                    id="_loading"
                    disableElevation
                    disableRipple
                    sx={authStyles(palette).submit}
                    disabled={!isEmail(email)}
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
