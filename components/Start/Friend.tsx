import { ProfilePicture } from "@/app/(app)/users/[id]/ProfilePicture";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Icon,
  LinearProgress,
  Skeleton,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { cloneElement, memo, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { ConfirmationModal } from "../ConfirmationModal";
import { Emoji } from "../Emoji";

function calculatePercentage(startDate, endDate) {
  // Convert the dates to timestamps (milliseconds since January 1, 1970)
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();

  // Get the current date and time
  const currentTime = new Date().getTime();

  // Calculate the time difference between the two dates
  const totalTime = endTime - startTime;

  // Calculate the time difference between the start date and the current date
  const elapsedTime = currentTime - startTime;

  // Calculate the percentage of time that has passed
  const percentage = (elapsedTime / totalTime) * 100;

  // Ensure the percentage is within the 0-100 range
  return Math.min(100, Math.max(0, percentage));
}

export function FriendPopover({ children, email }) {
  const { session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const trigger = cloneElement(children, {
    onClick: () => {
      setOpen(true);
    },
  });

  const { data, mutate } = useSWR(open ? ["user/profile", { email }] : null);

  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(data?.color || "gray", isDark);

  // refactor later...
  const redPalette = useColor("red", useDarkMode(session.darkMode));
  const grayPalette = useColor("gray", useDarkMode(session.darkMode));
  const greenPalette = useColor("green", useDarkMode(session.darkMode));
  const orangePalette = useColor("orange", useDarkMode(session.darkMode));
  const bluePalette = useColor("blue", useDarkMode(session.darkMode));

  const status = data?.Status
    ? (data.Status && !data.Status.until) ||
      dayjs(data?.Status?.until).isAfter(dayjs())
      ? data.Status
      : null
    : null;

  const chipPalette =
    status?.status === "available"
      ? greenPalette
      : status?.status === "busy"
      ? redPalette
      : status?.status === "away"
      ? orangePalette
      : status?.status === "focusing"
      ? bluePalette
      : grayPalette;
  // end refactor later

  const boxStyles = {
    border: `2px solid ${palette[4]}`,
    p: 2,
    borderRadius: 5,
    mt: 2,
  };

  const isFriend =
    data?.followers?.[0]?.accepted === true ||
    data?.following?.[0]?.accepted === true;

  const isPending =
    data?.followers?.[0]?.accepted === false ||
    data?.following?.[0]?.accepted === false;

  const handleFriend = useCallback(() => {
    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          if (isFriend) {
            fetchRawApi(session, "user/followers/unfollow", {
              followerEmail: session.user.email,
              followingEmail: data.email,
            });
          } else {
            fetchRawApi(session, "user/followers/follow", {
              followerEmail: session.user.email,
              followingEmail: data.email,
            });
          }
          await mutate();
          resolve(true);
        } catch (e) {
          reject(true);
        }
      }),
      {
        loading: "Loading...",
        success: isFriend ? "Friend removed!" : "Friend request sent!",
        error: "Something went wrong. Please try again later",
      }
    );
  }, [data, isFriend, session, mutate]);

  return (
    <>
      {trigger}
      <SwipeableDrawer
        onClick={(e) => e.stopPropagation()}
        onClose={() => setOpen(false)}
        open={open}
        anchor="bottom"
        PaperProps={{
          sx: {
            background: palette[2],
            maxHeight: "calc(100dvh - 100px)",
          },
        }}
      >
        <Box
          sx={{
            background: `linear-gradient(180deg, ${palette[9]}, ${palette[11]})`,
            minHeight: "150px",
            height: "150px",
            width: "100%",
            display: "flex",
            position: "relative",
          }}
        >
          <ConfirmationModal
            disabled={!isFriend}
            title="Remove friend?"
            question="You'll have to send a request again if you later change your mind."
            callback={handleFriend}
          >
            <Button
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                m: 3,
                color: palette[1] + "!important",
                background: "transparent!important",
                "&:active": {
                  opacity: 0.6,
                },
              }}
              size="small"
            >
              <Icon className="outlined">
                {isFriend
                  ? "person_check"
                  : isPending
                  ? "access_time"
                  : "person_add"}
              </Icon>
              {isFriend ? "Friend" : isPending ? "Pending" : "Add"}
            </Button>
          </ConfirmationModal>
          <Button
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              m: 3,
              color: palette[1] + "!important",
              background: "transparent!important",
              "&:active": {
                opacity: 0.6,
              },
            }}
            onClick={() => {
              setOpen(false);
              setTimeout(() => router.push("/users/" + email), 700);
            }}
            size="small"
          >
            Full profile <Icon>north_east</Icon>
          </Button>
          <Box
            sx={{
              width: 90,
              height: 90,
              boxShadow: `0 0 0 5px ${palette[2]}`,
              borderRadius: 999,
              position: "absolute",
              bottom: -45,
              left: 25,
              background: palette[9],
            }}
          >
            {data ? (
              <ProfilePicture data={data} size={90} />
            ) : (
              <Skeleton width={90} height={90} variant="circular" />
            )}
            {status && (
              <Chip
                label={capitalizeFirstLetter(status.status)}
                sx={{
                  background: `linear-gradient( ${chipPalette[9]}, ${chipPalette[8]})!important`,
                  position: "absolute",
                  bottom: "0px",
                  right: "-50px",
                  maxWidth: "100dvw",
                  boxShadow: `0 0 0 4px ${palette[2]}!important`,
                  color: chipPalette[12],
                }}
                icon={
                  <Icon sx={{ color: "inherit!important" }}>
                    {data.Status.status === "available"
                      ? "check_circle"
                      : data.Status.status === "busy"
                      ? "remove_circle"
                      : data.Status.status === "away"
                      ? "dark_mode"
                      : data.Status.status === "focusing"
                      ? "target"
                      : "circle"}
                  </Icon>
                }
              />
            )}
          </Box>
        </Box>
        <Box sx={{ p: 3, pt: 2, mt: "45px", color: palette[12] }}>
          <Typography
            variant="h3"
            className="font-heading"
            sx={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              maxWidth: "100%",
            }}
          >
            {data?.name}
          </Typography>
          {data ? (
            <Typography
              variant="h6"
              sx={{
                opacity: 0.8,
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                maxWidth: "100%",
              }}
            >
              {data.username && "@"}
              {data.username || data.email}
            </Typography>
          ) : (
            <Skeleton />
          )}
          {data ? (
            <Typography
              sx={{
                opacity: 0.8,
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                maxWidth: "100%",
                ...(dayjs(data.lastActive).toISOString() ===
                  "2023-10-07T17:23:03.871Z" && {
                  display: "none",
                }),
              }}
            >
              Active{" "}
              {dayjs(data.lastActive).isAfter(dayjs()) ||
              dayjs(data.lastActive).fromNow() == "a few seconds ago"
                ? "now"
                : dayjs(data.lastActive).fromNow()}
            </Typography>
          ) : (
            <Skeleton />
          )}
          <Box
            sx={{
              ...boxStyles,
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Chip
              sx={{ background: palette[3] + "!important", color: palette[12] }}
              icon={<Icon>access_time</Icon>}
              label={dayjs().tz(data?.timeZone).format("h:mm A")}
            />
            <Chip
              sx={{ background: palette[3] + "!important", color: palette[12] }}
              icon={<Icon>cake</Icon>}
              label={dayjs(data?.Profile?.birthday)
                .tz(data?.timeZone)
                .format("MMMM Do")}
            />
          </Box>
          {status && data?.Status?.emoji !== "null" ? (
            <Box sx={boxStyles}>
              <Typography sx={{ opacity: 0.6 }}>
                STATUS&nbsp;&bull;&nbsp;UNTIL&nbsp;
                {dayjs(data.Status.until).format("h:mm A")}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                <Emoji
                  emoji={data.Status.emoji}
                  size={24}
                  style={{ verticalAlign: "middle", marginRight: "5px" }}
                />
                {data.Status.text}
              </Typography>
            </Box>
          ) : data ? null : (
            <Skeleton />
          )}
          {data?.bio ? (
            <Box sx={boxStyles}>
              <Typography sx={{ opacity: 0.6 }}>BIO</Typography>
              <Typography sx={{ mt: 1 }}>{data.Profile.bio}</Typography>
            </Box>
          ) : data ? null : (
            <Skeleton />
          )}
          {data?.Profile?.hobbies && data?.Profile?.hobbies.length > 0 ? (
            <Box sx={boxStyles}>
              <Typography sx={{ opacity: 0.6 }}>HOBBIES</Typography>
              <Box
                sx={{ display: "flex", gap: 1.5, mt: 0.5, flexWrap: "wrap" }}
              >
                {data.Profile.hobbies.map((hobby) => (
                  <Chip
                    sx={{
                      background: palette[3] + "!important",
                      color: palette[12],
                    }}
                    key={hobby}
                    label={capitalizeFirstLetter(hobby)}
                  />
                ))}
              </Box>
            </Box>
          ) : data ? null : (
            <Skeleton />
          )}
        </Box>
      </SwipeableDrawer>
    </>
  );
}

function FocusText({ started }) {
  const [currentTime, setCurrentTime] = useState(dayjs());

  const formatTimeAgo = (currentTime) => {
    const diff = currentTime.diff(started, "second");
    const hours = String(Math.floor(diff / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((diff % 3600) / 60));
    const seconds = String(diff % 60).padStart(2, "0");
    return `${hours !== "00" ? `${hours}:` : ""}${minutes}:${seconds}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs()); // Update the current time every second
    }, 1000);

    return () => {
      clearInterval(interval); // Clear the interval when the component unmounts
    };
  }, []);

  return (
    <Typography sx={{ display: "flex", gap: 2, opacity: 0.6 }}>
      Focusing for {formatTimeAgo(currentTime)}
    </Typography>
  );
}

export const Friend = memo(function Friend({ mutate, friend }: any) {
  const { session } = useSession();
  const router = useRouter();
  const isDark = useDarkMode(session.darkMode);
  const userPalette = useColor(session.themeColor, isDark);

  const status = friend?.Status
    ? (friend.Status && !friend.Status.until) ||
      dayjs(friend?.Status?.until).isAfter(dayjs())
      ? friend.Status
      : null
    : null;
  // refactor later...
  const redPalette = useColor("red", useDarkMode(session.darkMode));
  const grayPalette = useColor("gray", useDarkMode(session.darkMode));
  const greenPalette = useColor("green", useDarkMode(session.darkMode));
  const orangePalette = useColor("orange", useDarkMode(session.darkMode));
  const bluePalette = useColor("blue", useDarkMode(session.darkMode));

  const chipPalette =
    status?.status === "available"
      ? greenPalette
      : status?.status === "busy"
      ? redPalette
      : status?.status === "away"
      ? orangePalette
      : status?.status === "focusing"
      ? bluePalette
      : grayPalette;
  // end refactor later

  return (
    <motion.div initial={{ scaleX: 1.05 }} animate={{ scaleX: 1 }}>
      <Box sx={{ pb: 2 }}>
        <FriendPopover email={friend.email}>
          <Card
            onClick={() => {
              router.push("/users/" + (friend.username || friend.email));
            }}
            sx={{
              background: userPalette[2],
              borderRadius: 5,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                gap: 2,
                zIndex: 99,
                position: "sticky",
                alignItems: "center",
              }}
            >
              <Badge
                variant="dot"
                badgeContent={1}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                sx={{
                  "& .MuiBadge-badge": {
                    background: chipPalette[9],
                    border: `4px solid ${userPalette[status ? 3 : 2]}`,
                    ...((!status &&
                      dayjs(friend.lastActive).isAfter(dayjs())) ||
                    dayjs(friend.lastActive).fromNow() == "a few seconds ago"
                      ? {
                          background: chipPalette[9],
                        }
                      : !status && {
                          boxShadow: `0 0 0 2px inset ${chipPalette[9]}`,
                          background: userPalette[2],
                        }),
                    width: 20,
                    height: 20,
                    borderRadius: 99,
                    transform: "translate(3px, 3px)",
                  },
                }}
              >
                <ProfilePicture
                  data={friend}
                  size={50}
                  sx={{ flexShrink: 0 }}
                />
              </Badge>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">
                  {friend.name.split(" ")?.[0]}
                </Typography>
                {status?.emoji && status?.emoji !== "null" ? (
                  <>
                    <Typography sx={{ display: "flex", gap: 2 }}>
                      <Emoji
                        emoji={status.emoji}
                        size={24}
                        style={{ marginTop: "4px" }}
                      />
                      {status.text}
                    </Typography>
                  </>
                ) : status?.status === "focusing" ? (
                  <FocusText started={status.started} />
                ) : (
                  // this is when i updated the database
                  dayjs(friend.lastActive).toISOString() !==
                    "2023-10-07T17:23:03.871Z" && (
                    <Typography sx={{ display: "flex", gap: 2, opacity: 0.6 }}>
                      Active{" "}
                      {dayjs(friend.lastActive).isAfter(dayjs()) ||
                      dayjs(friend.lastActive).fromNow() == "a few seconds ago"
                        ? "now"
                        : dayjs(friend.lastActive).fromNow()}
                    </Typography>
                  )
                )}
              </Box>
            </CardContent>
            {status && (
              <LinearProgress
                sx={{
                  width: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  borderRadius: 0,
                  background: userPalette[3],
                  "& *": {
                    background: userPalette[5] + "!important",
                  },
                }}
                variant="determinate"
                value={calculatePercentage(
                  new Date(status.started),
                  new Date(status.until)
                )}
              />
            )}
          </Card>
        </FriendPopover>
      </Box>
    </motion.div>
  );
});
