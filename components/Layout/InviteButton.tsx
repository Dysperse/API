import {
  Box,
  Button,
  colors,
  Grow,
  Icon,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
  Tooltip,
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
import Settings from "../Settings/index";

const Group = dynamic(() => import("../Group"));

/**
 * Invite button to trigger property list
 * @returns {any}
 */
export default function InviteButton({ styles }) {
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
          alignItems: { sm: "end" },
          mb: 11,
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

        <Settings>
          <Tooltip
            title={global.user.email}
            placement="left"
            PopperProps={{
              sx: { pointerEvents: "none" },
            }}
          >
            <Button
              color="inherit"
              disableRipple
              sx={{
                ...styles(),
                cursor: "unset",
                background: "transparent!important",
              }}
            >
              <Icon
                className="material-symbols-outlined"
                sx={{
                  fontVariationSettings: `"FILL" 0, "wght" 300, "GRAD" 1, "opsz" 40!important`,
                }}
              >
                settings
              </Icon>
            </Button>
          </Tooltip>
        </Settings>
      </SwipeableDrawer>

      <Box sx={styles(false)} onClick={() => setOpen(true)}>
        <Tooltip title="Inventory" placement="right">
          <Icon className="outlined">settings</Icon>
        </Tooltip>
      </Box>
    </>
  );
}
