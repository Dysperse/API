import { ProfilePicture } from "@/components/Profile/ProfilePicture";
import { SpotifyCard } from "@/components/Profile/UserProfile";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Masonry } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  Chip,
  Icon,
  IconButton,
  LinearProgress,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { memo, useEffect, useMemo, useState } from "react";

export const Friend = memo(function Friend({ mutate, friend }: any) {
  const { session } = useSession();
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
              background: `linear-gradient(${chipPalette[9]}, ${chipPalette[9]}) !important`,
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
            (friend?.Status?.text ? (
              <span
                style={{
                  display: "flex",
                  gap: "5px",
                  alignItems: "center",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <img
                  src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${friend?.Status.emoji}.png`}
                  width={20}
                  height={20}
                  style={{ flexShrink: 0 }}
                />
                <span style={{ minWidth: 0 }}>{friend?.Status?.text}</span>
              </span>
            ) : (
              "Until " + dayjs(friend?.Status?.until).format("h:mm A")
            ))
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
        PaperProps={{
          sx: {
            background: palette[1],
            maxHeight: "calc(100vh - 200px)",
            border: `2px solid ${palette[3]}`,
            m: 2,
            mx: { sm: "auto" },
            borderRadius: 5,
          },
        }}
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
          <Typography variant="body2" sx={{ mb: 2 }}>
            {friend.username && "@"}
            {friend.username || friend.email}
          </Typography>
          <Box sx={{ mr: -2 }}>
            <Masonry spacing={2} columns={{ xs: 1, sm: 2 }}>
              {friend?.Profile?.spotify ? (
                <Box>
                  <SpotifyCard
                    open={open}
                    email={friend.email}
                    styles={{
                      borderRadius: 5,
                      p: 2,
                    }}
                    profile={friend?.Profile}
                    hideIfNotPlaying
                  />
                </Box>
              ) : null}
              <Box
                sx={{
                  border: `2px solid ${palette[3]}`,
                  p: 2,
                  borderRadius: 5,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography sx={{ opacity: 0.7 }}>Local time</Typography>
                <Typography variant="h4">
                  {dayjs().tz(friend.timeZone).format("h:mm A")}
                </Typography>
                <Box sx={{ my: 0.5 }}>
                  <Chip
                    sx={{
                      display: "inline-flex",
                    }}
                    label={
                      isWithinWorkingHours
                        ? "Within working hours"
                        : "Outside working hours"
                    }
                  />
                </Box>
              </Box>
              <Box>
                {friend.Status && !isExpired && (
                  <Box
                    sx={{
                      border: `2px solid ${palette[3]}`,
                      borderRadius: 5,
                      width: "100%",
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
                )}
              </Box>
            </Masonry>
          </Box>

          <Button
            variant="contained"
            onClick={() =>
              router.push(`/users/${friend.username || friend.email}`)
            }
            fullWidth
            sx={{
              mt: 2,
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
