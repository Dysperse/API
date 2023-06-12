import { useColor } from "@/lib/client/useColor";
import { Box, CardActionArea, Icon, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";

export function DailyCheckInDrawer({ mood }) {
  const router = useRouter();
  const session = useSession();
  const palette = useColor(session.themeColor, session.user.darkMode);

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
                  background: `linear-gradient(45deg, ${palette[9]}, ${palette[3]})!important`,
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
        <Icon>arrow_forward_ios</Icon>
      </CardActionArea>
    </>
  );
}
