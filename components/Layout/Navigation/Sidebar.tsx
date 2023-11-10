"use client";
import { containerRef } from "@/app/(app)/container";
import { ProfilePicture } from "@/app/(app)/users/[id]/ProfilePicture";
import { Logo } from "@/components/Logo";
import { StatusSelector } from "@/components/Start/StatusSelector";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Avatar,
  Badge,
  Box,
  Divider,
  Icon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { usePathname, useRouter } from "next/navigation";
import { cloneElement, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { shouldHideNavigation } from "./BottomNavigation";

export function SidebarMenu({ children }) {
  const { session } = useSession();
  const router = useRouter();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const groupPalette = useColor(
    session.space.info.color,
    useDarkMode(session.darkMode)
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const trigger = cloneElement(children, { onClick: handleClick });

  return (
    <>
      {trigger}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
        sx={{
          zIndex: 999,
        }}
        slotProps={{
          root: {
            sx: {
              transform: { sm: "translate(13px, -5px)!important" },
              "& .MuiTypography-body2": {
                textTransform: "uppercase",
                opacity: 0.6,
                fontWeight: 900,
                fontSize: "13px",
              },
            },
          },
          paper: {
            sx: {
              border: `2px solid ${palette[4]}`,
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
          <Box>
            <Typography variant="body2">Profile</Typography>
            <Typography>{session.user.name}</Typography>
          </Box>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            router.push(`/spaces/`);
          }}
        >
          <Avatar
            sx={{
              background: `linear-gradient(45deg, ${groupPalette[9]}, ${groupPalette[7]})`,
              color: groupPalette[1],
              width: 35,
              height: 35,
            }}
          >
            <Icon>
              {session.space.info.type === "home"
                ? "home"
                : session.space.info.type === "apartment"
                ? "apartment"
                : session.space.info.type === "dorm"
                ? "cottage"
                : "school"}
            </Icon>
          </Avatar>
          <Box>
            <Typography variant="body2">Space</Typography>
            <Typography>{session.space.info.name}</Typography>
          </Box>
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

  useHotkeys("ctrl+g", (e) => {
    e.preventDefault();
    router.push(`/spaces/${session.space.info.id}`);
  });

  useHotkeys("ctrl+u", (e) => {
    e.preventDefault();
    router.push(`/users`);
  });

  useHotkeys("ctrl+comma", (e) => {
    e.preventDefault();
    router.push(`/settings`);
  });

  useHotkeys("ctrl+p", (e) => {
    e.preventDefault();
    router.push(`/users/${session.user.email}`);
  });

  useHotkeys("ctrl+shift+2", (e) => {
    e.preventDefault();
    router.push("/");
  });

  useHotkeys("ctrl+shift+3", (e) => {
    e.preventDefault();
    if (session.space.info.type !== "study group") router.push("/rooms");
  });

  useHotkeys("ctrl+shift+1", (e) => {
    e.preventDefault();
    router.push("/tasks/perspectives/days");
  });

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
        background: palette[4],
      },
      "&:active .material-symbols-outlined": {
        background: palette[5],
      },
      userSelect: "none",
      ...(active && {
        " .material-symbols-outlined,  .material-symbols-rounded": {
          background:
            palette[
              pathname.includes("tasks") || pathname.includes("/rooms") ? 6 : 4
            ],
          color: palette[11],
        },
      }),
    };
  };

  const pathname = usePathname();
  const shouldHide = shouldHideNavigation(pathname);

  const generateLabel = (label, keys) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      {label}
      <Typography
        sx={{
          display: "flex",
          gap: 1,
          "& .keyboard": {
            px: 1,
            fontSize: "13px",
            borderRadius: 2,
            background: "rgba(0,0,0,0.1)",
          },
        }}
      >
        {keys.map((key) => (
          <span className="keyboard" key={key}>
            {key}
          </span>
        ))}
      </Typography>
    </Box>
  );
  return (
    <Box
      onClick={() =>
        containerRef.current.scrollTo({ top: 0, behavior: "smooth" })
      }
      sx={{
        ".priorityMode &": {
          opacity: "0!important",
        },
        display: { xs: "none", md: "flex!important" },
        maxWidth: "85px",
        width: "80px",
        ml: shouldHide ? "-90px" : 0,
        ...(shouldHide && { pointerEvents: "none" }),
        transition: "all var(--transition-defaults)",
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
        sx={styles(pathname?.includes("/tasks"))}
        onClick={() => router.push("/tasks/perspectives/days")}
        onMouseDown={() => router.push("/tasks/perspectives/days")}
      >
        <Badge
          badgeContent={
            dayjs(session.user.lastPlannedTasks).isToday()
              ? 0
              : pathname.includes("/tasks")
              ? 0
              : 1
          }
          variant="dot"
          sx={{
            width: "100%",
            "& .MuiBadge-badge": {
              right: 12,
              top: 12,
            },
          }}
        >
          <Tooltip
            title={generateLabel("Tasks", ["ctrl", "shift", "1"])}
            placement="right"
          >
            <span
              className={`material-symbols-${
                pathname?.includes("/tasks") ? "rounded" : "outlined"
              }`}
            >
              &#xe86c;
            </span>
          </Tooltip>
        </Badge>
      </Box>
      <Box
        sx={styles(pathname === "/")}
        onClick={() => router.push("/")}
        onMouseDown={() => router.push("/")}
      >
        <Tooltip
          title={generateLabel("Start", ["ctrl", "shift", "2"])}
          placement="right"
        >
          <span
            className={`material-symbols-${
              pathname === "/" ? "rounded" : "outlined"
            }`}
          >
            &#xf07e;
          </span>
        </Tooltip>
      </Box>
      {session.space.info.type !== "study group" && (
        <Box
          sx={styles(
            pathname === "/rooms" ||
              pathname === "/trash" ||
              pathname === "/starred" ||
              pathname?.includes("rooms")
          )}
          onClick={() => router.push("/rooms")}
          onMouseDown={() => router.push("/rooms")}
        >
          <Tooltip
            title={generateLabel("Tasks", ["ctrl", "shift", "3"])}
            placement="right"
          >
            <span
              className={`material-symbols-${
                pathname === "/rooms" ||
                pathname === "/trash" ||
                pathname === "/starred" ||
                pathname?.includes("rooms")
                  ? "rounded"
                  : "outlined"
              }`}
            >
              &#xf569;
            </span>
          </Tooltip>
        </Box>
      )}

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
        <StatusSelector mutate={() => {}} profile={session.user.Profile} />
        <SidebarMenu>
          <Box
            sx={{
              ...styles(false),
              p: 0,
              my: 1,
            }}
          >
            <ProfilePicture data={session.user} size={36} />
          </Box>
        </SidebarMenu>
      </Box>
    </Box>
  );
}
