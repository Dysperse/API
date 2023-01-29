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

export const authContainerStyles = {
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
            background: "linear-gradient(45deg, #DB94CA, #6E79C9)",
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
              color: "#200923",
              alignItems: "center",
              gap: 3,
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
                width="50"
                height="50"
                alt="logo"
                style={{
                  borderRadius: "28px",
                }}
                draggable={false}
              />
            </picture>
            <Typography variant="h6" sx={{ mt: -0.5 }}>
              Dysperse
              <Chip
                label="alpha"
                color="info"
                size="small"
                sx={{ ml: 2, px: 1, background: "#200923" }}
              />
            </Typography>
          </Box>
          {children}
        </Box>
      </ThemeProvider>
    </>
  );
}
