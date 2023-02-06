import { Box } from "@mui/material";

/**
 * @name Puller
 * @description A puller is a component that pulls in swipeable drawers from bottom of the screen.
 */
export function Puller({ variant }: { variant?: "side" }) {
  return (
    <>
      <Box
        sx={{
          position: "sticky",
          display: { sm: "none" },
          top: 0,
          zIndex: 1,
          left: 0,
          width: "100%",
          textAlign: "center",
          py: 2,
          mb: 2,
        }}
      >
        <Box
          className={variant === "side" ? "puller-side" : "puller"}
          sx={{
            width: "50px",
            mx: "auto",
            height: "2px",
            background: global.user
              ? global.user.darkMode
                ? "hsl(240, 11%, 35%)"
                : "#ddd"
              : "#ddd",
          }}
        />
      </Box>
      <Box sx={{ display: { xs: "none", sm: "block" }, mt: 4 }} />
    </>
  );
}
