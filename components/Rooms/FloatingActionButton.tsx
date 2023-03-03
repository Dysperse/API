import { Box, Fab } from "@mui/material";
import { colors } from "../../lib/colors";
import { useAccountStorage, useSession } from "../../pages/_app";
import AddPopup from "./CreateItem";

/**
 * Floating action button
 * @returns {any}
 */
export function FloatingActionButton({ sm = false }) {
  const storage = useAccountStorage();
  const session = useSession();

  return session.property.role === "read-only" ? null : (
    <Box
      sx={{
        position: { xs: "fixed", sm: "unset" },
        zIndex: 1,
        transition: "bottom .3s",
        bottom: "65px",
        right: "15px",
      }}
    >
      <AddPopup>
        <Fab
          variant="extended"
          color="primary"
          disableRipple
          disabled={storage?.isReached === true}
          sx={{
            borderRadius: "20px",
            px: 3,
            fontSize: "15px",
            boxShadow: "none",
            "&:focus-within": {
              boxShadow: "none",
            },
            justifyContent: "center",
            backdropFilter: "blur(15px)",
            background: `${
              session?.user?.darkMode
                ? "rgba(57, 57, 71, .7)"
                : colors[session?.themeColor || "grey"][100]
            }!important`,
            color: session?.user?.darkMode
              ? "hsl(240, 11%, 95%)"
              : colors[session?.themeColor || "grey"]["900"],
            "&:hover": {
              background: session?.user?.darkMode
                ? "hsl(240, 11%, 50%)"
                : colors[session?.themeColor || "grey"]["100"],
            },
            "&:active": {
              boxShadow: "none",
              transform: "scale(.96)",
              transition: "none",
              background: session?.user?.darkMode
                ? "hsl(240, 11%, 60%)"
                : colors[session?.themeColor || "grey"]["100"],
            },
            transition: "transform .2s",

            py: sm ? 1.5 : 2,
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
