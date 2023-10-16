import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { useStatusBar } from "@/lib/client/useStatusBar";
import { fetcher } from "@/pages/_apptest";
import Insights from "@/pages/tasks/insights";
import { Masonry } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  Icon,
  IconButton,
  LinearProgress,
  Skeleton,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import Image from "next/legacy/image";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { ProfilePicture } from "./ProfilePicture";
import { WorkingHours } from "./WorkingHours";

function Contacts({ profile }) {
  const { session } = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const [open, setOpen] = useState(true);

  const { data, mutate } = useSWR([
    "/user/google/contacts",
    {
      tokenObj: JSON.stringify(profile.google),
      email: session.user.email,
    },
  ]);

  return data && data.length > 0 && open ? (
    <Box
      sx={{
        border: "2px solid",
        borderColor: palette[3],
        mb: 2,
        pb: 2,
        mt: { xs: 2, sm: 0 },
        borderRadius: 5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 3,
          py: 1,
          mb: 2,
          borderBottom: `2px solid ${palette[3]}`,
        }}
      >
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Suggestions for you
        </Typography>
        <IconButton
          onClick={() => setOpen(false)}
          sx={{ background: palette[2], mr: -1 }}
        >
          <Icon>close</Icon>
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 3,
          overflowX: "auto",
          gap: 2,
        }}
      >
        {data.map((contact) => (
          <Box
            key={contact.email}
            sx={{
              width: "180px",
              flexBasis: "180px",
              background: palette[2],
              borderRadius: 5,
              gap: 1,
              p: 2,
              textAlign: "center",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <ProfilePicture data={contact} size={70} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                my: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {contact.name}
            </Typography>
            <Link href={`/users/${contact.email}`} legacyBehavior>
              <Button variant="contained">
                <Icon>person</Icon>
                Open
              </Button>
            </Link>
          </Box>
        ))}
      </Box>
    </Box>
  ) : data && data.length === 0 && window.location.href.includes("override") ? (
    <Box sx={{ pb: 2 }}>
      <Alert title="New contacts not found" variant="filled" severity="info">
        We don&apos;t have any suggestions for you right now. As you add
        contacts to your Google account, users will appear here!
      </Alert>
    </Box>
  ) : (
    <></>
  );
}

export function SpotifyCard({
  styles,
  email,
  profile,
  hideIfNotPlaying = false,
  open = false,
}: any) {
  const { data, isLoading, error } = useSWR(
    [
      "user/spotify/currently-playing",
      { spotify: JSON.stringify(profile.spotify), email },
    ],
    fetcher,
    { refreshInterval: 1000 }
  );

  if (error) return <div></div>;
  if (hideIfNotPlaying && !data?.item) return null;

  return (
    <Box
      sx={{
        ...styles,
        background: "#1db954",
        position: "relative",
        color: "#fff",
        cursor: "pointer",
        transition: "transform .2s",
        "&:hover": {
          transform: "scale(1.02)",
        },
        "&:active": {
          transform: "scale(.95)",
        },
      }}
      onClick={() =>
        window.open(
          data?.item?.external_urls?.spotify || "https://open.spotify.com"
        )
      }
    >
      {data?.item ? (
        <>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              maxWidth: "100%",
            }}
          >
            <picture>
              <img
                src={data?.item?.album.images[0].url}
                alt="Spotify album cover"
                style={{ width: "100%", display: "block" }}
              />
            </picture>

            <picture>
              <Image
                src="/images/integrations/spotify.png"
                width={45}
                height={45}
                alt="Spotify"
              />
            </picture>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              overflow: "hidden",
            }}
          >
            <Icon className="outlined" sx={{ fontSize: "40px!important" }}>
              {data.is_playing ? "pause_circle_filled" : "play_circle"}
            </Icon>
            <Box sx={{ flexGrow: 1, maxWidth: "100%", minWidth: 0, mt: 2 }}>
              <Typography
                variant="h5"
                sx={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {data.item.name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {data.item.artists.map((artist) => artist.name).join(", ")}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(data.progress_ms / data.item.duration_ms) * 100}
                sx={{
                  height: 10,
                  borderRadius: 99,
                  background: "rgba(255, 255, 255, 0.2)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 99,
                    background: "#fff",
                  },
                }}
              />
            </Box>
          </Box>
        </>
      ) : !data ||
        (data && (isLoading || data?.currently_playing_type === "ad")) ? (
        <>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Box sx={{ width: "100%" }}>
              <Box
                sx={{
                  aspectRatio: "1 / 1",
                  width: "100%",
                  background: "rgba(255,255,255,.2)",
                }}
              />
            </Box>

            <Image
              src="/images/integrations/spotify.png"
              width={45}
              height={45}
              alt="Spotify"
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              pl: 0.5,
              mt: 1,
              mb: -1,
              overflow: "hidden",
            }}
          >
            <Skeleton
              animation={false}
              variant="circular"
              width={32}
              height={32}
              sx={{ mt: 2.5 }}
            />
            <Box sx={{ flexGrow: 1, maxWidth: "100%", minWidth: 0, ml: -0.5 }}>
              <Skeleton animation={false} width="50%" height={50} />
              <Skeleton animation={false} width="80%" sx={{ mt: -0.5 }} />
              <Skeleton animation={false} width="100%" sx={{ mt: -0.5 }} />
            </Box>
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Not playing
            </Typography>

            <Image
              src="/images/integrations/spotify.png"
              width={45}
              height={45}
              alt="Spotify"
            />
          </Box>
        </>
      )}
    </Box>
  );
}

export function UserProfile({
  mutate,
  isCurrentUser,
  data,
  profileCardStyles,
}) {
  const { session } = useSession();
  const profile = data.Profile;

  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(data?.color || "gray", isDark);

  useStatusBar(palette[1]);

  return (
    <>
      <Contacts profile={profile} />
      <Box sx={{ mr: -2, pt: { xs: 2, sm: 0 } }}>
        <Masonry columns={{ xs: 1, sm: 2 }} spacing={2}>
          {profile.spotify && (
            <SpotifyCard
              open
              email={data.email}
              styles={{
                ...profileCardStyles,
                border: 0,
              }}
              profile={profile}
            />
          )}
          {data.Status && dayjs(data?.Status?.until).isAfter(dayjs()) && (
            <Box sx={profileCardStyles}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  width: 70,
                  height: 70,
                  background: palette[2],
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2">
                  {dayjs().tz(data.timeZone).format("MMM")}
                </Typography>
                <Typography variant="h5">
                  {dayjs().tz(data.timeZone).format("D")}
                </Typography>
              </Box>
              <Box sx={{ mt: 5 }} />
              <Typography sx={profileCardStyles.heading}>Right now</Typography>
              <Typography variant="h4">
                {capitalizeFirstLetter(data.Status.status)}
              </Typography>
              <LinearProgress
                variant="determinate"
                sx={{
                  my: 1,
                  height: 10,
                  borderRadius: 99,
                  background: palette[3],
                  "& *": {
                    background: palette[9] + "!important",
                  },
                }}
                value={
                  (dayjs().diff(data.Status.started, "minute") /
                    dayjs(data.Status.until).diff(
                      data.Status.started,
                      "minute"
                    )) *
                  100
                }
              />
              <Typography variant="body2">
                Until {dayjs(data.Status.until).format("h:mm A")}
              </Typography>
            </Box>
          )}
          {profile && (
            <WorkingHours
              editMode={false}
              color={data.color}
              isCurrentUser={isCurrentUser}
              mutate={mutate}
              profile={profile}
              profileCardStyles={profileCardStyles}
            />
          )}
          <Insights email={data.email} profile palette={data.color} />
        </Masonry>
      </Box>
    </>
  );
}
