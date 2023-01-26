import { Box, Button, Drawer, Icon, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import { useHotkeys } from "react-hotkeys-hook";
import { colors } from "../../lib/colors";
import Settings from "../Settings/index";

export function Sidebar() {
  const router = useRouter();

  useHotkeys(
    "ctrl+d",
    (e) => {
      e.preventDefault();
      router.push("/tasks");
    },
    [open]
  );

  useHotkeys(
    "ctrl+e",
    (e) => {
      e.preventDefault();
      router.push("/items");
    },
    [open]
  );
  useHotkeys(
    "ctrl+g",
    (e) => {
      e.preventDefault();
      router.push("/coach");
    },
    [open]
  );
  useHotkeys(
    "ctrl+l",
    (e) => {
      e.preventDefault();
      router.push("/spaces");
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
        border: "1px solid transparent",
      },
      "&:hover .material-symbols-outlined": {
        background: global.user.darkMode
          ? "hsl(240,11%,14%)"
          : colors[themeColor][100],
      },
      "&:focus-visible span": {
        boxShadow: global.user.darkMode
          ? "0px 0px 0px 1.5px hsl(240,11%,50%) !important"
          : "0px 0px 0px 1.5px var(--themeDark) !important",
      },
      "&:active .material-symbols-outlined": {
        background: global.user.darkMode
          ? "hsl(240,11%,17%)"
          : colors[themeColor][100],
      },
      userSelect: "none",
      ...(active && {
        " .material-symbols-outlined,  .material-symbols-rounded": {
          background: global.user.darkMode
            ? "hsl(240,11%,17%)"
            : colors[themeColor][100],
          border:
            "1px solid " +
            (global.user.darkMode
              ? "hsl(240,11%,20%)"
              : colors[themeColor][200]),
        },
      }),
    };
  };
  return (
    <Drawer
      variant="permanent"
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        display: { xs: "none", md: "flex!important" },
        "& .MuiDrawer-paper": {
          maxWidth: "85px",
          width: "80px",
          filter: "none!important",
          overflowX: "hidden",
          zIndex: 99,
          borderRight: global.user.darkMode
            ? "1px solid rgba(255,255,255,0.1)"
            : global.user.darkMode
            ? "1px solid hsla(240,11%,15%)"
            : "1px solid rgba(200,200,200,.3)",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          ...(global.user.darkMode && {
            background: "hsl(240, 11%, 10%)",
          }),
        },
      }}
      open
    >
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          pt: "70px",
        }}
      >
        <Box sx={{ mt: "auto" }} />

        <Box
          sx={styles(
            router.asPath.includes("/tasks") ||
              router.asPath === "/" ||
              router.asPath === ""
          )}
          onClick={() => router.push("/tasks")}
        >
          <Tooltip title="Lists" placement="right">
            <span
              className={`material-symbols-${
                router.asPath.includes("/tasks") ||
                router.asPath === "/" ||
                router.asPath === ""
                  ? "rounded"
                  : "outlined"
              }`}
            >
              verified
            </span>
          </Tooltip>
        </Box>
        <Box
          sx={styles(router.asPath === "/coach")}
          onClick={() => router.push("/coach")}
        >
          <Tooltip title="Coach" placement="right">
            <span
              className={`material-symbols-${
                router.asPath === "/coach" ? "rounded" : "outlined"
              }`}
            >
              routine
            </span>
          </Tooltip>
        </Box>
        <Box
          sx={styles(
            router.asPath === "/items" || router.asPath.includes("rooms")
          )}
          onClick={() => router.push("/items")}
        >
          <Tooltip title="Inventory" placement="right">
            <span
              className={`material-symbols-${
                router.asPath === "/items" || router.asPath.includes("rooms")
                  ? "rounded"
                  : "outlined"
              }`}
            >
              category
            </span>
          </Tooltip>
        </Box>
        <Box
          sx={styles(router.asPath === "/spaces")}
          onClick={() => router.push("/spaces")}
        >
          <Tooltip title="Spaces" placement="right">
            <span
              className={`material-symbols-${
                router.asPath === "/spaces" ? "rounded" : "outlined"
              }`}
            >
              view_agenda
            </span>
          </Tooltip>
        </Box>
        <Box
          sx={{
            mt: "auto",
            mb: 1,
          }}
        >
          <Settings>
            <Tooltip
              title={global.user.email}
              placement="left"
              PopperProps={{
                sx: { pointerEvents: "none" },
              }}
            >
              <Button
                color="inherit"
                disableRipple
                sx={{
                  ...styles(),
                  background: "transparent!important",
                }}
              >
                <Icon
                  className="material-symbols-outlined"
                  sx={{
                    fontVariationSettings: `"FILL" 0, "wght" 300, "GRAD" 1, "opsz" 40!important`,
                  }}
                >
                  settings
                </Icon>
              </Button>
            </Tooltip>
          </Settings>
        </Box>
      </Box>
    </Drawer>
  );
}
