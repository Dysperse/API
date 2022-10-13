import Box from "@mui/material/Box";
import { brown } from "@mui/material/colors";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
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

/**
 * Layout for the app, including navbar, sidenav, etc
 * @param children Children
 * @returns JSX.Element
 */
export function Layout({ children }): JSX.Element {
  return (
    <>
      <Head>
        <title>Login &bull; Carbon</title>
      </Head>
      <ThemeProvider theme={darkTheme}>
        <Box
          sx={{
            backgroundColor: "#6b4b4b",
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
              display: "flex",
              color: "#c4b5b5",
              alignItems: "center",
              gap: "10px",
              userSelect: "none",
              px: 2,
              pt: 2,
            }}
          >
            <picture>
              <img
                src="https://i.ibb.co/F7vSQPP/Carbon-Home-inventory-and-finance-tracking-2.png"
                width="100"
                height="100"
                alt="logo"
              />
            </picture>
            <Typography variant="h5">Carbon</Typography>
          </Box>
          {children}
        </Box>
      </ThemeProvider>
    </>
  );
}
