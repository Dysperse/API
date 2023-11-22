import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box } from "@mui/material";
import React from "react";

/**
 * @name Puller
 * @description A puller is a component that pulls in swipeable drawers from bottom of the screen.
 */
export const Puller = React.memo(function Puller({
  showOnDesktop = false,
  sx = {},
}: {
  showOnDesktop?: boolean;
  sx?: any;
}) {
  const session = useSession();
  const palette = useColor(
    session?.session?.themeColor ?? "gray",
    useDarkMode(session?.session?.user?.darkMode ?? "system")
  );

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          ...(!showOnDesktop && { display: { sm: "none" } }),
          top: 0,
          zIndex: 1,
          left: 0,
          width: "100%",
          textAlign: "center",
          py: 2,
          mb: 2,
          ...sx,
        }}
      >
        <Box
          className="puller"
          sx={{
            width: "50px",
            mx: "auto",
            height: "2px",
            background: palette[5],
          }}
        />
      </Box>
      <Box
        sx={{ display: { xs: "none", sm: "block" }, mt: showOnDesktop ? 0 : 4 }}
      />
    </>
  );
});
