import { ErrorHandler } from "@/components/Error";
import { PropertyButton } from "@/components/Layout/Navigation/PropertyButton";
import { Puller } from "@/components/Puller";
import { useSession } from "@/lib/client/session";
import { useApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { vibrate } from "@/lib/client/vibration";
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
  SwipeableDrawer,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { cloneElement, useState } from "react";
import { mutate, preload } from "swr";

function ProfilePicture({ src, name, color, size }) {
  const session = useSession();
  const isDark = useDarkMode(session.darkMode);

  const palette = useColor(color, isDark);

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
    friend?.following?.Profile?.workingHours || "[]",
  );

  // Get the current day of the week (1 = Monday, 2 = Tuesday, etc.)
  const currentDayOfWeek = dayjs().day();

  // Find the working hours for the current day of the week
  const currentWorkingHours = workingHours.find(
    (hours) => hours.dayOfWeek === currentDayOfWeek,
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
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const taskDueDates = friend?.following?.properties
    ?.flatMap((obj) => obj.profile.Task)
    ?.map((task) => task.due)
    .filter((d) => d);

  return (
    <Card
      sx={{
        borderRadius: { xs: 0, sm: 5 },
        background: {
          xs: `transparent`,
          sm: palette[2],
        },
        borderBottom: {
          xs: palette[3],
          sm: "",
        },
        "&:hover": {
          background: {
            xs: `transparent`,
            sm: palette[3],
          },
        },
        "&:active": {
          background: {
            xs: palette[3],
            sm: palette[4],
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
          {lastLoggedIn && (
            <Typography variant="body2">
              Signed in{" "}
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

  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(person.color, isDark);

  return (
    <Card
      key={person.email}
      sx={{
        flex: "0 0 300px",
        scrollSnapAlign: "center",
      }}
    >
      <CardActionArea
        onClick={() => router.push(`/users/${person.email}`)}
        sx={{
          background: `linear-gradient(45deg, ${palette[3]}, ${palette[4]})`,
          color: palette[11],
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
          <Typography>
            {dayjs(person.Profile.birthday).format("MMM D")} &bull;{" "}
            {daysUntilNextBirthday} days
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
}

function UpcomingBirthdays({ data }) {
  const today = dayjs();

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
        scrollSnapType: { xs: "x mandatory", sm: "none" },
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

export function GroupModal({
  children,
  list = false,
  useRightClick = true,
}: any) {
  const session = useSession();
  const { data, fetcher, url, error } = useApi("user/properties");
  const [showMore, setShowMore] = useState(false);

  const palette = useColor(
    session?.property?.profile?.color,
    useDarkMode(session.darkMode),
  );

  const properties = [...session.properties, ...(data || [])]
    .filter((group) => group)
    .reduce((acc, curr) => {
      if (!acc.find((property) => property.propertyId === curr.propertyId)) {
        acc.push(curr);
      }
      return acc;
    }, [])
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  preload(url, fetcher);

  const drawer = (
    <SwipeableDrawer
      onClick={(e) => e.stopPropagation()}
      anchor="bottom"
      open={showMore}
      onClose={() => setShowMore(false)}
      PaperProps={{
        sx: { px: 1.5 },
      }}
    >
      <Puller showOnDesktop />
      {properties.map((group: any) => (
        <PropertyButton
          list={list}
          handleClose={() => setShowMore(false)}
          key={group.id}
          group={group}
        />
      ))}
    </SwipeableDrawer>
  );

  const router = useRouter();

  if (children) {
    const trigger = cloneElement(children, {
      [useRightClick ? "onContextMenu" : "onClick"]: () => {
        vibrate(50);
        setShowMore(true);
      },
    });
    return (
      <>
        {trigger}
        {drawer}
      </>
    );
  }

  return (
    <>
      <Chip
        sx={{ mt: 1 }}
        label={session.property.profile.name}
        onDelete={() => setShowMore(true)}
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/groups/${session.property.propertyId}`);
        }}
        avatar={
          <Box
            sx={{
              width: 24,
              height: 24,
              background: `linear-gradient(${palette[9]}, ${palette[11]})`,
              borderRadius: 5,
            }}
          />
        }
        deleteIcon={
          <IconButton size="small">
            <Icon sx={{ color: "#fff!important" }}>sync_alt</Icon>
          </IconButton>
        }
      />
      {drawer}
    </>
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

  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  return (
    <motion.div initial={{ x: 100 }} animate={{ x: 0 }}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: palette[1],
          zIndex: 999,
          overflow: "auto",
        }}
      >
        <AppBar
          sx={{
            borderBottom: 0,
            position: "unset!important",
          }}
        >
          <Toolbar sx={{ gap: { xs: 1, sm: 2 } }}>
            <IconButton onClick={() => router.push("/")}>
              <Icon>arrow_back_ios_new</Icon>
            </IconButton>
            <IconButton
              onClick={() => router.push("/settings")}
              sx={{ ml: "auto" }}
            >
              <Icon className="outlined">settings</Icon>
            </IconButton>
            <IconButton
              sx={{ ml: { xs: -0.5, sm: -1 } }}
              onClick={() =>
                window.open(
                  "https://blog.dysperse.com/series/support?utm_source=" +
                    window.location.hostname,
                )
              }
            >
              <Icon className="outlined">help</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Container sx={{ px: { xs: "0!important", sm: "unset" } }}>
          {data ? (
            <>
              <Box sx={{ width: "100%" }}>
                <Box
                  onClick={() => router.push(`/users/${session.user.email}`)}
                  sx={{
                    maxWidth: "100vw",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "flex",
                    background: {
                      sm: `linear-gradient(${palette[3]}, ${palette[2]})`,
                    },
                    "&:hover": {
                      background: {
                        sm: `linear-gradient(${palette[2]}, ${palette[3]})`,
                      },
                      cursor: "pointer",
                    },
                    transition: "all .2s",
                    "&:active": {
                      transform: "scale(.95)",
                    },
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    mt: 2,
                    borderRadius: 5,
                    py: { xs: 2.5, sm: 5 },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      maxWidth: "100%",
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Avatar
                      src={data.user?.Profile?.picture}
                      sx={{
                        height: { xs: 120, sm: 90 },
                        width: { xs: 120, sm: 90 },
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
                    <Typography
                      variant={isMobile ? "h2" : "h1"}
                      className="font-heading"
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        width: "100%",
                        maxWidth: "300px",
                        minWidth: 0,
                      }}
                    >
                      {session.user.name}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: "100%",
                      color: palette[11],
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      minWidth: 0,
                    }}
                  >
                    {session.user.email}
                  </Typography>
                  <GroupModal />
                </Box>
              </Box>
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
          <Typography variant="h6" sx={{ px: 2, mt: 3, mb: 2 }}>
            Birthdays
          </Typography>
          <UpcomingBirthdays data={data} />
          {data && data.friends.length == 0 && (
            <Box sx={{ px: 2 }}>
              <Alert severity="info">
                You aren&apos;t following anyone yet. Follow someone to view
                their birthday
              </Alert>
            </Box>
          )}
          {data && data.friends.length == 0 && (
            <Box sx={{ px: 2 }}>
              <Alert severity="info">
                You aren&apos;t following anyone yet. Follow someone to view
                their availability
              </Alert>
            </Box>
          )}
          <Typography variant="h6" sx={{ px: 2, mt: 3, mb: 2 }}>
            Friends
          </Typography>
          <Box sx={{ px: { sm: 2 }, mt: 1 }}>
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
    </motion.div>
  );
}
