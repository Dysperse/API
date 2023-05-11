import LoadingButton from "@mui/lab/LoadingButton";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

import { Box, Button, TextField, Typography } from "@mui/material";
import { mutate } from "swr";
import { AuthBranding, Layout, authStyles } from "../../components/Auth/Layout";
import { toastStyles } from "../../lib/client/useTheme";

/**
 * Top-level component for the signup page.
 */
export default function Prompt() {
  const router = useRouter();
  // Login form
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setButtonLoading(true);
      const body = {
        name,
        email,
        password,
        confirmPassword,
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
          mutate("/api/user").then(() => {
            toast.success("Welcome to Dysperse!", toastStyles);
            router.push("/");
          });
          return;
        })
        .catch((err) => {
          setButtonLoading(false);
          toast.error(err.message, toastStyles);
        });
    },
    [name, email, password, confirmPassword, router]
  );

  return (
    <Layout>
      <Box>
        <Box sx={authStyles.container}>
          <AuthBranding mobile />
          <form onSubmit={handleSubmit}>
            <Box sx={{ pt: 3 }}>
              <Box sx={{ px: 1 }}>
                <Typography
                  variant="h3"
                  sx={{ mb: 1, mt: { xs: 3, sm: 0 } }}
                  className="font-heading"
                >
                  Welcome to Dysperse!
                </Typography>
                <Typography sx={{ my: 2, mb: 3 }}>
                  Create a Dysperse ID to keep track of your lists, home
                  inventory, and start working towards your goals!
                </Typography>
              </Box>
              <TextField
                required
                disabled={buttonLoading}
                label="Your name"
                placeholder="Jeff Bezos"
                value={name}
                name="name"
                fullWidth
                onChange={(e: any) => setName(e.target.value)}
                sx={authStyles.input}
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
                sx={authStyles.input}
                variant="outlined"
              />
              <TextField
                required
                disabled={buttonLoading}
                label="Password"
                value={password}
                placeholder="********"
                fullWidth
                sx={authStyles.input}
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
                sx={authStyles.input}
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
              <Link href="/" legacyBehavior>
                <Button sx={authStyles.link}>I already have an account</Button>
              </Link>
              <Box sx={{ pb: { xs: 15, sm: 0 } }} />
              <Box sx={authStyles.footer}>
                <LoadingButton
                  loading={buttonLoading}
                  type="submit"
                  variant="contained"
                  id="_loading"
                  disableElevation
                  disableRipple
                  sx={authStyles.submit}
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
            </Box>
          </form>
        </Box>
      </Box>
    </Layout>
  );
}
