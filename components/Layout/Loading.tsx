import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, CircularProgress } from "@mui/material";
import { Logo } from "../Logo";

/**
 * Loading screen
 * @returns JSX.Element
 */

export function Loading(): JSX.Element {
  const { session } = useSession();

  const isDark = useDarkMode(session?.user?.darkMode || "system");
  const palette = useColor(session?.themeColor || "gray", isDark);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        WebkitAppRegion: "drag",
        left: 0,
        background: palette[1],
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        gap: 2,
        "& svg": {
          display: { xs: "none", sm: "block" },
        },
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: 5,
          background: `linear-gradient(45deg, ${palette[2]}, ${palette[3]})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Logo size={80} />
      </Box>
      <CircularProgress
        thickness={3}
        size={30}
        sx={{ animationTimingFunction: "linear" }}
      />
    </Box>
  );
}
