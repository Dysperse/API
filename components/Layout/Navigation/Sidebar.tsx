import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Logo } from "@/pages";
import { Box, Tooltip, Typography, useMediaQuery } from "@mui/material";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useHotkeys } from "react-hotkeys-hook";
import { openSpotlight } from "./Search";
const SearchPopup = dynamic(() => import("./Search"), { ssr: false });

function SidebarCalendar() {
  const date = dayjs();
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const redPalette = useColor("tomato", useDarkMode(session.darkMode));

  return (
    <Box
      className="calendar"
      sx={{
        width: 50,
        height: 50,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: `2px solid ${palette[3]}`,
        color: palette[7],
      }}
    >
      <Box
        sx={{
          width: 25,
          height: 2,
          background: redPalette[5],
          borderRadius: 999,
          mt: 0.9,
          mb: -0.2,
        }}
      >
        &nbsp;
      </Box>
      <Typography variant="h4" className="font-heading">
        {dayjs().format("DD")}
      </Typography>
    </Box>
  );
}

export function Sidebar() {
  const router = useRouter();
  const session = useSession();
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

  const shouldHide = router.asPath.includes("/onboarding");

  return (
    <Box
      sx={{
        // WebkitAppRegion: "drag",
        display: { xs: "none", md: "flex!important" },
        maxWidth: "85px",
        width: "80px",
        ml: shouldHide ? "-90px" : 0,
        // ...(shouldHide && { opacity: 0, pointerEvents: "none" }),
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
        "&:hover .calendar": {
          position: "relative",
          transform: "translateX(0px)",
        },
        "&:hover .logo": {
          position: "relative",
          transform: "translateX(70px)",
        },
        "& .logo": {
          mt: "-45px",
          transform: "translateX(0px)",
          transition: "transform .4s cubic-bezier(.17,.67,.22,1.14)",
        },
        "& .calendar": {
          transform: "translateX(-70px)",
          transition: "transform .4s cubic-bezier(.17,.67,.22,1.14)",
        },
      }}
    >
      <Box sx={{ mt: 2 }} />
      <SidebarCalendar />
      {!isMobile && <Logo size={50} intensity={7} />}
      <Box sx={{ mt: "auto", pt: 10 }} />
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
            background: addHslAlpha(palette[4], 0.4),
            "&:active": {
              background: addHslAlpha(palette[4], 0.5),
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
