import { useColor } from "@/lib/client/useColor";
import { useSession } from "@/lib/client/useSession";
import { Box } from "@mui/material";

export default function Page() {
  const session = useSession();
  const palette = useColor(session.themeColor, session.user.darkMode);

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
