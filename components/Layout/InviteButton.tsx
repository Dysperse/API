import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import * as colors from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
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
                label="Home name / Family name / Address"
                placeholder="1234 Rainbow Road"
                onBlur={(e: any) => updateSettings("houseName", e.target.value)}
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
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  mb: 2,
                }}
              >
                <span className="material-symbols-rounded">location_city</span>
                Apartment
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

      <Box
        onClick={() => setOpen(true)}
        sx={{
          display: "flex",
          userSelect: "none",
          cursor: "pointer",
          p: 1,
          ml: 1,
          borderRadius: 3,
          "&:hover": { background: "rgba(200,200,200,.2)" },
          "&:active": { background: "rgba(200,200,200,.3)" },
        }}
      >
        <span className="material-symbols-rounded" style={{ fontSize: "20px" }}>
          expand_more
        </span>
      </Box>
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
          {global.session.user.studentMode === false ? "home" : "dorm"}
        </Typography>
      </Popover>
    </>
  );
}
