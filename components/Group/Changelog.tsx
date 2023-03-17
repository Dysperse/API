import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import { Virtuoso } from "react-virtuoso";

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
import { useApi } from "../../lib/client/useApi";
import { colors } from "../../lib/colors";
import { useSession } from "../../pages/_app";
import { ErrorHandler } from "../Error";

export function Changelog({ disabled }) {
  const [open, setOpen] = React.useState<boolean>(false);

  const { error, data } = useApi("property/inbox");
  const session = useSession();

  useHotkeys(
    "ctrl+i",
    (e) => {
      e.preventDefault();
      setOpen(true);
    },
    [open]
  );

  return (
    <>
      <SwipeableDrawer
        ModalProps={{
          keepMounted: false,
        }}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableBackdropTransition
        disableSwipeToOpen
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
                background: session.user.darkMode
                  ? "hsla(240,11%,15%)"
                  : "rgba(255,255,255,.9)",
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ flexGrow: 1 }}>
                Changelog
              </Typography>
              <IconButton
                color="inherit"
                onClick={() => setOpen(false)}
                sx={{
                  color:
                    colors[session?.themeColor || "grey"][
                      session.user.darkMode ? 50 : 900
                    ],
                }}
              >
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
                <ErrorHandler error="An error occurred while trying to fetch your inbox" />
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
                      <>
                        <TimelineItem key={data[index].id}>
                          <TimelineSeparator>
                            <TimelineDot
                              sx={{
                                background:
                                  colors[session?.themeColor || "grey"][
                                    session.user.darkMode ? 900 : 200
                                  ],
                              }}
                            />
                            <TimelineConnector
                              sx={{
                                background:
                                  colors[session?.themeColor || "grey"][
                                    session.user.darkMode ? 900 : 100
                                  ],
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
                      </>
                    )}
                  />
                )}
              </Timeline>

              {data && data.length === 0 && (
                <Typography
                  variant="body1"
                  sx={{
                    mt: 2,
                    background: colors[session?.themeColor || "grey"][100],
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
          ml: "auto",
        }}
        onClick={() => setOpen(true)}
      >
        <Icon>history</Icon>
      </IconButton>
    </>
  );
}
