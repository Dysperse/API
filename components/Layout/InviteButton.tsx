import LoadingButton from "@mui/lab/LoadingButton";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardActionArea from "@mui/material/CardActionArea";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import { useStatusBar } from "../../hooks/useStatusBar";
import { colors } from "../../lib/colors";
import type { House } from "../../types/houseProfile";
import { neutralizeBack, revivalBack } from "../history-control";
import { UpgradeBanner } from "../HouseProfile/ItemBanner";
import { MemberList } from "../HouseProfile/MemberList";
import { RoomList } from "../HouseProfile/RoomList";
import { Puller } from "../Puller";
import { updateSettings } from "../Settings/updateSettings";

/**
 * Edit property
 */

function EditProperty({
  open,
  setOpen,
  color,
  setColor,
  propertyType,
  setPropertyType,
}: {
  color: string;
  setOpen: (open: boolean) => void;
  propertyType: string;
  setColor: (color: string) => void;
  setPropertyType: (propertyType: string) => void;
  open: boolean;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  /**
   * Handles click event
   * @param event Event
   */
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  /**
   * Set property type
   */
  const handleCloseMenu = (type) => {
    updateSettings("type", type, false, null, true);
    setPropertyType(type);
    setAnchorEl(null);
  };

  /**
   * Callback for updating note blur event
   * @param { React.FocusEvent<HTMLInputElement> } event
   */
  const handleUpdateName = (event: React.FocusEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    updateSettings("name", target.value, false, null, true);
  };

  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      swipeAreaWidth={0}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      PaperProps={{
        elevation: 0,
        sx: {
          background: colors[color]["100"].toString(),
          color: colors[color]["900"].toString(),
          px: 3,
          width: { xs: "100%", sm: "50vw" },
          py: 2,
          mx: "auto",
        },
      }}
    >
      <Box
        sx={{
          height: "100vh",
          px: 2,
          pt: 10,
        }}
      >
        <AppBar
          position="absolute"
          sx={{
            p: 2,
            py: 1,
            background: colors[color]["100"].toString(),
            color: colors[color]["900"].toString(),
            boxShadow: "none",
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              sx={{ mr: 1 }}
              aria-label="menu"
              onClick={() => setOpen(false)}
            >
              <span className="material-symbols-rounded">chevron_left</span>
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Edit property
            </Typography>
          </Toolbar>
        </AppBar>
        <TextField
          fullWidth
          variant="filled"
          sx={{ color: "white" }}
          defaultValue={global.property.profile.name || "Untitled property"}
          id="nameInput"
          label="Home name / Family name / Address"
          placeholder="1234 Rainbow Road"
          onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
            handleUpdateName(e)
          }
        />

        <Button
          variant="outlined"
          sx={{
            border: "0!important",
            background: "rgba(0,0,0,0.1)",
            mt: 3,
            borderBottom: "1px solid #313131 !important",
            py: 2,
            px: 1.5,
            width: "100%",
            textAlign: "left",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            borderRadius: 0,
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
          }}
          aria-haspopup="true"
          disabled={global.property.permission === "read-only"}
          onClick={handleClick}
        >
          <Typography
            sx={{
              textTransform: "capitalize",
              display: "flex",
              alignItems: "center",
              gap: "10px",
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
        </Button>
        <FormControl fullWidth sx={{ mb: 4 }}>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => {
              setAnchorEl(null);
            }}
          >
            <MenuItem onClick={() => handleCloseMenu("house")} value="house">
              House
            </MenuItem>
            <MenuItem
              onClick={() => handleCloseMenu("apartment")}
              value="house"
            >
              Apartment
            </MenuItem>
            <MenuItem onClick={() => handleCloseMenu("dorm")} value="house">
              Dorm
            </MenuItem>
          </Menu>
        </FormControl>

        <Color setColor={setColor} s={color} color={"pink"} />
        <Color setColor={setColor} s={color} color={"red"} />
        <Color setColor={setColor} s={color} color={"green"} />
        <Color setColor={setColor} s={color} color={"teal"} />
        <Color setColor={setColor} s={color} color={"cyan"} />
        <Color setColor={setColor} s={color} color={"blue"} />
        <Color setColor={setColor} s={color} color={"indigo"} />
        <Color setColor={setColor} s={color} color={"purple"} />
        <Color setColor={setColor} s={color} color={"deepPurple"} />
        <Color setColor={setColor} s={color} color={"orange"} />
        <Color setColor={setColor} s={color} color={"deepOrange"} />
        <Color setColor={setColor} s={color} color={"lime"} />
        <Color setColor={setColor} s={color} color={"indigo"} />
        <Color setColor={setColor} s={color} color={"brown"} />
      </Box>
    </SwipeableDrawer>
  );
}

/**
 * Color component for house profile
 * @param {any} {s
 * @param {any} color
 * @param {any} setColor}
 * @returns {any}
 */
function Color({
  s,
  color,
  setColor,
}: {
  s: string;
  color: string;
  setColor: (color: string) => void;
}) {
  return (
    <CardActionArea
      onClick={() => {
        setColor(color);
        updateSettings("color", color, false, null, true);
      }}
      sx={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        display: "inline-flex",
        mr: 1,
        mb: 1,
        backgroundColor: colors[color]["A700"],
      }}
    >
      <span
        className="material-symbols-outlined"
        style={{
          color: "#fff",
          margin: "auto",
          opacity: s === color ? 1 : 0,
        }}
      >
        check
      </span>
    </CardActionArea>
  );
}

/**
 * House popup
 * @param {any} {handleClose}
 * @param {any} {data}
 * @returns {any}
 */
function House({
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
          : colors[themeColor][50]
      );
  }, [open]);
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
          // sx={{ display: "flex", alignItems: "center", width: "100%" }}
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
      <SwipeableDrawer
        anchor="right"
        swipeAreaWidth={0}
        ModalProps={{
          keepMounted: true,
        }}
        disableSwipeToOpen
        PaperProps={{
          elevation: 0,
          sx: {
            background: colors[color][global.user.darkMode ? 900 : 50],
            height: "500px",
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
        onOpen={() => setOpen(true)}
      >
        <Box
          sx={{
            overflow: "scroll",
            height: "100vh",
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
                position: "absolute",
                top: 0,
                left: 0,
                m: 2,
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
            </Box>
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                m: 2,
              }}
            >
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
                  <span className="material-symbols-rounded">edit</span>
                </IconButton>
              )}
            </Box>
            <EditProperty
              color={color}
              setOpen={setEditMode}
              propertyType={propertyType}
              setPropertyType={setPropertyType}
              setColor={setColor}
              open={editMode}
            />
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
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  mb: 2,
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
              <Typography variant="h3">
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
      </SwipeableDrawer>
    </>
  );
}

/**
 * Invite button to trigger property list
 * @returns {any}
 */
export function InviteButton() {
  const [open, setOpen] = React.useState(false);
  useStatusBar(open);

  React.useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  /**
   * Description
   * @param {React.MouseEvent<any>} event
   * @returns {any}
   */
  const handleClick = (event) => {
    const target = event.currentTarget as HTMLButtonElement;
    setAnchorEl(target);
  };

  /**
   * Closes the popup
   * @returns void
   */
  const handleClose = () => {
    setAnchorEl(null);
  };
  const trigger = useMediaQuery("(min-width: 600px)");

  return (
    <>
      <SwipeableDrawer
        ModalProps={{
          keepMounted: true,
        }}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        anchor={trigger ? "left" : "bottom"}
        BackdropProps={{
          sx: {
            background: {
              sm: "rgba(0,0,0,0)!important",
            },
            backdropFilter: { sm: "blur(0px)" },
            opacity: { sm: "0!important" },
          },
        }}
        sx={{
          display: { sm: "flex" },
          alignItems: { sm: "start" },
          mt: 9,
          ml: 2,
          justifyContent: { sm: "start" },
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            boxShadow: "none!important",
            position: { sm: "static!important" },
            background: colors[themeColor][50],
            width: {
              sm: "50vw",
            },
            maxWidth: { sm: "350px" },
            overflow: "hidden!important",
            borderRadius: {
              xs: "20px 20px 0 0",
              sm: 5,
            },
            ...(global.user.darkMode && {
              background: "hsl(240, 11%, 25%)",
            }),
          },
        }}
        swipeAreaWidth={0}
      >
        <Box sx={{ display: { sm: "none" } }}>
          <Puller />
        </Box>
        <Box sx={{ py: { xs: 3, sm: 0 }, px: 2, textAlign: "center" }} />
        {global.user.properties.map((house: House) => (
          <House
            handleClose={() => setOpen(false)}
            key={house.accessToken.toString()}
            data={house}
          />
        ))}
      </SwipeableDrawer>
      <Box id="new_trigger" onClick={handleClick} />

      <Button
        disableFocusRipple
        id="houseProfileTrigger"
        onClick={() => setOpen(true)}
        sx={{
          display: "flex",
          userSelect: "none",
          cursor: "pointer",
          background: "transparent!important",
          "&:active": {
            transition: "none",
            transform: "scale(0.95)",
          },
          p: 1,
          gap: 1,
          py: 0,
          color: "inherit",
          borderRadius: 2,
          transition: "transform .2s",
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: "500",
            maxWidth: "40vw",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
          noWrap
        >
          {global.property.profile.name || "My property"}
        </Typography>
        <span className="material-symbols-outlined">expand_more</span>
      </Button>
    </>
  );
}
