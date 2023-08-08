import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, Icon, Typography } from "@mui/material";
import { useRouter } from "next/router";

export function CreateGoal() {
  const router = useRouter();
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  return (
    <Box
      onClick={() => router.push("/coach/create")}
      sx={{
        background: palette[3],
        borderRadius: 5,
        p: 2,
        cursor: "pointer",
        transition: "all .1s ease-in-out",
        "&:active": {
          transition: "none",
          transform: "scale(.98)",
        },
        userSelect: "none",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box>
        <Typography sx={{ fontWeight: "600" }}>Blank goal</Typography>
        <Typography variant="body2">Set a new goal from scratch</Typography>
      </Box>
      <Icon sx={{ ml: "auto" }}>add</Icon>
    </Box>
  );
}
