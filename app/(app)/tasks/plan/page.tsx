import { Avatar, Box, Icon, Typography } from "@mui/material";
import { TaskNavbar } from "../navbar";

export default function Page() {
  return (
    <Box
      sx={{
        p: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "100dvh",
        width: "100%",
      }}
    >
      <TaskNavbar title="Plan" />
      <Box sx={{ maxWidth: "500px" }}>
        <Avatar sx={{ width: 70, height: 70, borderRadius: 5, mb: 2 }}>
          <Icon className="outlined" sx={{ fontSize: "50px!important" }}>
            emoji_objects
          </Icon>
        </Avatar>
        <Typography className="font-heading" variant="h3">
          Plan my day
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.6 }}>
          Soon, you&apos;ll be able to review unfinished tasks and plan your
          daily schedule.
        </Typography>
      </Box>
    </Box>
  );
}
