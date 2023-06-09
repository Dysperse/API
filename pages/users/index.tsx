import { useApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { colors } from "@/lib/colors";
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Container,
  Icon,
  IconButton,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";

function Friend({ friend }) {
  const router = useRouter();

  // Parse the working hours string into an array of objects
  const workingHours = JSON.parse(
    friend?.follower?.Profile?.workingHours || "[]"
  );

  // Get the current day of the week (1 = Monday, 2 = Tuesday, etc.)
  const currentDayOfWeek = dayjs().day();

  // Find the working hours for the current day of the week
  const currentWorkingHours = workingHours.find(
    (hours) => hours.dayOfWeek === currentDayOfWeek
  );

  // Check if the current time falls within the working hours
  const currentTime = dayjs();

  const startTime =
    currentWorkingHours &&
    dayjs().hour(currentWorkingHours.startTime).minute(0).second(0);

  const endTime =
    currentWorkingHours &&
    dayjs().hour(currentWorkingHours.endTime).minute(0).second(0);

  const isWorking =
    currentWorkingHours &&
    currentTime.isBetween(startTime, endTime, null, "[]");

  // Format the start and end times
  // const formattedStartTime = currentWorkingHours && startTime.format("HH:mm");
  // const formattedEndTime = currentWorkingHours && endTime.format("HH:mm");

  return (
    <ListItemButton
      sx={{ borderRadius: { xs: 0, sm: 3 } }}
      onClick={() => router.push(`/users/${friend?.follower?.email}`)}
    >
      <Avatar
        src={friend?.follower?.Profile?.picture}
        sx={{
          height: 50,
          width: 50,
          fontSize: 20,
          textTransform: "uppercase",
          background: `linear-gradient(${
            colors[friend?.color || "grey"][200]
          } 30%, ${colors[friend?.color || "grey"][300]})`,
        }}
      >
        {friend.follower.name.trim().charAt(0)}
        {friend.follower.name.includes(" ")
          ? friend.follower.name.split(" ")[1].charAt(0)
          : friend.follower.name.charAt(1)}
      </Avatar>
      <ListItemText
        primary={friend?.follower?.name}
        secondary={
          <Box sx={{ gap: 1, display: "flex" }}>
            <Chip
              size="small"
              label={friend?.follower?.CoachData?.streakCount || 0}
              icon={<Icon>local_fire_department</Icon>}
            />
            <Chip
              size="small"
              label={isWorking ? "Working" : "Out of work"}
              icon={<Icon>{isWorking ? "business" : "dark_mode"}</Icon>}
            />
          </Box>
        }
      />
      <Icon sx={{ ml: "auto" }}>arrow_forward_ios</Icon>
    </ListItemButton>
  );
}

export default function Page() {
  const session = useSession();
  const router = useRouter();

  const { data, error } = useApi("user/profile/friends", {
    email: session.user.email,
  });

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: `hsl(240,11%,${session.user.darkMode ? 10 : 100}%)`,
        zIndex: 999,
        overflow: "auto",
      }}
    >
      <AppBar
        position="sticky"
        sx={{
          background: `hsl(240,11%,${session.user.darkMode ? 10 : 100}%,0.5)`,
        }}
      >
        <Toolbar sx={{ gap: { xs: 1, sm: 2 } }}>
          <IconButton onClick={() => router.push("/zen")}>
            <Icon>west</Icon>
          </IconButton>
          <Typography
            sx={{
              fontWeight: 700,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Friends
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ px: { xs: "0!important", sm: "unset" } }}>
        <Typography variant="h6" sx={{ px: 2, mt: 3, mb: 1 }}>
          My profile
        </Typography>
        {data ? (
          <>
            <ListItemButton
              sx={{ borderRadius: { xs: 0, sm: 3 } }}
              onClick={() => router.push(`/users/${session.user.email}`)}
            >
              <Avatar
                src={data.user?.Profile?.picture}
                sx={{
                  height: 50,
                  width: 50,
                  fontSize: 20,
                  textTransform: "uppercase",
                  background: `linear-gradient(${
                    colors[session.themeColor][200]
                  } 30%, ${colors[session.themeColor][300]})`,
                }}
              >
                {data.user.name.trim().charAt(0)}
                {data.user.name.includes(" ")
                  ? data.user.name.split(" ")[1].charAt(0)
                  : data.user.name.charAt(1)}
              </Avatar>
              <ListItemText
                primary={session.user.name}
                secondary={session.user.email}
              />
              <Icon sx={{ ml: "auto" }}>arrow_forward_ios</Icon>
            </ListItemButton>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "100vh",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <Typography variant="h6" sx={{ px: 2, mt: 3, mb: 1 }}>
          Friends
        </Typography>
        {data && data.friends.length == 0 && (
          <Box sx={{ px: 2 }}>
            <Alert severity="info">
              You aren&apos;t following anyone yet. Follow someone to view their
              availability
            </Alert>
          </Box>
        )}
        {data &&
          data.friends &&
          data.friends.map((friend, index) => (
            <Friend friend={friend} key={index} />
          ))}
      </Container>
    </Box>
  );
}
