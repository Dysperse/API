import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import * as colors from "@mui/material/colors";
import Paper from "@mui/material/Paper";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import OtpInput from "react-otp-input";
import { useSWRConfig } from "swr";
import Cookies from "universal-cookie";
import { Puller } from "../components/Puller";
import { Layout } from "../components/Auth/Layout";

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
export default function Prompt() {
  global.themeColor = "brown";
  const { mutate } = useSWRConfig();
  // Login form
  const [buttonLoading, setButtonLoading] = useState(false);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState<any>("");
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
        body: new URLSearchParams({
          name: values.name,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        }),
      })
        .then((res) => res.json())
        .then(() => {
          mutate("/api/user");
          toast.success("Welcome to Carbon!");
        })
        .catch(() => {
          setButtonLoading(false);
          toast.error("An error occurred");
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
                value={otpCode}
                onChange={(value) => setOtpCode(value)}
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
            mb: 5,
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
                  Welcome to Carbon!
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  Create an account to track your home inventory, lists, notes,
                  and more!
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
                label="Password"
                value={formik.values.confirmPassword}
                sx={{ mb: 1.5 }}
                name="confirmPassword"
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

const d = () => {
  const paragraph =
    "The Apartheid system, introduced in 1948, separated the population in South Africa to four groups: Black, White, Colored, and Indian. People such as Steve Biko, Donald Woods, and Nelson Mandela fought against these policies for equality. The implementation of these policies violated multiple human rights for all people, targeted more towards people of color. ";
};
