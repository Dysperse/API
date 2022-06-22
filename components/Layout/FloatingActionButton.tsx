import * as React from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Skeleton from "@mui/material/Skeleton";
import * as colors from "@mui/material/colors";
import AddPopup from "../AddPopup";
import Collapse from "@mui/material/Collapse";
import useScrollTrigger from "@mui/material/useScrollTrigger";

export function FloatingActionButton(props) {
  const { window } = props;
  var trigger;
  if (process.env.NODE_ENV === "production") {
    trigger = useScrollTrigger({
      disableHysteresis: true,
      threshold: 0,
      target: window ? window() : undefined,
    });
  } else {
    trigger = false;
  }
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: {
          lg: "15px",
          sm: "74px",
          md: "15px",
          xs: "74px",
        },
        right: "12px",
      }}
    >
      <AddPopup>
        {global.session ? (
          <Fab
            // onMouseOver={() => setHide(false)}
            variant="extended"
            color="primary"
            disableRipple
            aria-label="add"
            sx={{
              borderRadius: "20px",
              px: trigger ? 2 : 3,
              fontSize: "15px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              "&:focus-within": {
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              },
              background:
                global.theme === "dark"
                  ? "hsl(240, 11%, 40%)"
                  : colors[themeColor][100],
              color:
                global.theme === "dark"
                  ? "hsl(240, 11%, 95%)"
                  : colors[themeColor]["900"],
              "&:hover": {
                background:
                  global.theme === "dark"
                    ? "hsl(240, 11%, 50%)"
                    : colors[themeColor]["200"],
              },
              "&:active": {
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                background:
                  global.theme === "dark"
                    ? "hsl(240, 11%, 60%)"
                    : colors[themeColor]["200"],
              },
              transition: "transform .2s",

              py: 2,
              textTransform: "none",
              height: "auto",
              maxHeight: "auto",
            }}
          >
            <span
              className="material-symbols-rounded"
              style={{
                marginRight: !trigger ? "15px" : "0",
                transition: "all .2s",
              }}
            >
              edit
            </span>
            <Collapse orientation="horizontal" in={!trigger}>
              Create
            </Collapse>
          </Fab>
        ) : (
          <Skeleton
            sx={{ borderRadius: 5, mr: 1, background: "#bbb" }}
            variant="rectangular"
            width={140}
            height={60}
            animation="wave"
          />
        )}
      </AddPopup>
    </Box>
  );
}
