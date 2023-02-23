import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Offline } from "react-detect-offline";
import { colors } from "../../lib/colors";

import { openSpotlight } from "@mantine/spotlight";
import {
  AppBar,
  Box,
  CssBaseline,
  Icon,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Image from "next/image";
import { UpdateButton } from "./UpdateButton";
import InviteButton from "./UserMenu";
const AppsMenu = dynamic(() => import("./AppsMenu"));
const Achievements = dynamic(() => import("./Achievements"));

/**
 * Navbar component for layout
 * @returns {any}
 */
export function Navbar(): JSX.Element {
  const router = useRouter();
  const styles = () => {
    return {
      WebkitAppRegion: "no-drag",
      borderRadius: 94,
      p: 0.8,
      m: 0,
      color: global.user.darkMode ? "hsl(240,11%,90%)" : "#606060",
      transition: "opacity .2s",
      "&:hover": {
        background: global.user.darkMode
          ? "hsl(240,11%,15%)"
          : "rgba(200,200,200,.3)",
        color: global.user.darkMode ? "hsl(240,11%,100%)" : "#000",
      },
      "&:active": {
        background: global.user.darkMode
          ? "hsl(240,11%,20%)"
          : "rgba(200,200,200,.5)",
        transition: "none",
      },
    };
  };

  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <AppBar
      elevation={0}
      position="fixed"
      sx={{
        paddingTop: "env(titlebar-area-height, 0px)",
        ...((!router ||
          router.asPath === "/zen" ||
          router.asPath === "" ||
          router.asPath === "/") && {
          top: {
            xs: "calc(var(--navbar-height) * -1) !important",
            sm: "0!important",
          },
        }),
        transition: "top .4s",
        zIndex: 999,
        "& *": {
          cursor: "unset!important",
        },
        color: {
          xs: global.user.darkMode ? "white" : "black",
          sm: global.user.darkMode ? "white" : "black",
        },
        pr: 0.4,
        height: "calc(70px + env(titlebar-area-height, 0px))",
        WebkitAppRegion: "drag",
        background: {
          xs: global.user.darkMode
            ? "rgba(23, 23, 28, .8)"
            : "rgba(255,255,255,.8)",
          sm: global.user.darkMode
            ? "rgba(23, 23, 28, .8)"
            : "rgba(255,255,255,.7)",
        },
        borderBottom: {
          xs: global.user.darkMode
            ? "1px solid hsla(240,11%,15%)"
            : "1px solid rgba(200,200,200,.3)",
          sm: "unset",
        },
        backdropFilter: "blur(10px)",
        display: { sm: "none" },
      }}
    >
      <CssBaseline />
      <Toolbar sx={{ height: "100%", gap: 1 }}>
        <Box
          sx={{
            mr: "auto",
            display: "flex",
            alignItems: "center",
            gap: 2,
            WebkitAppRegion: "no-drag",
          }}
        >
          <Image
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            draggable="false"
            src="/logo.svg"
            width={40}
            height={40}
            alt="Logo"
            style={{
              ...(global.user.darkMode && {
                filter: "invert(100%)",
              }),
            }}
          />
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "17px",
            }}
            variant="h6"
          >
            {router.asPath.includes("tasks")
              ? "Tasks"
              : router.asPath.includes("items") ||
                router.asPath.includes("trash") ||
                router.asPath.includes("starred") ||
                router.asPath.includes("rooms")
              ? "Items"
              : router.asPath.includes("coach")
              ? "Coach"
              : "Overview"}
          </Typography>
        </Box>
        <Box
          sx={{
            mx: { sm: "auto" },
          }}
        >
          <Tooltip title="Jump to" placement="bottom">
            <IconButton
              onClick={() => openSpotlight()}
              color="inherit"
              size="small"
              sx={styles}
            >
              <Icon className="outlined">bolt</Icon>
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ display: { xs: "none", sm: "unset" }, mr: { sm: 0.8 } }}>
          <UpdateButton />
        </Box>
        <Box sx={{ display: { xs: "none", sm: "unset" }, mr: { sm: 0.8 } }}>
          <Offline>
            <Tooltip title="You're offline">
              <IconButton
                color="inherit"
                sx={{
                  p: 0,
                  mr: { xs: 0.2, sm: 0.6 },
                  color: global.user.darkMode
                    ? "hsl(240, 11%, 90%)"
                    : "#606060",
                  "&:hover": {
                    background: "rgba(200,200,200,.3)",
                    color: global.user.darkMode ? "hsl(240, 11%, 95%)" : "#000",
                  },
                  "&:focus-within": {
                    background: `${
                      global.user.darkMode
                        ? colors[themeColor]["900"]
                        : colors[themeColor]["50"]
                    }!important`,
                    color: global.user.darkMode ? "hsl(240, 11%, 95%)" : "#000",
                  },
                  transition: "all .2s",
                  "&:active": {
                    opacity: 0.5,
                    transform: "scale(0.95)",
                    transition: "none",
                  },
                }}
              >
                <Icon className="outlined">offline_bolt</Icon>
              </IconButton>
            </Tooltip>
          </Offline>
        </Box>
        <Achievements styles={styles} />
        <InviteButton styles={styles} />
        {!isMobile && <AppsMenu styles={styles} />}
        <Tooltip title="Support">
          <IconButton
            sx={{ ...styles, display: { xs: "none", sm: "inline-flex" } }}
            color="inherit"
            disabled={!window.navigator.onLine}
            onClick={() => window.open("https://dysperse.com/support")}
          >
            <Icon className="outlined">help</Icon>
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
