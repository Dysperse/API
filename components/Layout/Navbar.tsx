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
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMedia, useNetworkState } from "react-use";
import { useSession } from "../../pages/_app";
import { capitalizeFirstLetter } from "../ItemPopup";
import { UpdateButton } from "./UpdateButton";
import InviteButton from "./UserMenu";

/**
 * Navbar component for layout
 * @returns {any}
 */
export function Navbar(): JSX.Element {
  const network = useNetworkState();
  const isMobile = useMedia("(max-width:600px)");
  const session = useSession();
  const router = useRouter();
  const styles = () => {
    return {
      WebkitAppRegion: "no-drag",
      borderRadius: 94,
      p: 0.8,
      m: 0,
      color: session?.user?.darkMode ? "hsl(240,11%,90%)" : "#606060",
      transition: "opacity .2s",
      "&:hover": {
        background: session?.user?.darkMode
          ? "hsl(240,11%,15%)"
          : "rgba(200,200,200,.3)",
        color: session?.user?.darkMode ? "hsl(240,11%,100%)" : "#000",
      },
      "&:active": {
        background: session?.user?.darkMode
          ? "hsl(240,11%,20%)"
          : "rgba(200,200,200,.5)",
        transition: "none",
      },
    };
  };

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
            md: "0!important",
          },
        }),
        transition: "top .4s",
        zIndex: 999,
        "& *": {
          cursor: "unset!important",
        },
        color: {
          xs: session?.user?.darkMode ? "white" : "black",
          md: session?.user?.darkMode ? "white" : "black",
        },
        pr: 0.4,
        height: "calc(70px + env(titlebar-area-height, 0px))",
        WebkitAppRegion: "drag",
        background: {
          xs: session?.user?.darkMode
            ? "rgba(23, 23, 28, .8)"
            : "rgba(255,255,255,.8)",
          md: session?.user?.darkMode
            ? "rgba(23, 23, 28, .8)"
            : "rgba(255,255,255,.7)",
        },
        borderBottom: {
          xs: session?.user?.darkMode
            ? "1px solid hsla(240,11%,15%)"
            : "1px solid rgba(200,200,200,.3)",
          md: "unset",
        },
        backdropFilter: "blur(10px)",
        display: { md: "none" },
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
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
        >
          <Image
            draggable="false"
            placeholder="blur"
            blurDataURL="data:image/png;base64,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"
            src="/logo.svg"
            width={40}
            height={40}
            alt="Logo"
            style={{
              borderRadius: "999px",
              ...(session?.user?.darkMode && {
                filter: "invert(100%)",
              }),
            }}
          />
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "18px",
              userSelect: "none",
            }}
            variant="h6"
          >
            {router.asPath.includes("backlog")
              ? "Backlog"
              : window.location.href.includes("agenda")
              ? capitalizeFirstLetter(
                  isMobile &&
                    window.location.hash.split("agenda/")[1].includes("week")
                    ? "Day"
                    : window.location.hash.split("agenda/")[1]
                )
              : router.asPath.includes("tasks")
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
            mx: { md: "auto" },
          }}
        >
          <Tooltip
            title="Jump to"
            placement="bottom"
            PopperProps={{
              sx: {
                mt: "-5px!important",
              },
            }}
          >
            <IconButton
              onClick={() => {
                navigator.vibrate(50);
                openSpotlight();
              }}
              color="inherit"
              sx={styles}
            >
              <Icon className="outlined">bolt</Icon>
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ display: { xs: "none", md: "unset" }, mr: { md: 0.8 } }}>
          <UpdateButton />
        </Box>
        {!network.online && (
          <Tooltip title="You're offline">
            <IconButton color="inherit" sx={styles}>
              <Icon className="outlined">offline_bolt</Icon>
            </IconButton>
          </Tooltip>
        )}
        <InviteButton styles={styles} />
        <Tooltip title="Support">
          <IconButton
            sx={{ ...styles, display: { xs: "none", md: "inline-flex" } }}
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
