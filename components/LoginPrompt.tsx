import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import * as colors from "@mui/material/colors";
import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Typography from "@mui/material/Typography";

export default function LoginPrompt() {
  const [opacity, setOpacity] = React.useState(0);
  setTimeout(() => setOpacity(1), 2000);
  const matches = useMediaQuery("(min-width:600px)");

  if (!matches) {
    document
      .querySelector("meta[name='theme-color']")!
      .setAttribute("content", "#006a36");
  }
  return (
    <>
      {matches ? (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <Button
            disableElevation
            draggable="false"
            sx={{
              textTransform: "none",
              transform: opacity === 0 ? "scale(.98)" : "scale(1)",
              opacity: opacity,
              "& .MuiTouchRipple-rippleVisible": {
                animationDuration: ".25s!important",
              },
              transition: "all .2s",
              "&:active": {
                transform: "scale(.98)",
              },
              color: "black",
              background: colors["purple"][100],
              "&:hover": {
                background: colors["purple"][200],
              },
              borderRadius: 9,
            }}
            size="large"
            variant="contained"
            ref={(i) => i && i.click()}
            href="https://login.smartlist.tech/oauth/eccbc87e4b5ce2fe28308fd9f2a7baf3"
          >
            Click here if you're not being redirected
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background:
              "url(https://i.ibb.co/gjr2c7Y/stacked-peaks-haikei.png)",
            backgroundSize: "cover",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              p: 3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@master/img/logo/rounded.png"
              style={{ width: "50px", height: "50px" }}
            />

            <Typography
              variant="h5"
              sx={{ fontWeight: "600", textAlign: "center", color: "white" }}
            >
              Smartlist
            </Typography>
          </Box>
          <Box
            sx={{
              mt: 10,
              position: "fixed",
              bottom: 0,
              left: 0,
              p: 4,
              color: "white",
            }}
          >
            <Typography gutterBottom variant="h3" sx={{ fontWeight: "600" }}>
              Welcome to Smartlist!
            </Typography>
            <Typography>
              Log into your Smartlist account to access your home inventory and
              finances
            </Typography>
            <Button
              href="https://login.smartlist.tech/oauth/eccbc87e4b5ce2fe28308fd9f2a7baf3"
              sx={{
                borderRadius: 3,
                boxShadow: "none",
                background: "#fff!important",
                color: "#006a36 !important",
                border: "",
                mt: 3,
                textTransform: "none",
                width: "100%",
              }}
              size="large"
              variant="contained"
            >
              Log in
            </Button>
            <Button
              href="https://login.smartlist.tech/signup/eccbc87e4b5ce2fe28308fd9f2a7baf3"
              sx={{
                borderRadius: 3,
                boxShadow: "none",
                mt: 1,
                textTransform: "none",
                width: "100%",
                background: "rgba(255,255,255,.2)!important",
                transition: "none",
                color: "#fff",
                borderColor: "#fff!important",
                borderWidth: "2px!important",
              }}
              size="large"
              variant="outlined"
            >
              Sign up
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
}
