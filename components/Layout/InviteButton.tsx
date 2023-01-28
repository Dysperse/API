import {
  Box,
  Button,
  Icon,
  SwipeableDrawer,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { useStatusBar } from "../../hooks/useStatusBar";
import { Group } from "../GroupProfile/Group";
import { Puller } from "../Puller";

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

  useHotkeys(
    "ctrl+p",
    (e) => {
      e.preventDefault();
      if (open) {
        document.getElementById("activeProperty")?.click();
      } else {
        setOpen(true);
      }
    },
    [open]
  );

  useHotkeys(
    "ctrl+shift+p",
    (e) => {
      e.preventDefault();
      setOpen(true);
      setTimeout(() => {
        document.getElementById("activeProperty")?.click();
      }, 50);
    },
    [open]
  );

  const trigger = useMediaQuery("(min-width: 600px)");

  const properties = global.user.properties.reduce((acc, curr) => {
    if (!acc.find((property) => property.propertyId === curr.propertyId)) {
      acc.push(curr);
    }
    return acc;
  }, []);

  return (
    <>
      <SwipeableDrawer
        disableBackdropTransition
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        anchor={trigger ? "left" : "bottom"}
        BackdropProps={{
          sx: {
            WebkitAppRegion: "no-drag",
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
          pl: 2,
          justifyContent: { sm: "start" },
        }}
        PaperProps={{
          sx: {
            maxWidth: "400px!important",
            height: "auto",
            position: { sm: "static!important" },
            WebkitAppRegion: "no-drag",
            borderRadius: {
              xs: "20px 20px 0 0",
              sm: 5,
            },
          },
        }}
        disableSwipeToOpen
      >
        <Box sx={{ display: { sm: "none" } }}>
          <Puller />
        </Box>
        <Box sx={{ px: 2, textAlign: "center" }} />
        {properties.map((group: any) => (
          <Group
            handleClose={() => setOpen(false)}
            key={group.accessToken.toString()}
            data={group}
          />
        ))}
      </SwipeableDrawer>
      <Button
        disableRipple
        disabled={!window.navigator.onLine}
        id="houseProfileTrigger"
        onClick={() => setOpen(true)}
        onContextMenu={(e) => {
          navigator.vibrate(50);
          e.preventDefault();
          setOpen(true);
          setTimeout(() => {
            document.getElementById("activeProperty")?.click();
          }, 50);
        }}
        sx={{
          "&:focus-visible": {
            boxShadow: global.user.darkMode
              ? "0px 0px 0px 1.5px hsl(240,11%,50%) !important"
              : "0px 0px 0px 1.5px var(--themeDark) !important",
          },
          background: "transparent!important",
          color: global.user.darkMode ? "hsl(240,11%,90%)" : "#303030",
          "&:hover": {
            backgroundColor: global.user.darkMode
              ? "hsl(240,11%,15%)!important"
              : "#eee!important",
            color: global.user.darkMode ? "hsl(240,11%,90%)" : "#000",
          },
          cursor: "unset",
          "&:active": {
            backgroundColor: global.user.darkMode
              ? "hsl(240,11%,15%)!important"
              : "#ddd!important",

            color: global.user.darkMode
              ? "hsl(240,11%,95%)!important"
              : "#000!important",
          },
          userSelect: "none",
          transition: "transform .2s",
          p: 1,
          py: 0,
          gap: 1,
          borderRadius: 2,
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
          {global.property.profile.name || "My group"}
        </Typography>
        <Icon>chevron_right</Icon>
      </Button>{" "}
    </>
  );
}
