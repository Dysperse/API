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
} from "@mui/material";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { preload } from "swr";
import { useApi } from "../../lib/client/useApi";
import { useBackButton } from "../../lib/client/useBackButton";
import { useSession } from "../../pages/_app";
import { ErrorHandler } from "../Error";
import Settings from "../Settings/index";
import AppsMenu from "./AppsMenu";

const Group = dynamic(() => import("../Group"));

/**
 * Invite button to trigger property list
 * @returns {any}
 */
export default function InviteButton({ styles }) {
  const [open, setOpen] = React.useState<boolean>(false);

  useBackButton(() => setOpen(false));

  useHotkeys(["ctrl+,"], (e) => {
    e.preventDefault();
    document.getElementById("settingsTrigger")?.click();
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
  const session = useSession();

  const { data, loading, url, fetcher, error } = useApi("user/properties");
  const properties = [...session.user.properties, ...(data || [])]
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
        BackdropProps={{
          sx: {
            opacity: { xs: "1!important", md: "0!important" },
          },
        }}
        transitionDuration={300}
        PaperProps={{
          sx: {
            borderRadius: "28px!important",
            width: "300px",
            ml: { md: "60px!important" },
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
            data={{
              id: group.propertyId,
              accessToken: group.accessToken,
            }}
          >
            <ListItemButton
              {...(group.propertyId === session.property.propertyId && {
                id: "activeProperty",
              })}
              sx={{
                gap: 2,
                borderRadius: 0,
                transition: "none",
                ...(group.propertyId === session.property.propertyId && {
                  background: session.user.darkMode
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
                  color: session.user.darkMode ? "#fff" : "#000",
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
              color: `hsl(240,11%,${session.user.darkMode ? 90 : 10}%)`,
            }}
          >
            <Icon className="outlined">account_circle</Icon>
            My account
          </Button>
        </Settings>
      </Menu>

      <Box
        sx={{
          ...styles(false),
          display: { xs: "none", md: "block" },
          mb: 2,
        }}
        id="houseProfileTrigger"
        onClick={handleClick}
      >
        <Avatar
          sx={{
            background:
              colors[session.property.profile.color][
                session.user.darkMode ? "A400" : 200
              ],
            "&:hover": {
              background:
                colors[session.property.profile.color][
                  session.user.darkMode ? "A700" : 300
                ],
            },
            ...(Boolean(anchorEl) && {
              background:
                colors[session.property.profile.color][
                  session.user.darkMode ? "A700" : 300
                ],
            }),
            color: session.user.darkMode ? "#000" : "#000",
          }}
        >
          <Icon className="outlined">hive</Icon>
        </Avatar>
      </Box>
      <IconButton
        sx={{
          ...styles(Boolean(anchorEl)),
          display: { md: "none" },
        }}
        onClick={handleClick}
      >
        <Tooltip title="Account menu" placement="bottom-end">
          <Icon className="outlined">hive</Icon>
        </Tooltip>
      </IconButton>
    </>
  );
}
