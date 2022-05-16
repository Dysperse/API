import * as React from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Skeleton from "@mui/material/Skeleton";
import * as colors from "@mui/material/colors";
import AddPopup from "./AddPopup";
import Collapse from "@mui/material/Collapse";

export function FloatingActionButton() {
  const [hide, setHide] = React.useState<boolean>(false);
  window.addEventListener("scroll", () =>
    setHide(document.documentElement.scrollTop !== 0)
  );
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: {
          lg: "15px",
          sm: "70px",
          md: "15px",
          xs: "70px"
        },
        right: "12px"
      }}
    >
      <AddPopup>
        {global.session ? (
          <Fab
            variant="extended"
            color="primary"
            aria-label="add"
            sx={{
              borderRadius: "20px",
              px: 3,
              boxShadow: 0,
              fontSize: "15px",
              background:
                global.theme === "dark"
                  ? colors[themeColor]["900"]
                  : colors[themeColor][100],
              color:
                global.theme === "dark"
                  ? colors[themeColor][100]
                  : colors[themeColor]["900"],
              "&:hover": {
                background:
                  global.theme === "dark"
                    ? colors[themeColor][800]
                    : colors[themeColor]["200"]
              },
              py: 2,
              textTransform: "none",
              height: "auto",
              maxHeight: "auto"
            }}
          >
            <span
              className="material-symbols-rounded"
              style={{
                marginRight: !hide ? "15px" : "0",
                transition: "all .2s"
              }}
            >
              add
            </span>
            <Collapse orientation="horizontal" in={!hide}>
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
