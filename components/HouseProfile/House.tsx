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
import { ErrorHandler } from "../error";
import { EditProperty } from "../HouseProfile/EditProperty";
import { UpgradeBanner } from "../HouseProfile/ItemBanner";
import { MemberList } from "../HouseProfile/MemberList";

import {
  Box,
  Chip,
  CircularProgress,
  Drawer,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Typography
} from "@mui/material";

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
            p: 3,
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
            <span className="material-symbols-rounded">close</span>
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
          {data &&
            data.map((item) => (
              <Box
                key={item.when.toString()}
                sx={{
                  p: 3,
                  mb: 2,
                  background:
                    colors[themeColor][global.theme == "dark" ? 800 : 100],
                  borderRadius: 5,
                }}
              >
                <Typography gutterBottom>
                  <b>{item.who === global.user.name ? "You" : item.who}</b>{" "}
                  {item.what}
                </Typography>
                <Typography variant="body2">
                  {dayjs(item.when).fromNow()}
                </Typography>
              </Box>
            ))}
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
          color: "white",
          zIndex: 1,
          mr: 1,
          position: "absolute",
          right: "62px",
          mt: 0.2,
        }}
        onClick={() => setOpen(true)}
      >
        <span className="material-symbols-outlined">history</span>
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
export function House({
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
            : colors[color][800]
          : colors[themeColor][100]
      );
  }, [color, editMode, open]);

  useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });
  return (
    <>
      <ListItem
        button
        onClick={() => {
          if (data.propertyId === global.property.propertyId) {
            setOpen(true);
          } else {
            setLoading(true);
            fetchApiWithoutHook("property/join", {
              email: global.user.email,
              accessToken1: data.accessToken,
            })
              .then((res) => {
                toast(
                  <>
                    Currently viewing&nbsp;<b>{res.profile.name}</b>{" "}
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
                mt: -2.5,
                borderRadius: "30%",
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
                {!data.accepted && (
                  <Chip size="small" color="error" label="Invitation pending" />
                )}
              </>
            }
            secondary={
              <Box
                sx={{
                  color: global.user.darkMode ? "#eee" : "#000",
                  maxWidth: "100%",
                  mt: 0.5,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span className="material-symbols-rounded">
                  {data.permission === "member"
                    ? "group"
                    : data.permission == "owner"
                    ? "productivity"
                    : "visibility"}
                </span>
                <span
                  style={{
                    marginTop: data.permission === "owner" ? "-2.5px" : "",
                  }}
                >
                  {data.permission == "member"
                    ? "Member"
                    : data.permission == "owner"
                    ? "Owner"
                    : "Read-only access"}
                </span>
              </Box>
            }
          />
          <ListItemIcon>
            <LoadingButton
              loading={loading}
              sx={{
                px: 0,
                minWidth: "auto",
                borderRadius: 9,
                ml: "auto",
                color: "inherit",
              }}
            >
              <span className="material-symbols-rounded">
                {data.propertyId === global.property.propertyId
                  ? "settings"
                  : "chevron_right"}
              </span>
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
              background: `linear-gradient(45deg, ${colors[color]["A700"]},  ${colors[color]["A400"]})`,
              px: 3,
              height: "300px",
              position: "relative",
              color: "white",
            }}
          >
            <Box
              sx={{
                background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0))`,
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
                  color: "white",
                  mr: 0.2,
                }}
              >
                <span className="material-symbols-rounded">west</span>
              </IconButton>
              <Typography sx={{ mx: "auto", fontWeight: "600" }}>
                Group
              </Typography>
              <Changelog house={data.profile.id} />
              {global.property.permission !== "read-only" && (
                <IconButton
                  disableRipple
                  sx={{
                    color: "white",
                    zIndex: 1,
                    mr: 1,
                  }}
                  onClick={() => {
                    setEditMode(!editMode);
                  }}
                >
                  <span className="material-symbols-outlined">more_vert</span>
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
                  background: "rgba(255,255,255,0.2)",
                  px: 1.5,
                  pr: 2,
                  py: 0.5,
                  fontWeight: "900",
                  borderRadius: 5,
                  fontSize: "14px",
                }}
              >
                <span className="material-symbols-rounded">
                  {propertyType === "dorm"
                    ? "cottage"
                    : propertyType === "apartment"
                    ? "location_city"
                    : "home"}
                </span>
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
