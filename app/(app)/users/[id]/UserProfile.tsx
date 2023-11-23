import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { useStatusBar } from "@/lib/client/useStatusBar";
import { Masonry } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  Icon,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { ProfilePicture } from "./ProfilePicture";
import { SpotifyCard } from "./SpotifyCard";
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
        </Masonry>
      </Box>
    </>
  );
}
