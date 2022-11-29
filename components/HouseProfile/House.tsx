import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { useStatusBar } from "../../hooks/useStatusBar";
import { colors } from "../../lib/colors";
import { House } from "../../types/houseProfile";
import { UpgradeBanner } from "../HouseProfile/ItemBanner";
import { MemberList } from "../HouseProfile/MemberList";
import { RoomList } from "../HouseProfile/RoomList";
import { EditProperty } from "../HouseProfile/EditProperty";

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
  }, [open]);

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
          "& .MuiListItem-root": { transition: "all .2s" },
          "&:active .MuiListItem-root": {
            transform: "scale(.95)",
            transition: "none",
          },
          "&:active": {
            background: `${
              colors[themeColor][global.user.darkMode ? 800 : 100]
            }!important`,
          },
          ...(data.propertyId === global.property.propertyId && {
            background: `${
              colors[themeColor][global.user.darkMode ? 800 : 100]
            }!important`,
            "&:active": {
              background: `${
                colors[themeColor][global.user.darkMode ? 700 : 200]
              }!important`,
            },
          }),
        }}
      >
        <ListItem
          // className="content"
          sx={{ gap: 1.5, px: 0, py: 0 }}
        >
          <ListItemAvatar sx={{ width: "auto", minWidth: "auto" }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                mt: -2.5,
                borderRadius: "50%",
                backgroundColor: colors[data.profile.color]["A700"],
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
              sx={{ px: 0, minWidth: "auto", borderRadius: 9, ml: "auto" }}
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
          elevation: 0,
          sx: {
            background: colors[color][global.user.darkMode ? 900 : 50],
            height: "100vh",
            mx: "auto",
            width: { xs: "100vw", md: "80vw", sm: "50vw" },
            maxWidth: "600px",
            ...(global.user.darkMode && {
              background: "hsl(240, 11%, 25%)",
            }),
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
              background: `linear-gradient(45deg, ${colors[color]["900"]},  ${colors[color]["800"]})`,
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
                <span className="material-symbols-rounded">chevron_left</span>
              </IconButton>
              <Typography sx={{ mx: "auto", fontWeight: "600" }}>
                Group
              </Typography>
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
                  <span className="material-symbols-outlined">edit</span>
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
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: "700", my: 2 }}>
                Rooms
              </Typography>
              <Box
                sx={{
                  ml: "auto",
                }}
              >
                <Button
                  disabled={global.property.permission === "read-only"}
                  onClick={() => {
                    document.getElementById("setCreateRoomModalOpen")?.click();
                  }}
                  variant="contained"
                  sx={{
                    borderRadius: 4,
                    boxShadow: 0,
                    background: `${colors[color][900]}!important`,
                  }}
                >
                  <span
                    className="material-symbols-rounded"
                    style={{ marginRight: "10px" }}
                  >
                    add
                  </span>
                  Create room
                </Button>
              </Box>
            </Box>
            <RoomList color={color} />
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
