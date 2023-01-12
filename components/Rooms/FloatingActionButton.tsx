import { colors } from "../../lib/colors";
import AddPopup from "./CreateItem";

import { Box, Fab, useScrollTrigger } from "@mui/material";

/**
 * Floating action button
 * @returns {any}
 */
export function FloatingActionButton({ sm = false }) {
  const trigger = useScrollTrigger({
    threshold: 0,
    target: window ? window : undefined,
  });

  return global.property.role === "read-only" ? null : (
    <Box
      sx={{
        position: { xs: "fixed", sm: "unset" },
        zIndex: 1,
        transition: "bottom .3s",
        bottom: {
          lg: "15px",
          sm: "15px",
          md: "15px",
          xs: trigger ? "15px" : "85px",
        },
        right: "15px",
      }}
    >
      <AddPopup>
        <Fab
          // onMouseOver={() => setHide(false)}
          variant="extended"
          color="primary"
          disableRipple
          aria-label="add"
          sx={{
            borderRadius: "20px",
            px: sm ? 2 : 3,
            fontSize: "15px",
            boxShadow: "none",
            "&:focus-within": {
              boxShadow: "none",
            },
            width: sm ? "100%" : "auto",
            justifyContent: sm ? "start" : "center",
            backdropFilter: "blur(15px)",
            background:
              `${global.user.darkMode
                ? "rgba(57, 57, 71, .7)"
                : colors[themeColor][100]}!important`,
            color: global.user.darkMode
              ? "hsl(240, 11%, 95%)"
              : colors[themeColor]["900"],
            "&:hover": {
              background: global.user.darkMode
                ? "hsl(240, 11%, 50%)"
                : colors[themeColor]["100"],
            },
            "&:active": {
              boxShadow: "none",
              transform: "scale(.96)",
              transition: "none",
              background: global.user.darkMode
                ? "hsl(240, 11%, 60%)"
                : colors[themeColor]["100"],
            },
            transition: "transform .2s",

            py: sm ? 1 : 2,
            textTransform: "none",
            height: "auto",
            maxHeight: "auto",
          }}
        >
          <span
            className="material-symbols-rounded"
            style={{
              marginRight: "15px",
              transition: "all .2s",
            }}
          >
            edit
          </span>
          Create{sm && " an item"}
        </Fab>
      </AddPopup>
    </Box>
  );
}
