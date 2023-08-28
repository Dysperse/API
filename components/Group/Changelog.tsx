import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import {
  Box,
  CircularProgress,
  Icon,
  IconButton,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Virtuoso } from "react-virtuoso";
import useSWR from "swr";
import { ErrorHandler } from "../Error";

export function Changelog({ disabled }) {
  const [open, setOpen] = React.useState<boolean>(false);

  const url = "";
  const { error, mutate, data } = useSWR(["property/inbox"]);
  const session = useSession();

  useHotkeys(
    "ctrl+i",
    (e) => {
      e.preventDefault();
      setOpen(true);
    },
    [open]
  );
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  return (
    <>
      <SwipeableDrawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="bottom"
      >
        {!disabled && (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                position: "sticky",
                top: 0,
                left: 0,
                p: 5,
                px: 4,
                pb: 1,
                zIndex: 9,
                width: "100%",
                background: palette[1],
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ flexGrow: 1 }}>
                Changelog
              </Typography>
              <IconButton color="inherit" onClick={() => setOpen(false)}>
                <Icon>close</Icon>
              </IconButton>
            </Box>
            <Box
              sx={{
                maxHeight: "450px",
                px: 4,
              }}
            >
              {error && (
                <ErrorHandler
                  callback={mutate}
                  error="An error occurred while trying to fetch your inbox"
                />
              )}
              {!data && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
              <Timeline
                sx={{
                  [`& .${timelineItemClasses.root}:before`]: {
                    flex: 0,
                    padding: 0,
                  },
                }}
              >
                {data && (
                  <Virtuoso
                    style={{ height: "400px", width: "100%" }}
                    totalCount={data.length}
                    itemContent={(index) => (
                      <TimelineItem key={data[index].id}>
                        <TimelineSeparator>
                          <TimelineDot
                            sx={{
                              background: palette[8],
                            }}
                          />
                          <TimelineConnector
                            sx={{
                              background: palette[8],
                            }}
                          />
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography gutterBottom>
                            <b>
                              {data[index].who === session.user.name
                                ? "You"
                                : data[index].who}
                            </b>{" "}
                            {data[index].what}
                          </Typography>
                          <Typography variant="body2">
                            {dayjs(data[index].when).fromNow()}
                          </Typography>
                        </TimelineContent>
                      </TimelineItem>
                    )}
                  />
                )}
              </Timeline>

              {data?.length === 0 && (
                <Typography
                  variant="body1"
                  sx={{
                    mt: 2,
                    background: palette[2],
                    p: 3,
                    borderRadius: 5,
                  }}
                >
                  No recent activity
                </Typography>
              )}
            </Box>
          </>
        )}
      </SwipeableDrawer>
      <IconButton
        disabled={disabled}
        sx={{
          color: "inherit",
        }}
        onClick={() => setOpen(true)}
      >
        <Icon className="outlined">schedule</Icon>
      </IconButton>
    </>
  );
}
