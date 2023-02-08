import {
  Box,
  Button,
  colors,
  Grow,
  Icon,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dynamic from "next/dynamic";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useApi } from "../../hooks/useApi";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { useStatusBar } from "../../hooks/useStatusBar";
import { ErrorHandler } from "../Error";
import { Puller } from "../Puller";

const Group = dynamic(() => import("../Group"));

/**
 * Invite button to trigger property list
 * @returns {any}
 */
export default function InviteButton() {
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
  const { data, error } = useApi("user/properties");
  const properties = [...global.user.properties, ...(data || [])]
    .filter((group) => group)
    .reduce((acc, curr) => {
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
        {...(trigger && {
          TransitionComponent: Grow,
        })}
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
        ModalProps={{
          keepMounted: true,
        }}
        disableSwipeToOpen
      >
        <Box sx={{ display: { sm: "none" } }}>
          <Puller />
        </Box>
        <Box sx={{ px: 2, textAlign: "center" }} />
        {properties.map((group: any) => (
          <Group
            key={group.propertyId}
            handleClose={() => setOpen(false)}
            data={{
              id: group.propertyId,
              accessToken: group.accessToken,
            }}
          >
            <ListItemButton
              id="activeProperty"
              sx={{
                gap: 2,
                borderRadius: 0,
                transition: "none",
                ...(group.id === global.property.id && {
                  background: global.user.darkMode
                    ? "hsla(240,11%,20%)"
                    : "rgba(200,200,200,.4)!important",
                }),
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  background: colors[group.profile.color]["A700"],
                  borderRadius: 99,
                }}
              />
              <ListItemText
                primary={<b>{group.profile.name}</b>}
                secondary={group.profile.type}
                sx={{
                  textTransform: "capitalize",
                }}
              />
            </ListItemButton>
          </Group>
        ))}
        {error && (
          <ErrorHandler error="An error occured while trying to fetch your other groups" />
        )}
      </SwipeableDrawer>
      <Button
        disableRipple
        disabled={!window.navigator.onLine}
        id="houseProfileTrigger"
        onClick={() => {
          if (data && properties.length === 1) {
            document.getElementById("activeProperty")?.click();
          } else {
            setOpen(true);
          }
        }}
        onContextMenu={(e) => {
          navigator.vibrate(50);
          e.preventDefault();
          document.getElementById("activeProperty")?.click();
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
        <Icon>{properties.length == 1 ? "chevron_right" : "expand_more"}</Icon>
      </Button>{" "}
    </>
  );
}
