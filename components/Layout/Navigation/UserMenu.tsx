import { useApi } from "@/lib/client/useApi";
import { useBackButton } from "@/lib/client/useBackButton";
import { useColor } from "@/lib/client/useColor";
import { useSession } from "@/lib/client/useSession";
import { vibrate } from "@/lib/client/vibration";
import {
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Icon,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Tooltip,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { mutate, preload } from "swr";
import { ErrorHandler } from "../../Error";

const Group = dynamic(() => import("../../Group"));

export function PropertyButton({ handleClose, group }) {
  const session = useSession();
  const palette = useColor(session.themeColor, session.user.darkMode);
  const groupPalette = useColor(group.profile.color, session.user.darkMode);

  return (
    <Group
      key={group.propertyId}
      data={{
        id: group.propertyId,
        accessToken: group.accessToken,
      }}
      onClick={handleClose}
    >
      <ListItemButton
        {...(group.propertyId === session.property.propertyId && {
          id: "activeProperty",
        })}
        sx={{
          gap: 2,
          borderRadius: { xs: 0, sm: "10px" },
          transition: "transform .2s",
          background: "transparent!important",
          "&:active": {
            transform: { sm: "scale(0.97)" },
          },
          ...(group.propertyId === session.property.propertyId && {
            background: { sm: palette[2] },
          }),
        }}
      >
        <Box
          sx={{
            width: 50,
            height: 50,
            background: `linear-gradient(45deg, ${groupPalette[8]}, ${groupPalette[11]})`,
            color: groupPalette[1],
            borderRadius: 99,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon sx={{ display: { sm: "none" } }}>
            {group.profile.type === "house"
              ? "home"
              : group.profile.type === "apartment"
              ? "apartment"
              : group.profile.type === "dorm"
              ? "cottage"
              : "school"}
          </Icon>
        </Box>
        <ListItemText
          primary={<b>{group.profile.name}</b>}
          secondary={group.profile.type}
          sx={{
            color: palette[12],
            textTransform: "capitalize",
          }}
        />
        <ListItemIcon sx={{ minWidth: "unset" }}>
          <Icon>arrow_forward_ios</Icon>
        </ListItemIcon>
      </ListItemButton>
    </Group>
  );
}

/**
 * Invite button to trigger property list
 * @returns {any}
 */
export default function InviteButton({ styles }: any) {
  const session = useSession();

  const [open, setOpen] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [view, setView] = useState(0);
  const { data, loading, url, fetcher, error } = useApi("user/properties");

  const handleClose = () => setAnchorEl(null);
  const router = useRouter();
  useBackButton(() => setOpen(false));

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

  const properties = [...session.properties, ...(data || [])]
    .filter((group) => group)
    .reduce((acc, curr) => {
      if (!acc.find((property) => property.propertyId === curr.propertyId)) {
        acc.push(curr);
      }
      return acc;
    }, []);

  preload(url, fetcher);

  useHotkeys(["ctrl+comma"], (e) => {
    e.preventDefault();
    router.push("/settings/account");
    handleClose();
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (!loading) {
      setAnchorEl(e.target);
      vibrate(50);
    }
  };
  const palette = useColor(session.themeColor, session.user.darkMode);
  const groupPalette = useColor(
    session.property.profile.color,
    session.user.darkMode
  );

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
                <PropertyButton
                  handleClose={handleClose}
                  key={group.id}
                  group={group}
                />
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
                  color: palette[12],
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
                color: palette[12],
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
                color: palette[12],
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
              background: palette[3],
              color: palette[11],
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
            </Box>
            {properties
              .filter((p) => !p.accepted)
              .map((group: any) => (
                <PropertyButton
                  handleClose={handleClose}
                  key={group.id}
                  group={group}
                />
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
                  color: palette[12],
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
              background: groupPalette[11],
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
                    : palette[1],
              },
            }}
            color="error"
          >
            <Icon
              className="outlined"
              sx={{ color: groupPalette[1] + "!important" }}
            >
              expand_all
            </Icon>
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
            <Icon className="outlined">expand_all</Icon>
          </Tooltip>
        </IconButton>
      </Badge>
    </>
  );
}
