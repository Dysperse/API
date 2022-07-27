import Box from "@mui/material/Box";
import * as colors from "@mui/material/colors";
import Fab from "@mui/material/Fab";
import AddPopup from "../AddPopup";

export function FloatingActionButton() {
  return (
    <Box
      sx={{
        position: "fixed",
        zIndex: 1,
        bottom: {
          lg: "15px",
          sm: "74px",
          md: "15px",
          xs: "74px",
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
          sx={{
            borderRadius: "20px",
            px: 3,
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
              transform: "scale(.96)",
              transition: "none",
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
