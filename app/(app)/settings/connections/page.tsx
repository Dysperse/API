"use client";

import { ConfirmationModal } from "@/components/ConfirmationModal";
import { ErrorHandler } from "@/components/Error";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { Box, Grid, Icon, IconButton, Typography } from "@mui/material";
import Image from "next/legacy/image";
import toast from "react-hot-toast";
import useSWR from "swr";
import { useColor, useDarkMode } from "../../../../lib/client/useColor";
import Layout from "../layout";

/**
 * Top-level component for the appearance settings page.
 */
export default function ConnectionsSettings() {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const { data, error, mutate } = useSWR([
    "user/profile",
    { email: session.user.email },
  ]);

  const palette = useColor(session.themeColor, isDark);

  const handleIntegrationDelete = async (name) => {
    await fetchRawApi(session, "user/profile/update", {
      [name]: "null",
      email: session.user.email,
    });
    await mutate();
    toast.success(`Disconnected ${name}!`);
  };

  const styles = (integration) => ({
    display: "flex",
    background: palette[2],
    border: "4px solid " + palette[1],
    borderRadius: 5,
    p: 3,
    alignItems: "center",
    gap: 4,
    position: "relative",
    "& .icon": {
      p: 4,
      border: "2px dashed " + palette[7],
      ...(data?.Profile?.[integration] !== null && {
        border: `2px solid ${palette[11]}`,
      }),
    },
    "& .delete": {
      position: "absolute",
      top: 0,
      right: 0,
      m: 4,
    },
    "& h3": {},
    "& h6": {
      fontSize: "15px",
    },
  });

  return (
    <Layout>
      <Box
        sx={{
          width: "100%",
          height: "100%",
        }}
      >
        {error && <ErrorHandler callback={() => mutate()} />}
        <Grid container>
          <Grid item xs={12} sx={styles("google")}>
            <IconButton href="/api/user/google/redirect" className="icon">
              <Image
                style={{ ...(!isDark && { filter: "invert(1)" }) }}
                alt="Spotify"
                src="/images/integrations/google.png?dev"
                width={50}
                height={50}
              />
            </IconButton>
            <Box>
              <Typography className="font-heading" variant="h3">
                Google
              </Typography>
              <Typography variant="h6">
                Find others you know &amp; sync your calendars
              </Typography>
              {data?.Profile?.google && (
                <ConfirmationModal
                  title="Disconnect Google?"
                  question="Are you sure you want to disconnect your Google account? You can always connect it back later"
                  callback={() => handleIntegrationDelete("google")}
                >
                  <IconButton className="delete">
                    <Icon className="outlined">delete</Icon>
                  </IconButton>
                </ConfirmationModal>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sx={styles("spotify")}>
            <IconButton href="/api/user/spotify/redirect" className="icon">
              <Image
                style={{ ...(!isDark && { filter: "invert(1)" }) }}
                alt="Spotify"
                src="/images/integrations/spotify.png"
                width={50}
                height={50}
              />
            </IconButton>
            <Box>
              <Typography className="font-heading" variant="h3">
                Spotify
              </Typography>
              <Typography variant="h6">
                Let others know what you&apos;re listening to
              </Typography>
              {data?.Profile?.spotify && (
                <ConfirmationModal
                  title="Disconnect Spotify?"
                  question="Are you sure you want to disconnect your Spotify account? You can always connect it back later"
                  callback={() => handleIntegrationDelete("spotify")}
                >
                  <IconButton className="delete">
                    <Icon className="outlined">delete</Icon>
                  </IconButton>
                </ConfirmationModal>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
