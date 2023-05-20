import { Box, CardActionArea, Icon, Typography } from "@mui/material";
import { useRouter } from "next/router";

export function DailyCheckInDrawer({ mood }) {
  const router = useRouter();

  return (
    <>
      <CardActionArea
        id="overviewTrigger"
        onClick={() => router.push("/mood-history")}
        sx={{
          display: "flex",
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
              fontWeight: "900",
              mb: 0.4,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            {!mood && (
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  background:
                    "linear-gradient(45deg, #ff0f7b, #f89b29)!important",
                  borderRadius: 99,
                  flexShrink: 0,
                }}
              />
            )}
            How are you feeling today?
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
            Identify and track your emotions
          </Typography>
        </Box>
        <Icon>arrow_forward_ios</Icon>
      </CardActionArea>
    </>
  );
}
