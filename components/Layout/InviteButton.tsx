import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import * as colors from "@mui/material/colors";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import useSWR, { useSWRConfig } from "swr";
import Popover from "@mui/material/Popover";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Cookies from "js-cookie";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { neutralizeBack, revivalBack } from "../history-control";
import { MemberList } from "../HouseProfile/MemberList";
import { RoomList } from "../HouseProfile/RoomList";
import { Puller } from "../Puller";
import { updateSettings } from "../Settings/updateSettings";
import useMediaQuery from "@mui/material/useMediaQuery";
function Color({ s, color, setColor }: any) {
  return (
    <CardActionArea
      onClick={() => {
        setColor(color);
        updateSettings("color", color, false, null, true, false);
      }}
      sx={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        display: "inline-flex",
        mr: 1,
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

function House({ handleClose, data }: any) {
  const [open, setOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [color, setColor] = React.useState<string>(data.color ?? "red");
  const [propertyType, setPropertyType] = React.useState(
    global.property.profile.type
  );
  const { mutate } = useSWRConfig();

  const handleChange = (event: SelectChangeEvent) => {
    setPropertyType(event.target.value as string);
  };

  return (
    <>
      <ListItem
        button
        disableRipple
        onClick={() => {
          if (data.propertyId === global.property.propertyId) {
            setOpen(true);
          } else {
            setLoading(true);
            fetch(
              "/api/property/join?" +
                new URLSearchParams({
                  property: data.propertyId,
                  accessToken: data.accessToken,
                  email: global.user.email,
                })
            )
              .then((res) => res.json())
              .then((res: any) => {
                toast(
                  <>
                    Currently viewing&nbsp;<b>{res.profile.name}</b>{" "}
                  </>
                );
                // window.location.href = "/dashboard";
                // window.location.reload();
                mutate("/api/user");
                setLoading(false);
                handleClose();
              })
              .catch((err) => {
                toast.error(
                  "An error occured while trying to switch properties!"
                );
                setLoading(false);
              });
          }
        }}
        sx={{
          transition: "none",
          "& .content": { transition: "all .2s" },
          "&:active .content": { transform: "scale(.95)", transition: "none" },
          "&:active": {
            background:
              colors[themeColor][global.theme == "dark" ? 800 : 100] +
              "!important",
          },
          ...(data.propertyId === global.property.propertyId && {
            background:
              colors[themeColor][global.theme == "dark" ? 800 : 100] +
              "!important",
            "&:active": {
              background:
                colors[themeColor][global.theme == "dark" ? 700 : 200] +
                "!important",
            },
          }),
        }}
      >
        <Box
          className="content"
          sx={{ display: "flex", alignItems: "center", width: "100%" }}
        >
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
                  color: global.theme === "dark" ? "#eee" : "#000",
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
                    ? "Read, write, and edit access"
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
        </Box>
      </ListItem>
      <SwipeableDrawer
        anchor="bottom"
        swipeAreaWidth={0}
        ModalProps={{
          keepMounted: true,
        }}
        disableSwipeToOpen
        PaperProps={{
          elevation: 0,
          sx: {
            background: colors[color][global.theme == "dark" ? 900 : 50],
            width: {
              sm: "50vw",
            },
            maxWidth: "600px",
            maxHeight: "90vh",
            overflow: "hidden",
            borderRadius: "30px 30px 0 0",
            mx: "auto",
            ...(global.theme === "dark" && {
              background: "hsl(240, 11%, 25%)",
            }),
          },
        }}
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        onOpen={() => setOpen(true)}
      >
        <Box
          sx={{
            maxHeight: "90vh",
            overflow: "scroll",
            borderRadius: "30px 30px 0 0",
          }}
        >
          <Box
            sx={{
              background:
                "linear-gradient(45deg, " +
                colors[color][900] +
                ",  " +
                colors[color][300] +
                ")",
              px: 3,
              height: "300px",
              position: "relative",
              color: "white",
              borderRadius: "30px 30px 0 0",
            }}
          >
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
                <span className="material-symbols-rounded">close</span>
              </IconButton>
            </Box>
            {editMode ? (
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  p: 5,
                  py: 4,
                }}
              >
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Select
                    variant="standard"
                    sx={{ color: "#fff", width: "200px" }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={propertyType}
                    label="House type"
                    onChange={handleChange}
                  >
                    <MenuItem
                      onClick={() => {
                        setPropertyType("dorm");
                        updateSettings(
                          "type",
                          propertyType,
                          false,
                          null,
                          true,
                          false
                        );
                      }}
                      value={"dorm"}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <span
                        className="material-symbols-rounded"
                        style={{
                          verticalAlign: "middle",
                          marginTop: "-3px",
                          marginRight: "10px",
                        }}
                      >
                        cottage
                      </span>
                      Dorm
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setPropertyType("apartment");
                        updateSettings(
                          "type",
                          propertyType,
                          false,
                          null,
                          true,
                          false
                        );
                      }}
                      value={"apartment"}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <span
                        className="material-symbols-rounded"
                        style={{
                          verticalAlign: "middle",
                          marginTop: "-3px",
                          marginRight: "10px",
                        }}
                      >
                        location_city
                      </span>
                      Apartment
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setPropertyType("home");
                        updateSettings(
                          "type",
                          propertyType,
                          false,
                          null,
                          true,
                          false
                        );
                      }}
                      value={"home"}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <span
                        className="material-symbols-rounded"
                        style={{
                          verticalAlign: "middle",
                          marginTop: "-3px",
                          marginRight: "10px",
                        }}
                      >
                        home
                      </span>
                      Home
                    </MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  variant="standard"
                  sx={{ color: "white" }}
                  InputLabelProps={{
                    sx: {
                      color: "#eee",
                    },
                  }}
                  InputProps={{
                    sx: {
                      color: "#fff!important",
                      fontSize: "40px",
                      py: 0,
                    },
                  }}
                  defaultValue={
                    global.property.profile.name || "Untitled property"
                  }
                  id="nameInput"
                  label="Home name / Family name / Address"
                  placeholder="1234 Rainbow Road"
                  onBlur={(e: any) => {
                    updateSettings(
                      "name",
                      e.target.value,
                      false,
                      null,
                      true,
                      false
                    );
                  }}
                />
                <Box sx={{ mt: 2, overflowX: "scroll", whiteSpace: "nowrap" }}>
                  <Color setColor={setColor} s={color} color={"red"} />
                  <Color setColor={setColor} s={color} color={"green"} />
                  <Color setColor={setColor} s={color} color={"blue"} />
                  <Color setColor={setColor} s={color} color={"orange"} />
                  <Color setColor={setColor} s={color} color={"cyan"} />
                  <Color setColor={setColor} s={color} color={"purple"} />
                  <Color setColor={setColor} s={color} color={"indigo"} />
                </Box>
              </Box>
            ) : (
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
            )}
          </Box>
          <Box
            sx={{
              p: 2.5,
              px: { sm: "30px" },
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "700", my: 2, mb: 1 }}>
              Members
            </Typography>
            <MemberList color={color} />
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
                    document.getElementById("setCreateRoomModalOpen")!.click();
                  }}
                  variant="contained"
                  sx={{
                    borderRadius: 4,
                    boxShadow: 0,
                    background: colors[color][900] + "!important",
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

export function InviteButton() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  let handleClick = (event: React.MouseEvent<any>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    handleClick = () => {};
  };
  const popoverOpen = Boolean(anchorEl);
  const id = popoverOpen ? "simple-popover" : undefined;

  useEffect(() => {
    const timer = setTimeout(() => {
      document.getElementById("new_trigger")!.click();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {}, [open]);

  const trigger = useMediaQuery("(min-width: 600px)");

  return (
    <>
      <SwipeableDrawer
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        anchor={trigger ? "top" : "bottom"}
        BackdropProps={{
          sx: {
            background: {
              sm: "rgba(0,0,0,0)!important",
            },
            backdropFilter: { sm: "blur(0px)" },
          },
        }}
        sx={{
          display: { sm: "flex" },
          alignItems: { sm: "start" },
          mt: 9,
          ml: 3,
          justifyContent: { sm: "start" },
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
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
            ...(global.theme === "dark" && {
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
        {global.user.properties.map((house: any, key: number) => (
          <House
            handleClose={() => setOpen(false)}
            key={house.accessToken.toString()}
            data={house}
          />
        ))}
      </SwipeableDrawer>
      <div id="new_trigger" onClick={handleClick} />

      <Button
        disableRipple
        id="houseProfileTrigger"
        onClick={() => setOpen(true)}
        sx={{
          display: "flex",
          userSelect: "none",
          cursor: "pointer",
          "&:active": {
            background:
              global.theme == "dark"
                ? "hsl(240, 11%, 20%) !important"
                : "rgba(200,200,200,.3)!important",
            transition: "none",
            transform: "scale(0.95)",
          },
          p: 1,
          gap: 1,
          py: 0,
          color: global.theme == "dark" ? "#fff" : "#000",
          borderRadius: 2,
          transition: "transform .2s",
          "&:hover": {
            background: { xs: "transparent", sm: "rgba(200,200,200,.2)" },
          },
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
          {global.property.profile.name || "Untitled property"}
        </Typography>
        <span className="material-symbols-outlined">expand_more</span>
      </Button>
      <Popover
        id={id}
        open={
          !Cookies.get("invitePopup") &&
          global.property.permission === "owner" &&
          popoverOpen
        }
        anchorEl={anchorEl}
        onClose={() => {
          handleClose();
          // Prevent popover from opening again
          Cookies.set("invitePopup", "true");
        }}
        BackdropProps={{
          sx: {
            opacity: "0!important",
          },
        }}
        PaperProps={{
          sx: {
            background: "#f50057",
            maxWidth: "200px",
            borderRadius: 4,
            overflowX: "unset",
            boxShadow: 0,
            mt: 6,
            overflowY: "unset",
            "&:before": {
              content: '""',
              position: "absolute",
              marginRight: "-0.71em",
              top: -15,
              left: 30,
              width: 20,
              height: 20,
              borderRadius: "4px",
              backgroundColor: "#f50057",
              transform: "translate(-50%, 50%) rotate(-45deg)",
              clipPath:
                "polygon(-5px -5px, calc(100% + 5px) -5px, calc(100% + 5px) calc(100% + 5px))",
            },
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 2 }}>
          <Chip
            label="New"
            sx={{
              height: "auto",
              px: 1,
              background: "#ff387d",
              mb: 0.5,
            }}
          />
          <br />
          Invite up to 5 people to your{" "}
          {global.property.profile.type !== "dorm" ? "home" : "dorm"}
        </Typography>
      </Popover>
    </>
  );
}
