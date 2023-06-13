import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useColor } from "@/lib/client/useColor";
import { useSession } from "@/lib/client/useSession";
import { toastStyles } from "@/lib/client/useTheme";
import { Logo } from "@/pages/zen";
import { Box, Tooltip, Typography, useMediaQuery } from "@mui/material";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import { updateSettings } from "../../../lib/client/updateSettings";
import { openSpotlight } from "./Search";
const SearchPopup = dynamic(() => import("./Search"));

export function Sidebar() {
  const router = useRouter();
  const session = useSession();
  const palette = useColor(session.themeColor, session.user.darkMode);
  const [clickCount, setClickCount] = useState(0);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const useOutlinedTheme =
    router.asPath === "/zen" ||
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
      updateSettings("color", "blueGrey");
      setClickCount(0);
    }
  };

  useHotkeys(
    "ctrl+shift+1",
    (e) => {
      e.preventDefault();
      router.push("/zen");
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
      router.push("/tasks/agenda/week");
    },
    [open]
  );
  const styles = (active: any = false) => {
    return {
      color: palette[12],
      borderRadius: 3,
      my: 0.5,
      maxHeight: "9999px",
      overflow: "visible",
      "& .material-symbols-rounded, & .material-symbols-outlined": {
        transition: "none",
        height: 50,
        width: 50,
        display: "flex",
        alignItems: "center",
        borderRadius: 5,
        justifyContent: "center",
      },
      "&:hover .material-symbols-outlined": {
        background: palette[2],
        color: session.user.darkMode ? "#fff" : "#000",
      },
      userSelect: "none",
      ...(active && {
        " .material-symbols-outlined,  .material-symbols-rounded": {
          background: palette[3],
          color: palette[11],
        },
      }),
    };
  };

  const shouldHide = ["/users", "/settings", "/coach/routine", "/groups"].find(
    (path) => router.asPath.includes(path)
  );

  return (
    <Box
      sx={{
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
          sm: useOutlinedTheme ? "transparent" : palette[1],
        },
        borderRightColor: {
          sm: useOutlinedTheme ? addHslAlpha(palette[4], 0.8) : "transparent",
        },
        height: "100vh",
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
        sx={styles(
          router.asPath === "/zen" ||
            router.asPath === "/" ||
            router.asPath === "/mood-history"
        )}
        onClick={() => router.push("/zen")}
        onMouseDown={() => router.push("/zen")}
      >
        <Tooltip title="Start" placement="right">
          <span
            className={`material-symbols-${
              router.asPath === "/zen" ||
              router.asPath === "/" ||
              router.asPath === "/mood-history"
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
        onClick={() => router.push("/tasks/agenda/week")}
        onMouseDown={() => router.push("/tasks/agenda/week")}
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
          >
            rocket_launch
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
          flexDirection: "column",
        }}
      >
        <SearchPopup />
        <Box
          onClick={() => openSpotlight()}
          onMouseDown={() => openSpotlight()}
          sx={{
            ...styles(false),
            "& .material-symbols-outlined": {
              height: 40,
            },
          }}
        >
          <Tooltip title="Spotlight" placement="right">
            <span className="material-symbols-outlined">bolt</span>
          </Tooltip>
        </Box>
        <Box
          sx={{
            ...styles(router.asPath.includes("/users")),
            "& .material-symbols-outlined, .material-symbols-rounded": {
              height: 40,
            },
          }}
          onClick={() => router.push(`/users`)}
          onMouseDown={() => router.push(`/users`)}
        >
          <Tooltip title="Friends" placement="right">
            <span
              className={`material-symbols-${
                router.asPath.includes("users") ? "rounded" : "outlined"
              }`}
            >
              group
            </span>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}
