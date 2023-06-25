import { useColor, useDarkMode } from "@/lib/client/useColor";
import { useSession } from "@/lib/client/useSession";
import { Box, CardActionArea, Icon, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import dayjs from "dayjs";
import { useRouter } from "next/router";

export function DailyCheckInDrawer({ mood }) {
  const router = useRouter();
  const session = useSession();
  const isDark = useDarkMode(session.darkMode);

  const palette = useColor(session.themeColor, isDark);

  return (
    <>
      <CardActionArea
        id="overviewTrigger"
        onClick={() => router.push("/mood-history")}
        sx={{
          display: "flex",
          "&, & *": {
            transition: "none!important",
          },
          gap: 2,
          p: 3,
          borderRadius: 5,
          borderBottomLeftRadius: 0,
          pb: 1,
          borderBottomRightRadius: 0,
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Typography
            sx={{
              fontWeight: 700,
              mb: 0.4,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            {!mood && dayjs().hour() >= 13 && (
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  background: `linear-gradient(45deg, ${palette[9]}, ${palette[11]})!important`,
                  borderRadius: 99,
                  flexShrink: 0,
                }}
              />
            )}
            Check-in
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            How are you feeling today?
          </Typography>
        </Box>
        {mood && (
          <Icon
            sx={{
              color: green[isDark ? "A400" : "A700"],
              fontSize: "30px!important",
            }}
          >
            check_circle
          </Icon>
        )}
        <Icon>arrow_forward_ios</Icon>
      </CardActionArea>
    </>
  );
}
