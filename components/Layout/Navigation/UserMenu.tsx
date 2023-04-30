import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  colors,
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
import { useApi } from "../../../lib/client/useApi";
import { useBackButton } from "../../../lib/client/useBackButton";
import { useSession } from "../../../lib/client/useSession";
import { ErrorHandler } from "../../Error";
import Settings from "../../Settings/index";

const Group = dynamic(() => import("../../Group"));

/**
 * Invite button to trigger property list
 * @returns {any}
 */
export default function InviteButton({ styles }: any) {
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
  const handleClick = (e) => {
    e.stopPropagation();
    if (!loading) {
      setAnchorEl(e.target);
      navigator.vibrate(50);
    }
  };
  const handleClose = () => setAnchorEl(null);
  const [view, setView] = useState(0);
  return (
    <>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
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
            opacity: "0!important",
          },
        }}
        transitionDuration={300}
        PaperProps={{
          sx: {
            borderRadius: "28px!important",
            width: "300px",
            ml: { md: "60px!important" },
            mt: { xs: 2, sm: 0 },
            overflow: "hidden",
          },
        }}
        sx={{
          zIndex: 999,
        }}
      >
        {view == 0 && (
          <div>
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
                    borderRadius: "28px",
                    transition: "transform .2s",
                    background: "transparent!important",
                    "&:active": {
                      transform: "scale(0.97)",
                    },
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
            <Button
              size="large"
              color="inherit"
              fullWidth
              onClick={() => setView(1)}
              sx={{
                justifyContent: "start",
                p: 2,
                py: 1.5,
                borderRadius: "28px",
                gap: 2,
                color: `hsl(240,11%,${session.user.darkMode ? 90 : 10}%)`,
              }}
            >
              <Icon className="outlined">smart_button</Icon>
              Apps &amp; support
            </Button>
            <Settings>
              <Button
                size="large"
                color="inherit"
                fullWidth
                sx={{
                  justifyContent: "start",
                  p: 2,
                  py: 1.5,
                  borderRadius: "28px",
                  gap: 2,
                  color: `hsl(240,11%,${session.user.darkMode ? 90 : 10}%)`,
                }}
              >
                <Icon className="outlined">account_circle</Icon>
                My account
              </Button>
            </Settings>
          </div>
        )}
        {view == 1 && (
          <div>
            <Button
              onClick={() => setView(0)}
              sx={{
                m: 1,
                mb: 0,
                background: `hsl(240,11%,${
                  session.user.darkMode ? 20 : 90
                }%)!important`,
                transition: "all .2s!important",
                "&:active": {
                  transform: "scale(0.95)",
                },
              }}
              size="small"
            >
              <Icon>west</Icon>
              Back
            </Button>

            {[
              {
                label: "Help",
                icon: "help",
                href: "https://blog.dysperse.com/series/support",
              },
              {
                label: "Dysperse Availability",
                icon: "auto_schedule",
                href: "https://availability.dysperse.com?utm_source=dysperse-user-dashboard",
              },
              {
                label: "Twitter",
                icon: "link",
                href: "https://twitter.com/getdysperse",
              },
              {
                label: "Instagram",
                icon: "link",
                href: "https://instagram.com/dysperse",
              },
              {
                label: "Official community",
                icon: "link",
                href: "https://discord.gg/fvngmDzh77",
              },
            ].map((link) => (
              <Button
                key={link.href}
                size="large"
                color="inherit"
                fullWidth
                onClick={() => window.open(link.href)}
                sx={{
                  justifyContent: "start",
                  p: 2,
                  py: 1.5,
                  borderRadius: "28px",
                  gap: 2,
                  color: `hsl(240,11%,${session.user.darkMode ? 90 : 10}%)`,
                }}
              >
                <Icon className="outlined">{link.icon}</Icon>
                {link.label}
              </Button>
            ))}
          </div>
        )}
      </Menu>

      <Tooltip title="My account" placement="right">
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
              opacity: loading ? 0.5 : 1,
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
      </Tooltip>
      <IconButton
        disabled={loading}
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
