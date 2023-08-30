import { openSpotlight } from "@/components/Layout/Navigation/Search";
import { ProfilePicture } from "@/components/Profile/ProfilePicture";
import { SpotifyCard } from "@/components/Profile/UserProfile";
import { Puller } from "@/components/Puller";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import { vibrate } from "@/lib/client/vibration";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  Chip,
  Collapse,
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  LinearProgress,
  ListItem,
  ListItemButton,
  ListItemText,
  Skeleton,
  SwipeableDrawer,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import {
  cloneElement,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { Virtuoso } from "react-virtuoso";
import useSWR from "swr";
import { GroupModal } from "../components/Group/GroupModal";

export function StatusSelector({
  children,
  profile,
  mutate,
}: {
  children?: JSX.Element;
  profile: any;
  mutate: any;
}) {
  const session = useSession();
  const now = useMemo(() => dayjs(), []);

  const url = "";
  const {
    data,
    mutate: mutateStatus,
    isLoading: isStatusLoading,
  } = useSWR(["user/status"]);

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(
    data?.status && data?.until && dayjs(data?.until).isAfter(now)
      ? data?.status
      : ""
  );
  const [time, setTime] = useState(60);
  const [loading, setLoading] = useState(false);

  const handleStatusSelect = useCallback(
    (status: string) => () => setStatus(status),
    []
  );
  const handleTimeSelect = useCallback(
    (time: number) => () => setTime(time),
    []
  );

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    await fetchRawApi(session, "user/status/set", {
      status,
      start: new Date().toISOString(),
      until: time,
      timeZone: session.user.timeZone,
      profile: JSON.stringify(profile),
      email: session.user.email,
    });
    setOpen(false);
    toast.success(
      "Status set until " + dayjs().add(time, "minute").format("h:mm A"),
      toastStyles
    );
    mutateStatus();
    mutate();
    setLoading(false);
  }, [session, status, time, url, mutate, profile, setLoading, mutateStatus]);

  const resetStatus = useCallback(
    () =>
      setStatus(
        data?.status && data?.until && dayjs(data?.until).isAfter(now)
          ? data?.status
          : ""
      ),
    [data, now]
  );

  useEffect(() => {
    if (data) {
      resetStatus();
    }
  }, [data, resetStatus]);

  const redPalette = useColor("red", useDarkMode(session.darkMode));
  const grayPalette = useColor("gray", useDarkMode(session.darkMode));
  const greenPalette = useColor("green", useDarkMode(session.darkMode));
  const orangePalette = useColor("orange", useDarkMode(session.darkMode));

  const chipPalette =
    status === "available"
      ? greenPalette
      : status === "busy"
      ? redPalette
      : status === "away"
      ? orangePalette
      : grayPalette;

  const trigger = cloneElement(
    children || (
      <LoadingButton
        loading={isStatusLoading}
        sx={{
          px: 2,
          "&, &:hover": {
            background: `linear-gradient(${chipPalette[9]}, ${chipPalette[8]}) !important`,
            color: `${chipPalette[12]} !important`,
            "&:active": {
              background: `linear-gradient(${chipPalette[8]}, ${chipPalette[9]}) !important`,
            },
          },
        }}
        variant="contained"
        size="large"
      >
        <Icon className="outlined">
          {status === "available"
            ? "check_circle"
            : status === "busy"
            ? "remove_circle"
            : status === "away"
            ? "dark_mode"
            : "circle"}
        </Icon>
        {status ? capitalizeFirstLetter(status) : "Set status"}
      </LoadingButton>
    ),
    {
      onClick: () => setOpen(true),
    }
  );

  return (
    <>
      {trigger}
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => {
          setOpen(false);
          resetStatus();
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Puller showOnDesktop />
          <Typography variant="h6" sx={{ mb: 1, px: 2 }}>
            Set status
          </Typography>
          <Box sx={{ display: "flex", overflowX: "scroll", gap: 2, px: 2 }}>
            {["available", "busy", "away", "offline"].map((_status) => (
              <Button
                key={_status}
                onClick={handleStatusSelect(_status)}
                sx={{ px: 2, flexShrink: 0 }}
                variant={_status === status ? "contained" : "outlined"}
                size="large"
              >
                {_status === status && <Icon>check</Icon>}
                {capitalizeFirstLetter(_status)}
              </Button>
            ))}
          </Box>
          <Typography variant="h6" sx={{ mb: 1, mt: 4, px: 2 }}>
            Clear after...
          </Typography>
          <Box sx={{ display: "flex", overflowX: "scroll", gap: 2, px: 2 }}>
            {[60, 120, 240, 600, 1440].map((_time) => (
              <Button
                key={_time}
                onClick={handleTimeSelect(_time)}
                sx={{ px: 2, flexShrink: 0 }}
                variant={_time === time ? "contained" : "outlined"}
                size="large"
              >
                {_time === time && <Icon>check</Icon>}
                {_time / 60} hour{_time / 60 !== 1 && "s"}
              </Button>
            ))}
          </Box>
          <Box sx={{ px: 2 }}>
            <LoadingButton
              loading={loading}
              onClick={handleSubmit}
              sx={{ px: 2, mb: 2, mx: "auto", mt: 2 }}
              variant="contained"
              fullWidth
              size="large"
              disabled={!status || !time}
            >
              Done
            </LoadingButton>
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

const Friend = memo(function Friend({ mutate, friend }: any) {
  const session = useSession();
  const router = useRouter();

  const userPalette = useColor(
    session.themeColor,
    useDarkMode(session.darkMode)
  );

  const palette = useColor(friend.color, useDarkMode(session.darkMode));
  const redPalette = useColor("red", useDarkMode(session.darkMode));
  const grayPalette = useColor("gray", useDarkMode(session.darkMode));
  const orangePalette = useColor("orange", useDarkMode(session.darkMode));
  const greenPalette = useColor("green", useDarkMode(session.darkMode));

  const isExpired =
    friend?.Status?.until && dayjs().isAfter(friend?.Status?.until);

  const isBirthday = useMemo(
    () =>
      friend?.Profile?.birthday &&
      dayjs(friend?.Profile?.birthday).format("MM DD") ===
        dayjs().format("MM DD"),
    [friend?.Profile?.birthday]
  );

  const chipPalette = useMemo(
    () =>
      isExpired
        ? grayPalette
        : friend?.Status?.status === "available"
        ? greenPalette
        : friend?.Status?.status === "busy"
        ? redPalette
        : friend?.Status?.status === "away"
        ? orangePalette
        : grayPalette,
    [
      isExpired,
      friend?.Status?.status,
      grayPalette,
      greenPalette,
      redPalette,
      orangePalette,
    ]
  );

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && isBirthday) {
      new Audio("/sfx/birthday.mp3").play();
    }
  });

  const [opacity, setOpacity] = useState(false);

  useEffect(() => {
    setOpacity(true);
  }, []);

  const friendProfile = JSON.parse(friend?.Profile?.workingHours || "[]");
  const currentDay = dayjs().tz(friend?.timeZone).day();
  const workingHours = friendProfile.find(
    (hours) => hours.dayOfWeek === currentDay
  );
  const currentHour = dayjs().tz(friend?.timeZone).hour();

  const isWithinWorkingHours =
    workingHours &&
    currentHour >= workingHours.startTime &&
    currentHour <= workingHours.endTime;

  return (
    <Box
      sx={{
        pb: 1.5,
        opacity: "0!important",
        transition: "opacity .4s",
        ...(opacity && {
          opacity: "1!important",
        }),
      }}
    >
      <ListItemButton onClick={() => setOpen(true)}>
        <Box sx={{ position: "relative" }}>
          <ProfilePicture data={friend} mutate={mutate} size={60} />
          <Box
            sx={{
              position: "absolute",
              bottom: "-5px",
              textTransform: "capitalize",
              right: "-10px",
              borderRadius: 999,
              fontSize: "13px",
              px: 1,
              boxShadow: `0 0 0 3px ${userPalette[1]}!important`,
              py: 0.1,
              background: `linear-gradient(${chipPalette[9]}, ${chipPalette[8]}) !important`,
              color: `${chipPalette[12]} !important`,
              "&:empty": {
                display: "none",
              },
            }}
          >
            {(!isExpired && friend?.Status?.status) ||
              (isWithinWorkingHours ? "" : "Away")}
          </Box>
        </Box>
        <ListItemText
          primary={capitalizeFirstLetter(friend.name)}
          secondary={
            friend?.Status &&
            !isExpired &&
            "Until " + dayjs(friend?.Status?.until).format("h:mm A")
          }
          sx={{
            ml: 1,
            "& *": {
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minWidth: 0,
            },
          }}
        />
        <Box sx={{ ml: "auto" }}>
          {isBirthday && <Chip label={<Icon sx={{ mb: -0.5 }}>cake</Icon>} />}
          <IconButton>
            <Icon>arrow_forward_ios</Icon>
          </IconButton>
        </Box>
      </ListItemButton>

      <SwipeableDrawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="bottom"
        PaperProps={{ sx: { background: palette[1] } }}
      >
        <Box
          sx={{
            background: `linear-gradient(${palette[11]}, ${palette[9]})`,
            height: "100px",
            overflow: "visible",
          }}
        >
          <Box sx={{ mt: 5, ml: 3 }}>
            <ProfilePicture data={friend} mutate={mutate} size={100} />
          </Box>
        </Box>
        <Box sx={{ p: 4, mt: 2 }}>
          {isBirthday && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Alert
                severity="success"
                icon={<Icon>cake</Icon>}
                sx={{ mb: 2, mt: 1 }}
              >
                It&apos;s{" "}
                {friend.name.includes(" ")
                  ? friend.name.split(" ")[0]
                  : friend.name}
                &apos;s birthday today!
              </Alert>
            </motion.div>
          )}

          <Typography variant="h3" className="font-heading" sx={{ mt: 1 }}>
            {friend.name}
          </Typography>
          <Typography variant="body2" sx={{}}>
            {friend.username && "@"}
            {friend.username || friend.email}
          </Typography>
          <Grid container sx={{ mx: -1 }}>
            <Grid item xs={12} sm={6} sx={{ p: 1 }}>
              <Box
                sx={{
                  background: palette[2],
                  borderRadius: 5,
                  height: "100%",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h4" sx={{ mt: "auto" }}>
                  {dayjs().tz(friend.timeZone).format("h:mm A")}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.7, mt: -1 }}>
                  Local time
                </Typography>
                <Chip
                  sx={{
                    "&, &:hover": { background: palette[4] + "!important" },
                  }}
                  label={
                    isWithinWorkingHours
                      ? "Within working hours"
                      : "Outside working hours"
                  }
                />
              </Box>
            </Grid>
            {friend.Status && !isExpired && (
              <Grid item xs={12} sm={6} sx={{ p: 1 }}>
                <Box
                  sx={{
                    background: palette[2],
                    borderRadius: 5,
                    height: "100%",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ mb: "auto" }}>
                    <Typography
                      variant="h4"
                      sx={{ mt: "auto", textTransform: "capitalize" }}
                    >
                      {(!isExpired && friend?.Status?.status) ||
                        (isWithinWorkingHours ? "" : "Away")}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    sx={{
                      my: 1,
                      background: palette[3],
                      "& .MuiLinearProgress-bar": {
                        background: palette[11],
                      },
                      height: 10,
                      borderRadius: 99,
                    }}
                    value={
                      (dayjs().diff(friend.Status.started, "minute") /
                        dayjs(friend.Status.until).diff(
                          friend.Status.started,
                          "minute"
                        )) *
                      100
                    }
                  />
                  <Typography variant="h6" sx={{ opacity: 0.7 }}>
                    Until {dayjs(friend.Status.until).format("h:mm A")}
                  </Typography>
                </Box>
              </Grid>
            )}

            {friend?.Profile?.spotify && (
              <Grid item xs={12} sm={6} sx={{ p: 1 }}>
                <SpotifyCard
                  open={open}
                  email={friend.email}
                  styles={{
                    borderRadius: 5,
                    p: 2,
                  }}
                  profile={friend?.Profile}
                  hideIfNotPlaying
                  mutate={mutate}
                />
              </Grid>
            )}
          </Grid>

          <Button
            variant="contained"
            onClick={() =>
              router.push(`/users/${friend.username || friend.email}`)
            }
            fullWidth
            sx={{
              "&, &:hover": {
                background: palette[2] + "!important",
                color: palette[11],
              },
            }}
          >
            View full profile
          </Button>
        </Box>
      </SwipeableDrawer>
    </Box>
  );
});

export function Logo({ intensity = 4, size = 45 }: any) {
  const session = useSession();

  const palette = useColor(
    session?.themeColor || "violet",
    useDarkMode(session?.darkMode || "system")
  );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      version="1"
      viewBox="0 0 375 375"
      fill={palette[intensity]}
    >
      <defs>
        <clipPath id="963808ace8">
          <path d="M37.5 37.5h300.75v300.75H37.5zm0 0"></path>
        </clipPath>
        <clipPath id="f8e32d0f6d">
          <path
            d="M187.875 37.5c0 83.05 67.324 150.375 150.375 150.375-83.05 0-150.375 67.324-150.375 150.375 0-83.05-67.324-150.375-150.375-150.375 83.05 0 150.375-67.324 150.375-150.375zm0 0"
            clipRule="evenodd"
          ></path>
        </clipPath>
      </defs>
      <g clipPath="url(#963808ace8)">
        <g clipPath="url(#f8e32d0f6d)">
          <path d="M338.25 37.5H37.5v300.75h300.75zm0 0"></path>
        </g>
      </g>
    </svg>
  );
}

function ContactSync() {
  const session = useSession();
  const { data, error } = useSWR([
    "user/profile",
    {
      email: session.user.email,
    },
  ]);

  return (
    <>
      {data && !data?.Profile?.google && (
        <Alert
          severity="info"
          sx={{
            mb: 2,
            cursor: "pointer",
            "&:active": { transform: "scale(.96)" },
            transition: "all .2s",
          }}
          onClick={() => (window.location.href = "/api/user/google/redirect")}
        >
          <Typography variant="h6">Find others you know</Typography>
          <Typography variant="body2">Tap to sync your contacts</Typography>
        </Alert>
      )}
      {data && !data?.Profile?.spotify && (
        <Alert
          severity="info"
          sx={{
            mb: 2,
            cursor: "pointer",
            "&:active": { transform: "scale(.96)" },
            transition: "all .2s",
          }}
          onClick={() => (window.location.href = "/api/user/spotify/redirect")}
        >
          <Typography variant="h6">
            Let others know what you&apos;re listening to
          </Typography>
          <Typography variant="body2">
            Tap to connect your Spotify account
          </Typography>
        </Alert>
      )}
    </>
  );
}

export function Navbar({
  showLogo = false,
  right,
  showRightContent = false,
}: {
  showLogo?: boolean;
  right?: JSX.Element;
  showRightContent?: boolean;
}) {
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const router = useRouter();

  const [showGroup, setShowGroup] = useState(router.asPath === "/");

  useEffect(() => {
    setTimeout(() => {
      setShowGroup(false);
    }, 2000);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        "& svg": {
          display: showLogo ? { sm: "none" } : "none",
        },
      }}
    >
      <Logo />
      {right}
      {(!right || showRightContent) && (
        <>
          <IconButton
            sx={{
              ml: showRightContent && right ? "" : "auto",
              color: palette[8],
              "&:active": { transform: "scale(.9)" },
              transition: "all .4s",
            }}
            onClick={openSpotlight}
          >
            <Icon className="outlined">search</Icon>
          </IconButton>
          <GroupModal list>
            <Button
              sx={{
                minWidth: "unset",
                px: showGroup ? 2 : 1,
                color: palette[showGroup ? 9 : 8],
                background: palette[showGroup ? 3 : 1],
                gap: showGroup ? 1.5 : 0,
                "&:hover": { background: "transparent" },
                "&:active": { background: palette[2] },
                transition: "all .4s!important",
              }}
              onClick={() =>
                router.push("/spaces/" + session?.property?.propertyId)
              }
            >
              <Icon className="outlined">group</Icon>
              <Collapse
                orientation="horizontal"
                in={showGroup}
                sx={{
                  whiteSpace: "nowrap",
                }}
              >
                {session.property.profile.name}
              </Collapse>
            </Button>
          </GroupModal>
          {router.asPath === "/" && (
            <IconButton
              sx={{ color: palette[8] }}
              onClick={() => router.push("/settings")}
            >
              <Icon className="outlined">settings</Icon>
            </IconButton>
          )}
        </>
      )}
    </Box>
  );
}

const HeadingComponent = ({ palette, isMobile }) => {
  const [isHover, setIsHover] = useState(false);
  const time = new Date().getHours();

  const open = () => {
    vibrate(50);
    setIsHover(true);
  };
  const close = () => {
    vibrate(50);
    setIsHover(false);
  };

  const [currentTime, setCurrentTime] = useState(dayjs().format("hh:mm:ss A"));

  useEffect(() => {
    if (isHover) {
      setCurrentTime(dayjs().format("hh:mm:ss A"));
      const interval = setInterval(() => {
        setCurrentTime(dayjs().format("hh:mm:ss A"));
      });
      return () => clearInterval(interval);
    }
  }, [isHover]);

  const getGreeting = useMemo(() => {
    if (time < 12) return "Good morning.";
    else if (time < 17) return "Good afternoon.";
    else if (time < 20) return "Good evening.";
    else return "Good night.";
  }, [time]);

  const [greeting, setGreeting] = useState(getGreeting);

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting);
    }, 1000 * 60 * 60);
    return () => clearInterval(interval);
  });

  return (
    <Typography
      className="font-heading"
      {...(isMobile
        ? {
            onTouchStart: open,
            onTouchEnd: close,
          }
        : {
            onMouseEnter: open,
            onMouseLeave: close,
          })}
      sx={{
        fontSize: {
          xs: "15vw",
          sm: "80px",
        },
        background: `linear-gradient(${palette[11]}, ${palette[5]})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        userSelect: "none",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
      variant="h4"
    >
      {isHover ? currentTime : greeting}
    </Typography>
  );
};

function SearchFriend({ mutate }) {
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const addFriend = async () => {
    try {
      const data = await fetchRawApi(session, "user/followers/follow", {
        followerEmail: session.user.email,
        followingEmail: query,
      });
      console.log(data);
      if (!data?.success) throw new Error();
      toast.success("Added friend!", toastStyles);
      setOpen(false);
      mutate();
    } catch (e) {
      toast.error(
        "Hmm... That didn't work. Make sure you typed the email or username correctly.",
        toastStyles
      );
    }
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={() => {
          setOpen(true);
          setTimeout(
            () => document.getElementById("searchFriend")?.focus(),
            50
          );
        }}
      >
        <Icon className="outlined">search</Icon>
      </Button>
      <SwipeableDrawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="bottom"
      >
        <Puller showOnDesktop />
        <Box sx={{ px: 2, pb: 2 }}>
          <TextField
            autoFocus
            fullWidth
            value={query}
            id="searchFriend"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Email or username..."
            InputProps={{
              autoFocus: true,
              startAdornment: (
                <InputAdornment position="start">
                  <Icon>alternate_email</Icon>
                </InputAdornment>
              ),
            }}
          />
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            fullWidth
            disabled={query.trim().length === 0}
            onClick={addFriend}
          >
            Add
          </Button>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

export default function Home() {
  const router = useRouter();
  const session = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const url = "";
  const { data, mutate } = useSWR([
    "user/profile/friends",
    {
      email: session.user.email,
      date: dayjs().startOf("day").toISOString(),
    },
  ]);

  const { data: profileData } = useSWR([
    "user/profile",
    {
      email: session.user.email,
    },
  ]);

  const sortedFriends = useMemo(() => {
    return (
      data?.friends &&
      data.friends.sort(({ following: friend }) => {
        if (
          friend?.Status?.status &&
          dayjs(friend?.Status?.until).isAfter(dayjs())
        )
          return -1;
        else return 1;
      })
    );
  }, [data]);

  const [isScrolling, setIsScrolling] = useState(false);

  return (
    <Box sx={{ ml: { sm: -1 } }}>
      <Navbar
        showLogo={isMobile}
        showRightContent={isMobile}
        right={
          isMobile ? undefined : (
            <IconButton
              sx={{ ml: "auto", color: palette[8] }}
              onClick={() => router.push("/settings")}
            >
              <Icon className="outlined">settings</Icon>
            </IconButton>
          )
        }
      />
      <motion.div initial={{ y: 100 }} animate={{ y: 0 }}>
        <Box
          sx={{
            pt: { xs: 7, sm: 20 },
          }}
        >
          <Box
            sx={{
              mb: { xs: 2, sm: 5 },
              px: { xs: 4, sm: 6 },
              textAlign: { sm: "center" },
            }}
          >
            <HeadingComponent palette={palette} isMobile={isMobile} />
            <Typography
              sx={{ fontWeight: 700, color: palette[8] }}
              variant="h6"
            >
              {dayjs().format("MMMM D")}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: { sm: "center" },
            overflowX: "scroll",
            maxWidth: "100%",
            px: 4,
            mb: 2,
            gap: 2,
            "& *": {
              flexShrink: 0,
            },
          }}
        >
          <SearchFriend mutate={mutate} />
          <StatusSelector mutate={mutate} profile={profileData} />
          <Button
            variant="contained"
            onClick={() =>
              router.push(
                `/users/${session.user.username || session.user.email}`
              )
            }
          >
            <Icon className="outlined">person</Icon>
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            width: "500px",
            maxWidth: "calc(100% - 40px)",
            mx: "auto",
            flexDirection: "column",
          }}
        >
          <Box>
            {data && sortedFriends?.length === 0 && (
              <Box sx={{ p: 1 }}>
                <Box
                  sx={{
                    mb: 1,
                    borderRadius: 5,
                    p: 2,
                    background: palette[2],
                    textAlign: "center",
                  }}
                >
                  Friends you add will appear here.
                </Box>
              </Box>
            )}
            {data && sortedFriends?.length > 0 ? (
              <Virtuoso
                isScrolling={setIsScrolling}
                useWindowScroll
                totalCount={sortedFriends.length}
                itemContent={(i) => (
                  <Friend
                    mutate={mutate}
                    friend={sortedFriends[i].following}
                    key={sortedFriends[i].following.email}
                  />
                )}
              />
            ) : (
              [...new Array(data ? 3 : 10)].map((_, i) => (
                <ListItem key={i} sx={{ mb: 1.5 }}>
                  <Skeleton
                    variant="circular"
                    width="60px"
                    height="60px"
                    animation={data ? false : "wave"}
                  />
                  <ListItemText
                    sx={{ ml: 1 }}
                    primary={
                      <Skeleton
                        width="100px"
                        animation={data ? false : "wave"}
                      />
                    }
                  />
                  <Skeleton
                    variant="circular"
                    width="24px"
                    height="24px"
                    animation={data ? false : "wave"}
                    sx={{ ml: "auto" }}
                  />
                </ListItem>
              ))
            )}
          </Box>
          <ContactSync />
        </Box>
        <Toolbar />
      </motion.div>
    </Box>
  );
}
