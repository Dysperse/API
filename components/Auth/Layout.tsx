import { Box, Chip, createTheme, Typography } from "@mui/material";
import { brown } from "@mui/material/colors";
import { ThemeProvider } from "@mui/material/styles";
import Head from "next/head";
import { Toaster } from "react-hot-toast";

const darkTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: brown[900],
    },
  },
});

export const authStyles = {
  submit: {
    background: `hsl(240,11%,85%) !important`,
    color: "#202020!important",
    "&:hover": {
      background: `hsl(240,11%,80%) !important`,
      color: "#000!important",
    },
    "&:active": {
      background: `hsl(240,11%,75%) !important`,
      color: "#000!important",
    },
    "&:disabled": {
      background: `hsl(240,11%,87%) !important`,
      color: `hsl(240,11%,60%) !important`,
    },
    [`@media (prefers-color-scheme: dark)`]: {
      background: `hsl(240,11%,15%) !important`,
      color: `hsl(240,11%,90%) !important`,
      "&:hover": {
        background: `hsl(240,11%,20%) !important`,
        color: "#fff!important",
      },
      "&:active": {
        background: `hsl(240,11%,22.5%) !important`,
        color: "#fff!important",
      },
      "&:disabled": {
        background: `hsl(240,11%,15%) !important`,
        color: `hsl(240,11%,40%) !important`,
      },
    },
    borderRadius: 3,
    ml: "auto",
    mr: { xs: 1, sm: 0 },
    mt: { sm: 1 },
    gap: 1,
    textTransform: "none",
    transition: "none",
  },
  input: {
    color: "red",
    mb: 1.5,
    [`@media (prefers-color-scheme: dark)`]: {
      "& input": {
        color: "hsl(240,11%,90%) !important",
        "&::placeholder": {
          color: "hsl(240,11%,70%) !important",
        },
      },
      "& label": {
        color: "hsl(240,11%,90%) !important",
      },
      "& label.Mui-focused": {
        color: "white",
      },
      "& .MuiInput-underline:after": {
        borderBottomColor: "hsl(240,11%,70%)",
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "hsl(240,11%,30%)",
        },
        "&:hover fieldset": {
          borderColor: "hsl(240,11%,30%)",
        },
        "&.Mui-focused fieldset": {
          borderColor: "hsl(240,11%,70%)",
        },
      },
    },
  },
  container: {
    background: "hsl(240,11%,90%)",
    [`@media (prefers-color-scheme: dark)`]: {
      background: "hsl(240,11%,10%)",
      color: "hsl(240,11%,90%)",
    },
    borderRadius: { sm: 5 },
    top: 0,
    left: 0,
    "&, & *": {
      cursor: "unset!important",
    },
    position: { xs: "fixed", sm: "unset" },
    mx: "auto",
    maxWidth: "100vw",
    overflowY: "auto",
    width: { xs: "100vw", sm: "450px" },
    p: { xs: 2, sm: 5 },
    mt: { sm: 5 },
    pt: { xs: 6, sm: 5 },
    height: { xs: "100vh", sm: "auto" },
  },
  link: {
    textTransform: "none",
    mt: 1.5,
    py: 0,
    float: "right",
    textAlign: "center",
    mx: "auto",
    color: "#505050",
    transition: "none",
    "&:hover": { color: "#000" },

    [`@media (prefers-color-scheme: dark)`]: {
      color: "hsl(240,11%,90%)",
      "&:hover": {
        color: "hsl(240,11%,100%)",
      },
    },
  },
};
/**
 * Layout for the app, including navbar, sidenav, etc
 * @param children Children
 * @returns JSX.Element
 */
export function Layout({ children }): JSX.Element {
  return (
    <>
      <Head>
        <title>Login &bull; Dysperse</title>
      </Head>
      <ThemeProvider theme={darkTheme}>
        <Box
          sx={{
            background: "hsl(240,11%,95%)",
            [`@media (prefers-color-scheme: dark)`]: {
              background: "hsl(240,11%,5%)",
            },
            position: "fixed",
            top: 0,
            left: 0,
            overflow: "scroll",
            width: "100%",
            height: "100%",
          }}
        >
          <Toaster />
          <Box
            sx={{
              display: "inline-flex",
              color: "#000",
              [`@media (prefers-color-scheme: dark)`]: {
                color: "#fff",
              },
              alignItems: "center",
              gap: 2.5,
              userSelect: "none",
              mx: 4,
              pr: 2,
              borderRadius: 4,
              mt: 4,
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:active": {
                transform: "scale(0.95)",
                transitionDuration: "0s",
              },
            }}
            onClick={() => window.open("//dysperse.com")}
          >
            <picture>
              <img
                src="https://assets.dysperse.com/v6/dark.png"
                width="45"
                height="45"
                alt="logo"
                style={{
                  borderRadius: "19px",
                }}
                draggable={false}
              />
            </picture>
            <Typography
              sx={{ fontWeight: "200!important", fontSize: "18px" }}
              component="div"
            >
              Dysperse
              <Chip
                label="alpha"
                color="info"
                size="small"
                sx={{
                  pointerEvents: "none",
                  ml: 2,
                  px: 1,
                  background: "#200923",
                  [`@media (prefers-color-scheme: dark)`]: {
                    background: "hsl(240,11%,90%)",
                    color: "hsl(240,11%,10%)",
                  },
                  fontWeight: "900",
                }}
              />
            </Typography>
          </Box>
          {children}
        </Box>
      </ThemeProvider>
    </>
  );
}
