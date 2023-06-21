import { useColor } from "@/lib/client/useColor";
import { useSession } from "@/lib/client/useSession";
import { Box } from "@mui/material";

/**
 * @name Puller
 * @description A puller is a component that pulls in swipeable drawers from bottom of the screen.
 */
export function Puller({
  useDarkStyles = false,
  showOnDesktop = false,
  sx = {},
}: {
  useDarkStyles?: boolean;
  showOnDesktop?: boolean;
  sx?: any;
}) {
  const session = useSession();
  const palette = useColor(
    session?.themeColor ?? "gray",
    session?.user?.darkMode ?? "false"
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
            background: palette[4],
          }}
        />
      </Box>
      <Box
        sx={{ display: { xs: "none", sm: "block" }, mt: showOnDesktop ? 0 : 4 }}
      />
    </>
  );
}
