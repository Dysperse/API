import { useApi } from "@/lib/client/useApi";
import { useBackButton } from "@/lib/client/useBackButton";
import { useSession } from "@/lib/client/useSession";
import { vibrate } from "@/lib/client/vibration";
import {
  Alert,
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Icon,
  IconButton,
  ListItemButton,
  ListItemText,
  Menu,
  Tooltip,
  Typography,
  colors,
} from "@mui/material";
import { red } from "@mui/material/colors";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { mutate, preload } from "swr";
import { ErrorHandler } from "../../Error";

const Group = dynamic(() => import("../../Group"));

function PropertyButton({ group }) {
  const session = useSession();
  return (
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
  );
}

/**
 * Invite button to trigger property list
 * @returns {any}
 */
export default function InviteButton({ styles }: any) {
  const [open, setOpen] = React.useState<boolean>(false);
  const router = useRouter();

  useBackButton(() => setOpen(false));

  useHotkeys(["ctrl+comma"], (e) => {
    e.preventDefault();
    router.push("/settings/account");
    handleClose();
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
    "ctrl+shift+comma",
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

  const properties = [...session.properties, ...(data || [])]
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
      vibrate(50);
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
            {properties
              .filter((p) => p.accepted)
              .map((group: any) => (
                <PropertyButton key={group.id} group={group} />
              ))}

            {error && (
              <ErrorHandler
                callback={() => mutate(url)}
                error="An error occured while trying to fetch your other groups"
              />
            )}
            {properties.filter((p) => !p.accepted).length > 0 && (
              <Button
                size="large"
                color="inherit"
                fullWidth
                onClick={() => setView(2)}
                sx={{
                  justifyContent: "start",
                  p: 2,
                  py: 1.5,
                  borderRadius: "28px",
                  gap: 2,
                  color: `hsl(240,11%,${session.user.darkMode ? 90 : 10}%)`,
                }}
              >
                <Icon className="outlined">group_add</Icon>
                Invitations
                {properties.filter((p) => !p.accepted).length > 0 && (
                  <Chip
                    size="small"
                    color="error"
                    sx={{ px: 1, ml: "auto" }}
                    label={properties.filter((p) => !p.accepted).length}
                  />
                )}
              </Button>
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
            <Button
              size="large"
              onClick={() => {
                handleClose();
                router.push("/settings/account");
              }}
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
              <Icon className="outlined">settings</Icon>
              Settings
            </Button>
          </div>
        )}
        {view !== 0 && (
          <Button
            onClick={() => setView(0)}
            sx={{
              m: 1,
              mb: 1,
              background: `hsl(240,11%,${
                session.user.darkMode ? 20 : 90
              }%)!important`,
              color: `hsl(240,11%,${
                session.user.darkMode ? 90 : 20
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
        )}
        {view == 2 && (
          <>
            <Box sx={{ p: 2, py: 1 }}>
              <Typography variant="h6">
                Invitations ({properties.filter((p) => !p.accepted).length})
              </Typography>
              {properties.filter((p) => !p.accepted).length == 0 && (
                <Alert severity="info">
                  Groups you&apos;ve been invited to will appear here.
                </Alert>
              )}
            </Box>
            {properties
              .filter((p) => !p.accepted)
              .map((group: any) => (
                <PropertyButton key={group.id} group={group} />
              ))}
          </>
        )}
        {view == 1 && (
          <div>
            {[
              {
                label: "Home page",
                icon: "home",
                href: "https://dysperse.com",
              },
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

      <Tooltip
        PopperProps={{ sx: { pointerEvents: "none" } }}
        title={
          <Box>
            <b>{session?.property?.profile?.name}</b>
            <br />
            <span style={{ fontWeight: 400 }}>{session.user.email}</span>
          </Box>
        }
        placement="right"
      >
        <Box
          sx={{
            ...styles(Boolean(anchorEl)),
            display: { xs: "none", sm: "block" },
            "& .material-symbols-rounded": {
              background:
                colors[session?.property?.profile?.color || 100][
                  session.user.darkMode ? 900 : 100
                ],
              height: 40,
            },
          }}
          id="houseProfileTrigger"
          onClick={handleClick}
        >
          <Badge
            badgeContent={
              Boolean(anchorEl)
                ? 0
                : properties.filter((p) => !p.accepted).length
            }
            sx={{
              "& .MuiBadge-colorError": {
                background: red["800"] + "!important",
                border: "2px solid !important",
                transform:
                  Boolean(anchorEl) ||
                  properties.filter((p) => !p.accepted).length == 0
                    ? "scale(0) translate(5px, -5px)!important"
                    : "translate(5px, -5px)!important",
                borderColor:
                  router.asPath === "/zen" ||
                  router.asPath === "/mood-history" ||
                  router.asPath === "/"
                    ? "transparent"
                    : session.user.darkMode
                    ? router.asPath === "/coach"
                      ? "hsla(240,11%,8%)"
                      : "hsla(240,11%,5%)"
                    : router.asPath === "/coach"
                    ? "hsl(240,11%,97%)"
                    : "hsl(240,11%,93%)",
              },
            }}
            color="error"
          >
            <Icon className="outlined">alternate_email</Icon>
          </Badge>
        </Box>
      </Tooltip>
      <Badge
        badgeContent={properties.filter((p) => !p.accepted).length}
        sx={{
          display: { md: "none" },
          "& .MuiBadge-colorError": {
            background: "red!important",
          },
        }}
        color="error"
      >
        <IconButton
          disabled={loading}
          sx={{
            ...styles(Boolean(anchorEl)),
            display: { md: "none" },
          }}
          onClick={handleClick}
        >
          <Tooltip title="Account menu" placement="bottom-end">
            <Icon className="outlined">unfold_more</Icon>
          </Tooltip>
        </IconButton>
      </Badge>
    </>
  );
}
