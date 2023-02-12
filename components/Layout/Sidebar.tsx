import { openSpotlight } from "@mantine/spotlight";
import { Box, Icon, Tooltip } from "@mui/material";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { useHotkeys } from "react-hotkeys-hook";
import { colors } from "../../lib/colors";
import InviteButton from "./InviteButton";

const AppsMenu = dynamic(() => import("./AppsMenu"));
const SearchPopup = dynamic(() => import("./Search"));
const Achievements = dynamic(() => import("./Achievements"));

export function Sidebar() {
  const router = useRouter();

  useHotkeys(
    "ctrl+1",
    (e) => {
      e.preventDefault();
      router.push("/zen");
    },
    [open]
  );

  useHotkeys(
    "ctrl+4",
    (e) => {
      e.preventDefault();
      router.push("/items");
    },
    [open]
  );
  useHotkeys(
    "ctrl+3",
    (e) => {
      e.preventDefault();
      router.push("/coach");
    },
    [open]
  );
  useHotkeys(
    "ctrl+2",
    (e) => {
      e.preventDefault();
      router.push("/tasks");
    },
    [open]
  );

  const styles = (active: any = false) => {
    return {
      color: colors[themeColor][global.user.darkMode ? 50 : 700],
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
        background: global.user.darkMode
          ? "hsl(240,11%,14%)"
          : colors[themeColor][50],
      },
      "&:focus-visible span": {
        boxShadow: global.user.darkMode
          ? "0px 0px 0px 1.5px hsl(240,11%,50%) !important"
          : "0px 0px 0px 1.5px var(--themeDark) !important",
      },
      userSelect: "none",
      ...(active && {
        " .material-symbols-outlined,  .material-symbols-rounded": {
          background: global.user.darkMode
            ? "hsl(240,11%,17%)"
            : colors[themeColor][100],
        },
      }),
    };
  };
  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex!important" },
        maxWidth: "85px",
        width: "80px",
        zIndex: "1!important",
        filter: "none!important",
        overflowX: "hidden",
        background: {
          sm: global.user.darkMode
            ? "hsla(240,11%,5%)"
            : "rgba(250,250,250,.8)",
        },
        height: "100vh",
        backdropFilter: "blur(10px)",
        position: "fixed",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Image
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
        src="/logo.svg"
        width={50}
        height={50}
        alt="Logo"
        style={{
          marginTop: "15px",
          ...(global.user.darkMode && {
            filter: "invert(100%)",
          }),
        }}
      />
      <Box sx={{ mt: "auto" }} />
      <Box
        sx={styles(
          router.asPath === "/zen" ||
            router.asPath === "/" ||
            router.asPath === ""
        )}
        onClick={() => router.push("/zen")}
        onMouseDown={() => router.push("/zen")}
      >
        <Tooltip title="Start" placement="right">
          <span
            className={`material-symbols-${
              router.asPath === "/zen" ||
              router.asPath === "/" ||
              router.asPath === ""
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
        onClick={() => router.push("/tasks")}
        onMouseDown={() => router.push("/tasks")}
      >
        <Tooltip title="Lists" placement="right">
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
        sx={styles(router.asPath === "/coach")}
        onClick={() => router.push("/coach")}
        onMouseDown={() => router.push("/coach")}
      >
        <Tooltip title="Coach" placement="right">
          <span
            className={`material-symbols-${
              router.asPath === "/coach" ? "rounded" : "outlined"
            }`}
          >
            rocket_launch
          </span>
        </Tooltip>
      </Box>
      <Box
        sx={styles(
          router.asPath === "/items" || router.asPath.includes("rooms")
        )}
        onClick={() => router.push("/items")}
        onMouseDown={() => router.push("/items")}
      >
        <Tooltip title="Inventory" placement="right">
          <span
            className={`material-symbols-${
              router.asPath === "/items" || router.asPath.includes("rooms")
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
        <SearchPopup styles={styles} />
        <Tooltip title="Jump to" placement="right">
          <Box onClick={() => openSpotlight()} sx={styles(false)}>
            <Icon className="outlined">bolt</Icon>
          </Box>
        </Tooltip>
        <InviteButton styles={styles} />
      </Box>
    </Box>
  );
}
