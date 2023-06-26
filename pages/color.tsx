import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box } from "@mui/material";

export default function Page() {
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  return (
    <>
      <pre>{JSON.stringify(palette, null, 2)}</pre>
      <Box
        sx={{
          background: palette[1],
        }}
      >
        Hi
      </Box>
    </>
  );
}
