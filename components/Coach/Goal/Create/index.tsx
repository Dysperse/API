import { useColor, useDarkMode } from "@/lib/client/useColor";

import { useSession } from "@/lib/client/useSession";
import { Box, Icon, Typography } from "@mui/material";
import { useRouter } from "next/router";

export function CreateGoal({ isCoach = false }) {
  const router = useRouter();
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  return (
    <>
      <Box
        id="createGoalTrigger"
        onClick={() => router.push("/coach/explore")}
        sx={{
          flexShrink: 0,
          borderRadius: 5,
          flex: "0 0 70px",
          gap: 0.4,
          display: "flex",
          ...(!isCoach && { flexDirection: "column" }),
          ...(isCoach && {
            width: "100%",
            flex: "0 0 auto",
          }),

          alignItems: "center",
          overflow: "hidden",
          userSelect: "none",
          p: 1,
          transition: "transform .2s",
          "&:hover": {
            background: palette[2],
          },
          "&:active": {
            transform: "scale(.95)",
          },
        }}
      >
        <Box
          sx={{
            borderRadius: 9999,
            width: 60,
            flexShrink: 0,
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: palette[3],
            position: "relative",
          }}
        >
          <Icon className="outlined">rocket_launch</Icon>
        </Box>
        <Box sx={{ width: "100%" }}>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "nowrap",
              textAlign: isCoach ? "left" : "center",
              textOverflow: "ellipsis",
              fontSize: "13px",
              fontWeight: 300,
              overflow: "hidden",
              ...(isCoach && {
                ml: 3,
                fontSize: "20px",
                fontWeight: 700,
              }),
            }}
          >
            New goal
          </Typography>
        </Box>
      </Box>
      <Box sx={{ px: 1, flex: "0 0 40px", height: 3 }} />
    </>
  );
}
