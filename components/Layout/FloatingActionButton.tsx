import Box from "@mui/material/Box";
import { colors } from "../../lib/colors";
import Fab from "@mui/material/Fab";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import AddPopup from "../AddPopup";

/**
 * Floating action button
 * @returns {any}
 */
export function FloatingActionButton() {
  const trigger = useScrollTrigger();

  return global.property.role === "read-only" ? null : (
    <Box
      sx={{
        position: "fixed",
        zIndex: 1,
        transition: "bottom .3s",
        bottom: {
          lg: "15px",
          sm: "74px",
          md: "15px",
          xs: trigger ? "57px" : "74px",
        },
        right: "12px",
        display: {
          sm: "none",
        },
      }}
    >
      <AddPopup>
        <Fab
          // onMouseOver={() => setHide(false)}
          variant="extended"
          color="primary"
          disableRipple
          aria-label="add"
          disabled={
            global.property.role === "read-only" || global.itemLimitReached
          }
          sx={{
            borderRadius: "20px",
            px: 3,
            fontSize: "15px",
            boxShadow: "none",
            "&:focus-within": {
              boxShadow: "none",
            },
            backdropFilter: "blur(15px)",
            background: global.user.darkMode
              ? "rgba(57, 57, 71, .7)"
              : colors[themeColor][100],
            color: global.user.darkMode
              ? "hsl(240, 11%, 95%)"
              : colors[themeColor]["900"],
            "&:hover": {
              background: global.user.darkMode
                ? "hsl(240, 11%, 50%)"
                : colors[themeColor]["200"],
            },
            "&:focus,&:active": {
              boxShadow: "none",
              transform: "scale(.96)",
              transition: "none",
              background: global.user.darkMode
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
              marginRight: "15px",
              transition: "all .2s",
            }}
          >
            edit
          </span>
          Create
        </Fab>
      </AddPopup>
    </Box>
  );
}
