"use client";
import { ProfilePicture } from "@/app/(app)/users/[id]/ProfilePicture";
import { ErrorHandler } from "@/components/Error";
import { Logo } from "@/components/Logo";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  AppBar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Icon,
  IconButton,
  Skeleton,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import Head from "next/head";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { AvailabilityCalendar } from "./AvailabilityCalendar";
import { AvailabilityViewSelector } from "./AvailabilityViewSelector";
import { AvailabilityViewer } from "./AvailabilityViewer";
import { IdentityModal } from "./IdentityModal";

export function AvailabilityPage({ eventData }) {
  const { session, isLoading: isSessionLoading } = useSession();
  const router = useRouter();
  const palette = useColor(
    session?.themeColor || "violet",
    useDarkMode(session?.darkMode || "system")
  );

  const [isSaving, setIsSaving] = useState("upToDate");
  const [view, setView] = useState(0);
  const params = useParams();
  const { data, mutate, isLoading, error } = useSWR(
    params?.id ? ["availability/event", { id: params.id }] : null
  );

  const { data: profileData } = useSWR(
    session?.user?.email
      ? ["user/profile", { email: session?.user?.email }]
      : null
  );

  useEffect(() => {
    document.documentElement.classList.add("allow-scroll");
    document.body.style.background = palette[1];
  }, [palette]);

  const [userData, setUserData] = useState(
    {
      name: session?.user?.name,
      email: session?.user?.email,
      color: session?.user?.color,
      Profile: session?.user?.Profile,
    } || { name: "", email: "" }
  );

  const isMobile = useMediaQuery(`(max-width: 600px)`);

  return (
    <Box
      sx={{
        color: palette[12],
        height: "auto",
      }}
    >
      <Head>
        <title>{`Availability for ${eventData.name} • Dysperse`}</title>
        <meta
          name="og:image"
          content={`/api/availability/event/og?id=` + eventData.id}
        />
        <meta
          name="twitter:image"
          content={`/api/availability/event/og?id=` + eventData.id}
        />
        <meta
          name="description"
          content={`What's your availability from ${dayjs(
            eventData.startDate
          ).format("MMMM Do")} to ${dayjs(eventData.endDate).format(
            "MMMM Do"
          )}? Tap to respond.`}
        />
      </Head>
      <IdentityModal
        mutate={mutate}
        setUserData={setUserData}
        userData={userData}
      />
      <AppBar
        sx={{
          position: "absolute",
          backdropFilter: "none",
          top: 0,
          left: 0,
          border: 0,
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <Logo
            onClick={() =>
              window.open(`https:////dysperse.com?utm_source=availability`)
            }
          />
          {isSaving !== "upToDate" && (
            <Chip
              {...(isMobile && { variant: "outlined" })}
              sx={{
                color: palette[9] + "!important",
                background: palette[3],
              }}
              icon={
                <Icon sx={{ color: palette[9] + "!important" }}>
                  {isSaving === "saving" ? "cloud_sync" : "cloud_done"}
                </Icon>
              }
              label={isSaving === "saving" ? "Saving..." : "Saved"}
            />
          )}
          {session && (
            <IconButton
              onClick={() => (window.location.href = "/availability")}
              sx={{ ml: "auto" }}
            >
              <Icon className="outlined">home</Icon>
            </IconButton>
          )}
          {session &&
            (profileData ? (
              <Box>
                <ProfilePicture size={30} data={profileData} />
              </Box>
            ) : (
              <Skeleton variant="circular" width={30} height={30} />
            ))}
          {!session && (
            <Button
              variant="contained"
              disabled={isLoading}
              onClick={() => document.getElementById("identity")?.click()}
              sx={{ ml: "auto" }}
            >
              {userData?.name || "Sign in"} <Icon>edit</Icon>
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100dvh",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {error && <ErrorHandler callback={mutate} />}
      {data && (
        <Grid
          container
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            flexDirection: { xs: "column", md: "row" },
            height: { xs: "unset", sm: "100dvh" },
            overflow: "hidden",
            width: "100dvw",
            pt: "var(--navbar-height)",
          }}
        >
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              width: "100%",
              display: "flex",
              mt: { xs: 5, sm: 0 },
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              pt: { sm: 6 },
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                p: { sm: 3 },
                background: { sm: palette[2] },
                border: { sm: `2px solid ${palette[4]}` },
                borderRadius: 5,
                position: "relative",
              }}
            >
              <Typography
                variant="h2"
                sx={{ color: palette[11] }}
                className="font-heading"
              >
                {data.name}
              </Typography>
              <Typography sx={{ color: palette[11], opacity: 0.7 }}>
                Tap on a time slot to mark your availability.
              </Typography>
            </Box>
            <Grid container columnSpacing={2}>
              {data.location && (
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      width: "100%",
                      p: { sm: 3 },
                      background: { sm: palette[2] },
                      border: { sm: `2px solid ${palette[4]}` },
                      borderRadius: 5,
                      position: "relative",
                    }}
                  >
                    <Typography variant="body2" sx={{ opacity: 0.6 }}>
                      WHERE
                    </Typography>
                    <Typography variant="h5">{data.location}</Typography>
                  </Box>
                </Grid>
              )}
              {data.description && (
                <Grid item xs={12} sm={6} sx={{ mt: { xs: 1, sm: 0 } }}>
                  <Box
                    sx={{
                      width: "100%",
                      p: { sm: 3 },
                      background: { sm: palette[2] },
                      border: { sm: `2px solid ${palette[4]}` },
                      borderRadius: 5,
                      position: "relative",
                    }}
                  >
                    <Typography variant="body2" sx={{ opacity: 0.6 }}>
                      DESCRIPTION
                    </Typography>
                    <Typography variant="h5">{data.description}</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: "100%",
              height: { xs: "auto", sm: "100%" },
              gap: { xs: 2, sm: 4 },
              p: { sm: 3 },
              "& .motion": {
                display: "flex",
                overflow: "hidden",
                height: { xs: "auto", sm: "100%" },
                width: "100%",
                background: palette[2],
                border: `2px solid ${palette[4]}`,
                position: "relative",
                borderRadius: 4,
              },
            }}
          >
            <AvailabilityViewSelector view={view} setView={setView} />
            {view === 0 ? (
              <AvailabilityCalendar
                userData={userData}
                setIsSaving={setIsSaving}
                data={data}
                mutate={mutate}
              />
            ) : (
              <AvailabilityViewer data={data} />
            )}
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
