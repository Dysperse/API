import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  colors,
  Divider,
  Icon,
  IconButton,
  ListItemButton,
  ListItemText,
  Menu,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { preload } from "swr";
import { useApi } from "../../hooks/useApi";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { useStatusBar } from "../../hooks/useStatusBar";
import { ErrorHandler } from "../Error";
import Settings from "../Settings/index";
import AppsMenu from "./AppsMenu";

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
  const { data, loading, url, fetcher, error } = useApi("user/properties");
  const properties = [...global.user.properties, ...(data || [])]
    .filter((group) => group)
    .reduce((acc, curr) => {
      if (!acc.find((property) => property.propertyId === curr.propertyId)) {
        acc.push(curr);
      }
      return acc;
    }, []);
  preload(url, fetcher);

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (e) => setAnchorEl(e.target);
  const handleClose = (e) => setAnchorEl(null);

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            borderRadius: "28px!important",
            width: "300px",
            ml: { sm: "60px!important" },
            overflow: "hidden",
          },
        }}
        keepMounted
        sx={{
          "& .MuiMenu-list": {
            p: "0!important",
          },
          zIndex: 999,
        }}
      >
        {loading && <CircularProgress />}
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
                ...(group.propertyId === global.property.propertyId && {
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
                  color: global.user.darkMode ? "#fff" : "#000",
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
        <AppsMenu styles={styles} />
        <Settings>
          <Button
            size="large"
            color="inherit"
            fullWidth
            sx={{
              justifyContent: "start",
              p: 2,
              py: 1.5,
              borderRadius: 0,
              gap: 2,
              color: "inherit",
            }}
          >
            <Icon className="outlined">person</Icon>
            My account
          </Button>
        </Settings>
      </Menu>

      <Box
        sx={{
          ...styles(false),
          display: { xs: "none", sm: "block" },
          mb: 2,
        }}
        onClick={handleClick}
      >
        <Avatar
          sx={{
            background: colors[global.property.profile.color]["200"],
            "&:hover": {
              background: colors[global.property.profile.color]["300"],
            },
            ...(Boolean(anchorEl) && {
              background: colors[global.property.profile.color]["300"],
            }),
            color: "#000",
          }}
        >
          <Icon className="outlined">people</Icon>
        </Avatar>
      </Box>
      <IconButton
        sx={{
          ...styles(Boolean(anchorEl)),
          display: { sm: "none" },
        }}
        onClick={handleClick}
      >
        <Tooltip title="Groups" placement="bottom-end">
          <Icon className="outlined">menu_open</Icon>
        </Tooltip>
      </IconButton>
    </>
  );
}
