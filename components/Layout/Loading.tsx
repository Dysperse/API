import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box } from "@mui/material";

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
      }}
    />
  );
}
