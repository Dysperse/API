import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import * as colors from "@mui/material/colors";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";
import { neutralizeBack, revivalBack } from "../history-control";
import { MemberList } from "../HouseProfile/MemberList";
import { RoomList } from "../HouseProfile/RoomList";
import { Invitations } from "../Invitations";
import { updateSettings } from "../Settings/updateSettings";

export function InviteButton() {
  const [open, setOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [isOwner, setIsOwner] = React.useState<boolean>(false);
  global.setIsOwner = setIsOwner;
  global.isOwner = isOwner;
  React.useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const [houseType, setHouseType] = React.useState(
    global.session.user.houseType
  );

  const handleChange = (event: SelectChangeEvent) => {
    setHouseType(event.target.value as string);
  };

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

  useEffect(() => {
    document.documentElement.classList[open ? "add" : "remove"](
      "prevent-scroll"
    );
  }, [open]);

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        swipeAreaWidth={0}
        ModalProps={{
          keepMounted: true,
        }}
        disableSwipeToOpen={true}
        PaperProps={{
          elevation: 0,
          sx: {
            background: colors[themeColor][50],
            width: {
              sm: "50vw",
            },
            maxWidth: "600px",
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
            background: "linear-gradient(45deg, #232323,  #6B4B4B)",
            px: 3,
            height: "40vh",
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
            <IconButton
              disableRipple
              sx={{
                color: "white",
                mr: 1,
              }}
              onClick={() => {
                setEditMode(!editMode);
              }}
            >
              <span className="material-symbols-rounded">edit</span>
            </IconButton>
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
                  value={houseType}
                  label="House type"
                  onChange={handleChange}
                >
                  <MenuItem
                    onClick={() => {
                      updateSettings("houseType", "dorm");
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
                      updateSettings("houseType", "apartment");
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
                      updateSettings("houseType", "home");
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
                    fontSize: "50px",
                    py: 0,
                  },
                }}
                defaultValue={
                  global.session.user.SyncToken == false ||
                  !global.session.user.SyncToken
                    ? global.session.user.houseName || "Smartlist"
                    : global.syncedHouseName
                    ? global.syncedHouseName
                    : ""
                }
                disabled={
                  !(
                    global.session.user.SyncToken == false ||
                    !global.session.user.SyncToken
                  )
                }
                label="Home name / Family name / Address"
                placeholder="1234 Rainbow Road"
                onBlur={(e: any) => {
                  updateSettings("houseName", e.target.value);
                  global.setSyncedHouseName(e.target.value);
                }}
              />
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
                  {houseType === "dorm"
                    ? "cottage"
                    : houseType === "apartment"
                    ? "location_city"
                    : "home"}
                </span>
                {houseType}
              </Typography>
              <Typography variant="h3">
                {global.session.user.SyncToken == false ||
                !global.session.user.SyncToken ? (
                  global.session.user.houseName || "Smartlist"
                ) : (
                  <>
                    {global.syncedHouseName === "false" ? (
                      <Skeleton
                        animation="wave"
                        width={200}
                        sx={{ maxWidth: "20vw" }}
                      />
                    ) : (
                      <>{global.syncedHouseName}</>
                    )}
                  </>
                )}
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            p: 2.5,
            px: { sm: 4 },
            maxHeight: { xs: "50vh", sm: "50vh" },
            overflow: "scroll",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "700", my: 2, mb: 1 }}>
            Members
          </Typography>
          <MemberList />
          <Typography variant="h5" sx={{ fontWeight: "700", my: 2, mb: 1 }}>
            Rooms
          </Typography>
          <RoomList />
        </Box>
      </SwipeableDrawer>
      <div id="new_trigger" onClick={handleClick}></div>
      {!global.session.user.SyncToken && global.ownerLoaded && !isOwner && (
        <Invitations />
      )}

      <Button
        disableRipple
        id="houseProfileTrigger"
        onClick={() => setOpen(true)}
        sx={{
          display: "flex",
          userSelect: "none",
          cursor: "pointer",
          "&:active": {
            background: "rgba(200,200,200,.3)!important",
            transition: "none",
            transform: "scale(0.95)",
          },
          p: 1,
          py: 0,
          borderRadius: 3,
          transition: "transform .2s",
          "&:hover": {
            background: { xs: "transparent", sm: "rgba(200,200,200,.2)" },
          },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "600",
            mr: 2,
          }}
          noWrap
        >
          {global.session.user.SyncToken == false ||
          !global.session.user.SyncToken ? (
            global.session.user.houseName || "Carbon"
          ) : (
            <>
              {global.syncedHouseName === "false" ? (
                <Skeleton
                  animation="wave"
                  width={200}
                  sx={{ maxWidth: "20vw" }}
                />
              ) : (
                <>{global.syncedHouseName}</>
              )}
            </>
          )}
        </Typography>
        <span className="material-symbols-rounded" style={{ fontSize: "20px" }}>
          expand_more
        </span>
      </Button>
      <Popover
        id={id}
        open={!isOwner && !global.session.user.SyncToken && popoverOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        BackdropProps={{
          sx: {
            opacity: "0!important",
          },
        }}
        PaperProps={{
          sx: {
            background: "#f50057",
            maxWidth: "200px",
            overflowX: "unset",
            mt: 3.5,
            overflowY: "unset",
            "&:before": {
              content: '""',
              position: "absolute",
              marginRight: "-0.71em",
              top: -15,
              left: 20,
              width: 20,
              height: 20,
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
              background: "rgba(255,255,255,.3)",
              mb: 0.5,
            }}
          />
          <br />
          Invite up to 5 people to your{" "}
          {global.session.user.houseType !== "dorm" ? "home" : "dorm"}
        </Typography>
      </Popover>
    </>
  );
}
