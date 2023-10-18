"use client";

import { ErrorHandler } from "@/components/Error";
import { max, multipliers } from "@/components/Group/Storage";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Grid,
  Icon,
  Typography,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useRef } from "react";
import useSWR from "swr";
import { SpacesLayout } from "../SpacesLayout";

export default function Page() {
  const { session } = useSession();
  const router = useRouter();
  const params = useParams();
  const { id } = params as any;

  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.property.profile.color, isDark);

  const accessToken = session.properties.find(
    (property) => property.propertyId == id
  )?.accessToken;

  const { error, data } = useSWR([
    "property/storage",
    {
      propertyId: id,
      propertyAccessToken: accessToken,
    },
  ]);

  const parentRef = useRef();

  const used = data
    ? ((data._count.Task * multipliers.tasks +
        data._count.inventory * multipliers.items) /
        max) *
      100
    : 0;

  return (
    <SpacesLayout title="Storage" parentRef={parentRef}>
      {error && <ErrorHandler />}
      {data ? (
        <>
          <Box sx={{ px: 1 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {data._count.Task * multipliers.tasks +
                data._count.inventory * multipliers.items}
              /{max} credits used
            </Typography>
            <Box
              sx={{
                width: "100%",
                background: palette[5],
                height: 15,
                borderRadius: 99,
                display: "flex",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: `${
                    ((data._count.Task * multipliers.tasks) / max) * 100
                  }%`,
                  background: palette[11],
                }}
              />
              <Box
                sx={{
                  width: `${
                    ((data._count.inventory * multipliers.items) / max) * 100
                  }%`,
                  background: palette[9],
                  borderRadius: "0 20px 20px 0",
                }}
              />
            </Box>
          </Box>
          <Grid
            container
            sx={{
              mt: 2,
              "& .MuiGrid-item": {
                background: palette[2],
                border: `5px solid`,
                borderColor: palette[1],
                borderRadius: 5,
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                "& .MuiTypography-root:not(h4)": {
                  opacity: 0.7,
                },
                "& .MuiIcon-root": {
                  fontSize: "30px!important",
                  height: 45,
                  width: 45,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 999,
                  background: palette[3],
                  color: palette[11],
                },
              },
            }}
          >
            <Grid item xs={6}>
              <Box>
                <Typography variant="h4">{data._count.Task}</Typography>
                <Typography>Tasks</Typography>
              </Box>
              <Icon className="outlined">check</Icon>
            </Grid>
            <Grid item xs={6}>
              <Box>
                <Typography variant="h4">{data._count.inventory}</Typography>
                <Typography>Items</Typography>
              </Box>
              <Icon className="outlined">view_in_ar</Icon>
            </Grid>
            <Grid item xs={6}>
              <Box>
                <Typography variant="h4">{data._count.Board}</Typography>
                <Typography>Boards</Typography>
              </Box>
              <Icon className="outlined">view_kanban</Icon>
            </Grid>
            <Grid item xs={6}>
              <Box>
                <Typography variant="h4">{data._count.rooms}</Typography>
                <Typography>Rooms</Typography>
              </Box>
              <Icon className="outlined">room</Icon>
            </Grid>
          </Grid>
        </>
      ) : (
        <CircularProgress />
      )}
      {used >= 100 && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <AlertTitle>You&apos;ve used up all your storage</AlertTitle>
          <Typography>
            Clear up tasks &amp; items to increase storage. You won&apos;t be
            able to create new stuff until then
          </Typography>
        </Alert>
      )}
      {used <= 100 && used >= 75 && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          <AlertTitle>
            You&apos;ve used up more than 75% of your storage
          </AlertTitle>
          <Typography>
            Soon, you won&apos;t be able to create tasks or items. Clear any
            unnecessary items to increase storage.
          </Typography>
        </Alert>
      )}
      {data?.length === 0 && <Box>No changes made yet!</Box>}
    </SpacesLayout>
  );
}
