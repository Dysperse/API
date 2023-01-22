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
import hexToRgba from "hex-to-rgba";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { FixedSizeList as List } from "react-window";
import { useApi } from "../../hooks/useApi";
import { useStatusBar } from "../../hooks/useStatusBar";
import { colors } from "../../lib/colors";
import { ErrorHandler } from "../Error";

export function Changelog() {
  const [open, setOpen] = React.useState(false);
  useStatusBar(open);
  const { error, data } = useApi("property/inbox");

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
        {open && (
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
                background: global.user.darkMode
                  ? "hsla(240,11%,15%)"
                  : hexToRgba(colors[themeColor][50], 0.9),
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{ flexGrow: 1 }}
              >
                Changelog
              </Typography>
              <IconButton
                disableRipple
                color="inherit"
                onClick={() => setOpen(false)}
                sx={{
                  color: colors[themeColor][global.user.darkMode ? 50 : 900],
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
                  <List
                    className="List"
                    height={450}
                    itemCount={data.length}
                    itemSize={100}
                    width="100%"
                  >
                    {({ index, style }) => (
                      <>
                        <TimelineItem key={data[index].id} sx={style}>
                          <TimelineSeparator>
                            <TimelineDot
                              sx={{
                                background:
                                  colors[themeColor][
                                    global.user.darkMode ? 900 : 200
                                  ],
                              }}
                            />
                            <TimelineConnector
                              sx={{
                                background:
                                  colors[themeColor][
                                    global.user.darkMode ? 900 : 100
                                  ],
                              }}
                            />
                          </TimelineSeparator>
                          <TimelineContent>
                            <Typography gutterBottom>
                              <b>
                                {data[index].who === global.user.name
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
                  </List>
                )}
              </Timeline>

              {data && data.length === 0 && (
                <Typography
                  variant="body1"
                  sx={{
                    mt: 2,
                    background: colors[themeColor][100],
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
        sx={{
          color: "inherit",
          zIndex: 1,
          mr: 1,
          position: "absolute",
          right: "55px",

          mt: 0.2,
        }}
        onClick={() => setOpen(true)}
      >
        <Icon>history</Icon>
      </IconButton>
    </>
  );
}
