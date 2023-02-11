import {
  Box,
  Button,
  colors,
  Divider,
  Icon,
  ListItemButton,
  ListItemText,
  Menu,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useApi } from "../../hooks/useApi";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { useStatusBar } from "../../hooks/useStatusBar";
import { ErrorHandler } from "../Error";
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

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (e) => setAnchorEl(e.target);
  const handleClose = (e) => setAnchorEl(null);

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "28px!important",

            width: "300px",
            overflow: "hidden",
          },
        }}
        sx={{
          "& .MuiMenu-list": {
            p: "0!important",
          },
        }}
      >
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
        <Divider />
        <Settings>
          <Button
            color="inherit"
            disableRipple
            size="large"
            fullWidth
            sx={{ justifyContent: "start", p: 2, borderRadius: 0 }}
          >
            <Icon className="outlined">account_circle</Icon>
            Account settings
          </Button>
        </Settings>
      </Menu>

      <Box sx={styles(false)} onClick={handleClick}>
        <Tooltip title="Groups" placement="right">
          <Icon className="outlined">settings</Icon>
        </Tooltip>
      </Box>
    </>
  );
}
