import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import * as colors from "@mui/material/colors";
import React from "react";

export default function LoginPrompt() {
  const [opacity, setOpacity] = React.useState(0);
  setTimeout(() => setOpacity(1), 2000);
  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)"
      }}
    >
      <Button
        disableElevation
        draggable="false"
        sx={{
          transform: opacity === 0 ? "scale(.98)" : "scale(1)",
          opacity: opacity,
          "& .MuiTouchRipple-rippleVisible": {
            animationDuration: ".25s!important"
          },
          transition: "all .2s",
          "&:active": {
            transform: "scale(.98)"
          },
          textTransform: "none",
          color: "black",
          background: colors["purple"][100],
          "&:hover": {
            background: colors["purple"][200]
          },
          borderRadius: 9
        }}
        size="large"
        variant="contained"
        ref={(i) => i && i.click()}
        href="https://login.smartlist.tech/oauth/eccbc87e4b5ce2fe28308fd9f2a7baf3"
      >
        Click here if you're not being redirected
      </Button>
    </Box>
  );
}
