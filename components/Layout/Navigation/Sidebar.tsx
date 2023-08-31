import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import { Logo } from "@/pages";
import { RoutineTrigger } from "@/pages/coach";
import { Box, Tooltip, Typography, useMediaQuery } from "@mui/material";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import { updateSettings } from "../../../lib/client/updateSettings";
import { openSpotlight } from "./Search";
const SearchPopup = dynamic(() => import("./Search"), { ssr: false });

export function Sidebar() {
  const router = useRouter();
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const groupPalette = useColor(
    session.property.profile.color,
    useDarkMode(session.darkMode)
  );
  const [clickCount, setClickCount] = useState(0);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const useOutlinedTheme =
    router.asPath === "/tasks/insights" ||
    router.asPath === "/coach" ||
    router.asPath === "/" ||
    router.asPath === "/mood-history" ||
    router.asPath.includes("/users");
  // Easter egg #1
  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setClickCount(clickCount + 1);
    if (clickCount === 9) {
      toast.success(
        <Box>
          <Typography>You found an easter egg</Typography>
          <Typography variant="body2">
            Changes the theme color to monochrome
          </Typography>
        </Box>,
        {
          ...toastStyles,
          icon: "🥚",
        }
      );
      updateSettings(["color", "blueGrey"], { session });
      setClickCount(0);
    }
  };

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
      router.push("/items");
    },
    [open]
  );
  useHotkeys(
    "ctrl+shift+3",
    (e) => {
      e.preventDefault();
      router.push("/coach");
    },
    [open]
  );
  useHotkeys(
    "ctrl+shift+2",
    (e) => {
      e.preventDefault();
      router.push("/tasks/agenda/days");
    },
    [open]
  );

  const isDark = useDarkMode(session.darkMode);

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
        background: !useOutlinedTheme ? palette[4] : palette[2],
        color: isDark ? "#fff" : "#000",
      },
      userSelect: "none",
      ...(active && {
        " .material-symbols-outlined,  .material-symbols-rounded": {
          background: !useOutlinedTheme ? palette[5] : palette[3],
          color: palette[11],
        },
      }),
      "&:active": {
        opacity: 0.6,
      },
    };
  };

  const shouldHide = [
    "/claim-esb",
    "/users",
    "/coach/explore",
    "/coach/create",
    "/settings",
    "/coach/routine",
    "/groups",
    "/integrations",
    "/onboarding",
  ].find((path) => router.asPath.includes(path));

  return (
    <Box
      sx={{
        WebkitAppRegion: "drag",
        display: { xs: "none", md: "flex!important" },
        maxWidth: "85px",
        width: "80px",
        ml: shouldHide ? "-90px" : 0,
        ...(shouldHide && { opacity: 0, pointerEvents: "none" }),
        transition: "all .2s",
        zIndex: "99!important",
        filter: "none!important",
        overflowX: "hidden",
        borderRight: "1px solid",
        borderLeft: "1px solid transparent",
        background: {
          sm: useOutlinedTheme ? "transparent" : addHslAlpha(palette[3], 0.8),
        },
        borderRightColor: {
          sm: useOutlinedTheme ? addHslAlpha(palette[4], 0.8) : "transparent",
        },
        height: "100dvh",
        backdropFilter: "blur(10px)",
        position: "fixed",
        left: "0px",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box sx={{ mt: 2 }} />
      {!isMobile && <Logo intensity={7} />}
      <Box sx={{ mt: "auto", pt: 10 }} />
      <Box
        sx={styles(router.asPath === "/" || router.asPath === "/mood-history")}
        onClick={() => router.push("/")}
        onMouseDown={() => router.push("/")}
      >
        <Tooltip title="Start" placement="right">
          <span
            className={`material-symbols-${
              router.asPath === "/" || router.asPath === "/mood-history"
                ? "rounded"
                : "outlined"
            }`}
          >
            change_history
          </span>
        </Tooltip>
      </Box>
      <Box
        sx={styles(router.asPath.includes("/tasks"))}
        onClick={() => router.push("/tasks/agenda/days")}
        onMouseDown={() => router.push("/tasks/agenda/days")}
      >
        <Tooltip title="Tasks" placement="right">
          <span
            className={`material-symbols-${
              router.asPath.includes("/tasks") ? "rounded" : "outlined"
            }`}
          >
            check_circle
          </span>
        </Tooltip>
      </Box>
      <Box
        sx={styles(router.asPath.includes("/coach"))}
        onClick={() => router.push("/coach")}
        onMouseDown={() => router.push("/coach")}
      >
        <Tooltip title="Coach" placement="right">
          <span
            className={`material-symbols-${
              router.asPath.includes("/coach") ? "rounded" : "outlined"
            }`}
            style={{ position: "relative" }}
          >
            rocket_launch
            <RoutineTrigger sidebar />
          </span>
        </Tooltip>
      </Box>
      <Box
        sx={styles(
          router.asPath === "/items" ||
            router.asPath === "/trash" ||
            router.asPath === "/starred" ||
            router.asPath.includes("rooms")
        )}
        onClick={() => router.push("/items")}
        onMouseDown={() => router.push("/items")}
      >
        <Tooltip title="Items" placement="right">
          <span
            className={`material-symbols-${
              router.asPath === "/items" ||
              router.asPath === "/trash" ||
              router.asPath === "/starred" ||
              router.asPath.includes("rooms")
                ? "rounded"
                : "outlined"
            }`}
          >
            inventory_2
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
            background: addHslAlpha(palette[3], 0.8),
            "&:active": {
              background: addHslAlpha(palette[3], 0.9),
            },
            borderRadius: 99,
          }}
        >
          <Tooltip title="Spotlight" placement="right">
            <span className="material-symbols-outlined">bolt</span>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}
