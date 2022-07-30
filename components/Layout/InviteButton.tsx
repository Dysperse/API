import Box from "@mui/material/Box";
import * as colors from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";
import Popover from "@mui/material/Popover";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import { Invitations } from "../Invitations";
import { Puller } from "../Puller";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import IconButton from "@mui/material/IconButton";
import useSWR from "swr";

export function InviteButton() {
  const [open, setOpen] = React.useState(false);
  const [isOwner, setIsOwner] = React.useState<boolean>(false);
  global.setIsOwner = setIsOwner;
  global.isOwner = isOwner;

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

  const url =
    "/api/account/sync/member-list?" +
    new URLSearchParams({
      token:
        global.session &&
        (global.session.user.SyncToken || global.session.accessToken),
    });
  const { data, error } = useSWR(url, () =>
    fetch(url, {
      method: "POST",
    }).then((res) => res.json())
  );

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
            maxHeight: "100vh",
            minHeight: { xs: "100vh", sm: "auto" },
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
        {/* <Puller /> */}
        <Box
          sx={{
            background: "#232323",
            px: 3,
            height: "60vh",
            position: "relative",
            color: "white",
            borderRadius: "30px 30px 0 0",
          }}
        >
          <IconButton
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              m: 1,
              color: "white",
            }}
          >
            <span className="material-symbols-rounded">close</span>
          </IconButton>
          <Typography
            variant="h4"
            sx={{
              position: "absolute",
              left: 0,
              bottom: 0,
              p: 1,
            }}
          >
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
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: "700", my: 1 }}>
            Members
          </Typography>
          {data &&
            data.data.map((member, key) => <Box key={key}>{member.email}</Box>)}
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
