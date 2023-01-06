import LoadingButton from "@mui/lab/LoadingButton";
import dayjs from "dayjs";
import hexToRgba from "hex-to-rgba";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import { useSWRConfig } from "swr";
import { fetchApiWithoutHook, useApi } from "../../hooks/useApi";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { useStatusBar } from "../../hooks/useStatusBar";
import { colors } from "../../lib/colors";
import { House } from "../../types/houseProfile";
import { ErrorHandler } from "../Error";
import { EditProperty } from "./EditProperty";
import { UpgradeBanner } from "./ItemBanner";
import { MemberList } from "./MemberList";

import {
  Box,
  Chip,
  CircularProgress,
  Drawer,
  Icon,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";

function Changelog({ house }) {
  const [open, setOpen] = React.useState(false);
  useStatusBar(open);
  const { error, data } = useApi("property/inbox");
  useHotkeys(
    "ctrl+i",
    (e) => {
      e.preventDefault();
      setOpen(false);
      setOpen(!open);
    },
    [open]
  );
  return (
    <>
      <SwipeableDrawer
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        anchor="bottom"
        PaperProps={{
          sx: {
            borderRadius: "20px 20px 0px 0px",
            maxWidth: "500px",
          },
        }}
      >
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
            background: hexToRgba(
              colors[themeColor][global.theme == "dark" ? 900 : 50],
              0.9
            ),
          }}
        >
          <Typography
            variant="h5"
            className="font-secondary"
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
              color: colors[themeColor][global.theme == "dark" ? 50 : 900],
            }}
          >
            <Icon>close</Icon>
          </IconButton>
        </Box>
        <Box
          sx={{
            p: 4,
            pt: 2,
            maxHeight: "70vh",
            overflowY: "scroll",
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
            {data &&
              data.map((item) => (
                <TimelineItem key={item.id}>
                  <TimelineSeparator>
                    <TimelineDot
                      sx={{
                        background:
                          colors[themeColor][
                            global.theme == "dark" ? 900 : 200
                          ],
                      }}
                    />
                    <TimelineConnector
                      sx={{
                        background:
                          colors[themeColor][
                            global.theme == "dark" ? 900 : 100
                          ],
                      }}
                    />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography gutterBottom>
                      <b>{item.who === global.user.name ? "You" : item.who}</b>{" "}
                      {item.what}
                    </Typography>
                    <Typography variant="body2">
                      {dayjs(item.when).fromNow()}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
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
      </SwipeableDrawer>
      <IconButton
        disableRipple
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

/**
 * House popup
 * @param {any} {handleClose}
 * @param {any} {data}
 * @returns {any}
 */
export function Group({
  handleClose,
  data,
}: {
  handleClose: () => void;
  data: House;
}): JSX.Element {
  const [open, setOpen] = React.useState(false);
  useStatusBar(open, 1);
  const [editMode, setEditMode] = React.useState(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [color, setColor] = React.useState<string>(data.profile.color ?? "red");
  const [propertyType, setPropertyType] = React.useState(
    global.property.profile.type
  );

  const { mutate } = useSWRConfig();
  useEffect(() => {
    document
      .querySelector(`meta[name="theme-color"]`)
      ?.setAttribute(
        "content",
        open
          ? editMode
            ? colors[color][100]
            : colors[color]["A400"]
          : colors[themeColor][100]
      );
  }, [color, editMode, open]);

  useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });
  const router = useRouter();

  const invertColors = ["lime", "green", "teal", "blue"].includes(color);

  return (
    <>
      <ListItem
        disableRipple
        button
        id={
          data.propertyId === global.property.propertyId ? "activeProperty" : ""
        }
        onClick={() => {
          if (data.propertyId === global.property.propertyId) {
            setOpen(true);
          } else {
            router.push("/tasks");
            setLoading(true);
            fetchApiWithoutHook("property/join", {
              email: global.user.email,
              accessToken1: data.accessToken,
            })
              .then((res) => {
                toast(
                  <>
                    Currently viewing&nbsp;&nbsp;&nbsp;<u>{res.profile.name}</u>
                  </>
                );
                mutate("/api/user");
                setLoading(false);
                handleClose();
              })
              .catch(() => {
                toast.error(
                  "An error occured while trying to switch properties!"
                );
                setLoading(false);
              });
          }
        }}
        sx={{
          transition: "none",
          "& .MuiListItem-root": { transition: "all .1s" },
          "&:active .MuiListItem-root": {
            transform: "scale(.98)",
          },
          "&:active": {
            background: `${
              colors[themeColor][global.user.darkMode ? 800 : 100]
            }!important`,
          },
          ...(data.propertyId === global.property.propertyId && {
            background: global.user.darkMode
              ? "hsl(240,11%,25%)"
              : `${colors[themeColor][100]}!important`,
            "&:active": {
              background: global.user.darkMode
                ? "hsl(240,11%,25%)"
                : `${colors[themeColor][200]}!important`,
            },
          }),
        }}
      >
        <ListItem sx={{ gap: 1.5, px: 0, py: 0 }}>
          <ListItemAvatar sx={{ width: "auto", minWidth: "auto" }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "100%",
                backgroundColor: colors[data.profile.color]["A400"],
                marginRight: 1,
              }}
            />
          </ListItemAvatar>
          <ListItemText
            primary={
              <>
                <Typography variant="h6" sx={{ fontWeight: "600" }}>
                  {data.profile.name}
                </Typography>
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 1,
                  }}
                >
                  <Icon className="outlined">
                    {data.profile.type === "dorm"
                      ? "cottage"
                      : data.profile.type === "apartment"
                      ? "location_city"
                      : data.profile.type === "study group"
                      ? "school"
                      : "home"}
                  </Icon>
                  {data.profile.type}
                </Typography>
                {!data.accepted && (
                  <Chip size="small" color="error" label="Invitation pending" />
                )}
              </>
            }
          />
          <ListItemIcon>
            <LoadingButton
              disableRipple
              loading={loading}
              sx={{
                px: 0,
                minWidth: "auto",
                borderRadius: 9,
                ml: "auto",
                color: "inherit",
              }}
            >
              {data.propertyId === global.property.propertyId && (
                <Icon>east</Icon>
              )}
            </LoadingButton>
          </ListItemIcon>
        </ListItem>
      </ListItem>
      <Drawer
        anchor="right"
        ModalProps={{
          keepMounted: data.accessToken === global.property.accessToken,
        }}
        PaperProps={{
          sx: {
            height: "100vh",
            background: colors[data.profile.color][50] + "!important",
            width: { xs: "100vw", md: "80vw", sm: "50vw" },
            maxWidth: "600px",
            overflow: "scroll",
          },
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Box
          sx={{
            overflow: "scroll",
          }}
        >
          <Box
            sx={{
              background: colors[color]["A400"],
              px: 3,
              height: "300px",
              position: "relative",
              color: invertColors ? "black" : "white",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                p: 2,
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconButton
                disableRipple
                onClick={() => {
                  setOpen(false);
                }}
                sx={{
                  color: "inherit",
                  mr: 0.2,
                }}
              >
                <Icon>west</Icon>
              </IconButton>
              <Typography sx={{ mx: "auto", fontWeight: "600" }}>
                Group
              </Typography>
              <Changelog house={data.profile.id} />
              {global.property.permission !== "read-only" && (
                <IconButton
                  disableRipple
                  accessKey="d"
                  sx={{
                    color: "inherit",
                    zIndex: 1,
                  }}
                  onClick={() => {
                    setEditMode(!editMode);
                  }}
                >
                  <Icon>more_vert</Icon>
                </IconButton>
              )}
              <EditProperty
                color={color}
                setOpen={setEditMode}
                propertyType={propertyType}
                setPropertyType={setPropertyType}
                setColor={setColor}
                open={editMode}
              />
            </Box>

            <Box
              sx={{
                position: "absolute",
                left: 0,
                bottom: 0,
                p: 5,
                py: 4,
              }}
            >
              <Typography
                sx={{
                  textTransform: "capitalize",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                  background: invertColors
                    ? "rgba(0,0,0,0.2)"
                    : "rgba(255,255,255,0.2)",
                  px: 1.5,
                  pr: 2,
                  py: 0.5,
                  fontWeight: "900",
                  borderRadius: 5,
                  fontSize: "14px",
                }}
              >
                <Icon>
                  {propertyType === "dorm"
                    ? "cottage"
                    : propertyType === "apartment"
                    ? "location_city"
                    : propertyType === "study group"
                    ? "school"
                    : "home"}
                </Icon>
                {propertyType}
              </Typography>
              <Typography variant="h4" className="font-secondary underline">
                {global.property.profile.name || "Untitled property"}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              p: 2.5,
              px: { sm: "30px" },
            }}
          >
            <UpgradeBanner color={color} />

            <Typography variant="h5" sx={{ fontWeight: "700", my: 2, mb: 1 }}>
              Members
            </Typography>
            <MemberList color={color} setOpen={setOpen} />
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
