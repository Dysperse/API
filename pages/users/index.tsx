import { ErrorHandler } from "@/components/Error";
import { useApi } from "@/lib/client/useApi";
import { useColor } from "@/lib/client/useColor";
import { useSession } from "@/lib/client/useSession";
import { Masonry } from "@mui/lab";
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Icon,
  IconButton,
  ListItemButton,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { mutate } from "swr";

function ProfilePicture({ src, name, color, size }) {
  const session = useSession();
  const palette = useColor(color, session.user.darkMode);

  return (
    <Avatar
      src={src}
      sx={{
        height: size,
        width: size,
        fontSize: size / 2.5,
        mb: 1,
        textTransform: "uppercase",
        background: `linear-gradient(${palette[9]} 30%, ${palette[6]})`,
      }}
    >
      {name.trim().charAt(0)}
      {name.trim().includes(" ")
        ? name.split(" ")[1].charAt(0)
        : name.charAt(1)}
    </Avatar>
  );
}

function shuffle<T>(array: T[]): T[] {
  const length = array.length;

  for (let i = length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function Friend({ friend }) {
  const router = useRouter();
  const session = useSession();

  // Parse the working hours string into an array of objects
  const workingHours = JSON.parse(
    friend?.following?.Profile?.workingHours || "[]"
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

  const lastLoggedIn = friend?.following?.sessions[0]?.timestamp;

  const taskDueDates = friend?.following?.properties
    ?.flatMap((obj) => obj.profile.Task)
    ?.map((task) => task.due)
    .filter((d) => d);
  // ?.filter((d) =>
  //   dayjs(d).isBetween(
  //     dayjs().startOf("day"),
  //     dayjs().endOf("day"),
  //     "day",
  //     "[]"
  //   )
  // );

  return (
    <Card
      sx={{
        borderRadius: { xs: 0, sm: 5 },
        background: {
          xs: `transparent`,
          sm: `hsl(240,11%,${session.user.darkMode ? 15 : 95}%)`,
        },
        borderBottom: {
          xs: `1px solid hsl(240,11%,${session.user.darkMode ? 15 : 95}%)`,
          sm: "",
        },
        "&:hover": {
          background: {
            xs: `transparent`,
            sm: `hsl(240,11%,${session.user.darkMode ? 17 : 93}%)`,
          },
        },
        "&:active": {
          background: {
            xs: `hsl(240,11%,${session.user.darkMode ? 15 : 95}%)`,
            sm: `hsl(240,11%,${session.user.darkMode ? 20 : 90}%)`,
          },
        },
      }}
      onClick={() => router.push(`/users/${friend?.following?.email}`)}
    >
      <CardContent sx={{ display: "flex" }}>
        <Box sx={{ flexGrow: 1 }}>
          <ProfilePicture
            size={50}
            src={friend?.following?.Profile?.picture}
            name={friend.following.name}
            color={friend?.following?.color}
          />
          <Typography variant="h6">{friend?.following?.name}</Typography>
          <Typography variant="body2">{friend?.following?.email}</Typography>
          {lastLoggedIn && (
            <Typography variant="body2">
              Last logged in{" "}
              <Tooltip title="The date listed represents when the user last logged in from a new device, not when the user was last online.">
                <span style={{ borderBottom: "1px dotted" }}>
                  {dayjs(lastLoggedIn).fromNow()}
                </span>
              </Tooltip>
            </Typography>
          )}
          <Box sx={{ gap: 1, display: "flex", mt: 1, flexWrap: "wrap" }}>
            <Chip
              size="small"
              label={friend?.following?.CoachData?.streakCount || 0}
              icon={<Icon>local_fire_department</Icon>}
            />
            <Chip
              size="small"
              label={isWorking ? "Working" : "Out of work"}
              icon={<Icon>{isWorking ? "business" : "dark_mode"}</Icon>}
            />
            {taskDueDates && taskDueDates[0] ? (
              <Chip
                size="small"
                label={`Next task ${dayjs(taskDueDates[0]).fromNow()}`}
                icon={<Icon>check_circle</Icon>}
              />
            ) : (
              <Chip
                size="small"
                label="Nothing scheduled!"
                icon={<Icon>celebration</Icon>}
              />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
function BirthdayCard({ person }) {
  const today = dayjs();
  const session = useSession();

  const router = useRouter();
  const nextBirthday = dayjs(person.Profile.birthday).year(today.year());
  const daysUntilNextBirthday =
    nextBirthday.diff(today, "day") >= 0
      ? nextBirthday.diff(today, "day")
      : nextBirthday.add(1, "year").diff(today, "day");
  const palette = useColor(person.color, session.user.darkMode);

  return (
    <Card
      key={person.email}
      sx={{
        flex: "0 0 300px",
      }}
    >
      <CardActionArea
        onClick={() => router.push(`/users/${person.email}`)}
        sx={{
          background: `linear-gradient(45deg, ${palette[6]}, ${palette[9]})`,
          color: palette[1],
          borderRadius: 5,
          display: "flex",
          gap: 2,
          justifyContent: "start",
          p: 2,
        }}
      >
        <ProfilePicture
          color={person.color}
          name={person.name}
          src={person.Profile?.picture}
          size={50}
        />
        <Box
          sx={{
            minWidth: 0,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {person.name}
          </Typography>
          <Typography>In {daysUntilNextBirthday} days</Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
}

function UpcomingBirthdays({ data }) {
  const today = dayjs();
  const session = useSession();

  const todayYear = today.year();
  const birthdays = (data?.friends || [])
    .filter((person) => person?.following?.Profile?.birthday)
    .sort((a, b) => {
      const dateA = a.following.Profile.birthday;
      const dateB = b.following.Profile.birthday;

      const nextBirthdayA = dayjs(dateA).year(todayYear);
      const nextBirthdayB = dayjs(dateB).year(todayYear);

      const days1 =
        nextBirthdayA.diff(today, "day") >= 0
          ? nextBirthdayA.diff(today, "day")
          : nextBirthdayA.add(1, "year").diff(today, "day");

      const days2 =
        nextBirthdayB.diff(today, "day") >= 0
          ? nextBirthdayB.diff(today, "day")
          : nextBirthdayB.add(1, "year").diff(today, "day");

      return days1 < days2 ? -1 : days1 > days2 ? 1 : 0;
    })
    .map((person) => person.following);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        overflowX: "scroll",
        px: { xs: 2 },
      }}
    >
      {birthdays &&
        birthdays.map((person) => (
          <BirthdayCard key={person.email} person={person} />
        ))}
    </Box>
  );
}

export default function Page() {
  const session = useSession();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 600px)");

  const { data, url, error } = useApi("user/profile/friends", {
    email: session.user.email,
    date: dayjs().startOf("day").toISOString(),
  });

  const palette = useColor(session.themeColor, session.user.darkMode);

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
        <Box sx={{ px: { sm: 2 } }}>
          {data ? (
            <>
              <ListItemButton
                sx={{
                  borderRadius: { xs: 0, sm: 3 },
                  background: {
                    sm: `hsl(240,11%,${session.user.darkMode ? 15 : 95}%)`,
                  },
                }}
                onClick={() => router.push(`/users/${session.user.email}`)}
              >
                <Avatar
                  src={data.user?.Profile?.picture}
                  sx={{
                    height: 50,
                    width: 50,
                    fontSize: 20,
                    textTransform: "uppercase",
                    background: `linear-gradient(${palette[9]} 30%, ${palette[6]})`,
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
          ) : error ? (
            <ErrorHandler
              callback={() => mutate(url)}
              error="Oh no! We couldn't get your friends! Please try again later"
            />
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
        </Box>
        <Typography variant="h6" sx={{ px: 2, mt: 3, mb: 1 }}>
          Upcoming birthdays
        </Typography>
        <UpcomingBirthdays data={data} />
        {data && data.friends.length == 0 && (
          <Box sx={{ px: 2 }}>
            <Alert severity="info">
              You aren&apos;t following anyone yet. Follow someone to view their
              birthday
            </Alert>
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
        <Box sx={{ px: { sm: 2 } }}>
          <Box sx={{ mr: isMobile ? 0 : -2 }}>
            <Masonry columns={{ xs: 1, sm: 3 }} spacing={isMobile ? 0 : 2}>
              {data &&
                data.friends &&
                shuffle(data.friends).map((friend, index) => (
                  <Friend friend={friend} key={index} />
                ))}
            </Masonry>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
