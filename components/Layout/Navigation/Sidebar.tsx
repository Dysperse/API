import { GroupModal } from "@/components/Group/GroupModal";
import { Logo } from "@/components/Logo";
import { ProfilePicture } from "@/components/Profile/ProfilePicture";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Avatar,
  Box,
  Divider,
  Icon,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { shouldHideNavigation } from "./BottomNavigation";
import { openSpotlight } from "./Search";
const SearchPopup = dynamic(() => import("./Search"), { ssr: false });

function SidebarMenu({ styles }) {
  const { session } = useSession();
  const router = useRouter();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const groupPalette = useColor(
    session.property.profile.color,
    useDarkMode(session.darkMode)
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          ...styles(false),
          "& .material-symbols-outlined": {
            borderRadius: 99,
            background: addHslAlpha(palette[4], 0.6),
            transition: "all .2s",
            "&:active": {
              opacity: 0.6,
              transition: "none",
            },
            width: 40,
            height: 40,
            fontVariationSettings:
              '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 20!important',
          },
        }}
      >
        <span className="material-symbols-outlined">more_horiz</span>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          zIndex: 99,
        }}
        slotProps={{
          root: {
            sx: {
              transform: "translate(13px, -5px)!important",
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            router.push(
              `/users/${session.user.username || session.user.email}`
            );
          }}
        >
          <ProfilePicture data={session.user} size={35} />
          {session.user.name}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            router.push(`/spaces/${session.property.propertyId}`);
          }}
        >
          <Avatar
            sx={{
              background: groupPalette[9],
              color: groupPalette[1],
              width: 35,
              height: 35,
            }}
          >
            <Icon>
              {session.property.profile.type === "home"
                ? "home"
                : session.property.profile.type === "apartment"
                ? "apartment"
                : session.property.profile.type === "dorm"
                ? "cottage"
                : "school"}
            </Icon>
          </Avatar>
          <span style={{ marginRight: "15px" }}>
            {session.property.profile.name}
          </span>
          <GroupModal useRightClick={false}>
            <Avatar
              sx={{
                background: addHslAlpha(palette[5], 0.6),
                color: palette[9],
                width: 30,
                height: 30,
                ml: "auto",
              }}
            >
              <Icon className="outlined">sync_alt</Icon>
            </Avatar>
          </GroupModal>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handleClose();
            router.push(`/settings`);
          }}
        >
          <Avatar
            sx={{
              width: 35,
              height: 35,
              background: "transparent",
              color: "inherit",
            }}
          >
            <Icon className="outlined">settings</Icon>
          </Avatar>
          Settings
        </MenuItem>
      </Menu>
    </>
  );
}

export function Sidebar() {
  const router = useRouter();
  const { session } = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const isMobile = useMediaQuery("(max-width: 600px)");

  useHotkeys(
    "ctrl+g",
    (e) => {
      e.preventDefault();
      router.push(`/spaces/${session.property.propertyId}`);
    },
    [open]
  );

  useHotkeys(
    "ctrl+u",
    (e) => {
      e.preventDefault();
      router.push(`/users`);
    },
    [open]
  );

  useHotkeys(
    "ctrl+comma",
    (e) => {
      e.preventDefault();
      router.push(`/settings`);
    },
    [open]
  );

  useHotkeys(
    "ctrl+p",
    (e) => {
      e.preventDefault();
      router.push(`/users/${session.user.email}`);
    },
    [open]
  );

  useHotkeys(
    "ctrl+shift+1",
    (e) => {
      e.preventDefault();
      router.push("/");
    },
    [open]
  );

  useHotkeys(
    "ctrl+shift+4",
    (e) => {
      e.preventDefault();
      router.push("/rooms");
    },
    [open]
  );
  useHotkeys(
    "ctrl+shift+2",
    (e) => {
      e.preventDefault();
      router.push("/tasks/perspectives/days");
    },
    [open]
  );

  const styles = (active: any = false) => {
    return {
      WebkitAppRegion: "no-drag",
      color: palette[12],
      borderRadius: 3,
      my: 0.5,
      maxHeight: "9999px",
      overflow: "visible",
      "& .material-symbols-rounded, & .material-symbols-outlined": {
        transition: "all .2s, opacity 0s, background 0s",
        height: 50,
        width: 50,
        display: "flex",
        alignItems: "center",
        borderRadius: 5,
        justifyContent: "center",
      },
      "&:hover .material-symbols-outlined": {
        background: palette[3],
      },
      "&:active .material-symbols-outlined": {
        background: palette[4],
      },
      userSelect: "none",
      ...(active && {
        " .material-symbols-outlined,  .material-symbols-rounded": {
          background: palette[4],
          color: palette[11],
        },
      }),
    };
  };

  const shouldHide = shouldHideNavigation(router.asPath);

  return (
    <Box
      sx={{
        ".priorityMode &": {
          opacity: "0!important",
        },
        display: { xs: "none", md: "flex!important" },
        maxWidth: "85px",
        width: "80px",
        ml: shouldHide ? "-90px" : 0,
        ...(shouldHide && { pointerEvents: "none" }),
        transition: "all .2s",
        zIndex: "99!important",
        filter: "none!important",
        overflowX: "hidden",
        borderLeft: "1px solid transparent",
        height: "100dvh",
        position: "fixed",
        left: "0px",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        "& .logo": {
          WebkitAppRegion: "drag",
        },
      }}
    >
      <Box sx={{ mt: 2 }} />
      {!isMobile && <Logo size={50} intensity={7} />}
      <Box sx={{ mt: "auto", pt: 10 }} />
      <Box
        sx={styles(router.asPath.includes("/tasks"))}
        onClick={() => router.push("/tasks/perspectives/days")}
        onMouseDown={() => router.push("/tasks/perspectives/days")}
      >
        <Tooltip title="Tasks" placement="right">
          <span
            className={`material-symbols-${
              router.asPath.includes("/tasks") ? "rounded" : "outlined"
            }`}
          >
            &#xe86c;
          </span>
        </Tooltip>
      </Box>
      <Box
        sx={styles(router.asPath === "/")}
        onClick={() => router.push("/")}
        onMouseDown={() => router.push("/")}
      >
        <Tooltip title="Start" placement="right">
          <span
            className={`material-symbols-${
              router.asPath === "/" ? "rounded" : "outlined"
            }`}
          >
            &#xf07e;
          </span>
        </Tooltip>
      </Box>
      <Box
        sx={styles(
          router.asPath === "/rooms" ||
            router.asPath === "/trash" ||
            router.asPath === "/starred" ||
            router.asPath.includes("rooms")
        )}
        onClick={() => router.push("/rooms")}
        onMouseDown={() => router.push("/rooms")}
      >
        <Tooltip title="Items" placement="right">
          <span
            className={`material-symbols-${
              router.asPath === "/rooms" ||
              router.asPath === "/trash" ||
              router.asPath === "/starred" ||
              router.asPath.includes("rooms")
                ? "rounded"
                : "outlined"
            }`}
          >
            &#xf569;
          </span>
        </Tooltip>
      </Box>

      <Box
        sx={{
          mt: "auto",
          mb: 1,
          alignItems: "center",
          display: "flex",
          WebkitAppRegion: "no-drag",
          flexDirection: "column",
        }}
      >
        <SearchPopup />
        <Box
          onClick={() => openSpotlight()}
          onMouseDown={() => openSpotlight()}
          sx={{
            ...styles(false),
            borderRadius: 99,
            "& .material-symbols-outlined": {
              width: 40,
              height: 40,
            },
          }}
        >
          <Tooltip title="Spotlight" placement="right">
            <span className="material-symbols-outlined">bolt</span>
          </Tooltip>
        </Box>
        <SidebarMenu styles={styles} />
      </Box>
    </Box>
  );
}
