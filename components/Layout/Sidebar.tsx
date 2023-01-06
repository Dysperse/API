import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { colors } from "../../lib/colors";
import Settings from "../Settings/index";

import {
  Box,
  Drawer,
  Icon,
  IconButton,
  Tab,
  Tabs,
  Tooltip,
} from "@mui/material";

export function Sidebar() {
  const [value, setValue] = useState<number>(0);
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

  const styles = (active) => {
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
        // maxWidth: 55,
        // minHeight: 55,
        display: "flex",
        alignItems: "center",
        borderRadius: 5,
        justifyContent: "center",
        border: "1px solid transparent",
      },
      "&:hover .material-symbols-outlined": {
        background: colors[themeColor][50],
        // border: "1px solid #ccc",
      },
      "&:active .material-symbols-outlined": {
        background: colors[themeColor][100],
        border: "1px solid " + colors[themeColor][200],
      },
    };
  };

  useEffect(() => {
    const url = router.asPath;

    switch (url) {
      case "":
      case "/":
      case "/tasks":
        setValue(0);
        break;
      case "/trash":
      case "/items":
        setValue(1);
        break;
      case "/coach":
        setValue(2);
        break;
      case "/spaces":
        setValue(3);
        break;
      default:
        if (router.asPath.includes("/rooms")) {
          setValue(1);
        } else {
          setValue(0);
        }
    }
  }, [router.asPath]);

  return (
    <>
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
            overflowX: "hidden",
            zIndex: 99,
            borderRight: global.user.darkMode
              ? "1px solid rgba(255,255,255,0.1)"
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
          <Tabs
            orientation="vertical"
            TabIndicatorProps={{
              children: <span className="MuiTabs-indicatorSpan" />,
            }}
            variant="fullWidth"
            value={value}
            onChange={(event, newValue) => {
              // alert(newValue);
            }}
            aria-label="basic tabs example"
            sx={{
              "& .MuiTabs-indicator": {
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "transparent",
                height: "100%",
                width: "100%",
              },
              "& .MuiTabs-indicatorSpan": {
                minWidth: 50,
                pointerEvents: "none",
                height: 50,
                width: 50,
                background: `linear-gradient(45deg, ${
                  global.user.darkMode
                    ? "hsl(240,11%,14%)"
                    : colors[themeColor][100]
                } 0%, ${
                  global.user.darkMode
                    ? "hsl(240,11%,13%)"
                    : colors[themeColor][100]
                } 100%)`,
                zIndex: -1,
                borderRadius: 5,
              },
              // Tab styles
              "& .MuiTab-root": {
                width: 55,
                "&.Mui-selected *": {
                  color:
                    colors[themeColor][global.user.darkMode ? 50 : 900] +
                    "!important",
                  fontVariationSettings: `"FILL" 1, "wght" 300, "GRAD" 1, "opsz" 40`,
                },
              },
            }}
          >
            <Tab
              disableRipple
              sx={styles}
              onClick={() => router.push("/tasks").then(() => setValue(0))}
              icon={
                <Tooltip title="Lists" placement="right">
                  <span
                    className={`material-symbols-${
                      router.asPath.includes("/tasks") ||
                      router.asPath == "/" ||
                      router.asPath == ""
                        ? "rounded"
                        : "outlined"
                    }`}
                  >
                    verified
                  </span>
                </Tooltip>
              }
            />
            <Tab
              disableRipple
              sx={styles}
              onClick={() => router.push("/items").then(() => setValue(1))}
              icon={
                <Tooltip title="Inventory" placement="right">
                  <span
                    className={`material-symbols-${
                      router.asPath == "/items" ||
                      router.asPath.includes("rooms")
                        ? "rounded"
                        : "outlined"
                    }`}
                  >
                    category
                  </span>
                </Tooltip>
              }
            />
            <Tab
              disableRipple
              sx={styles}
              onClick={() => router.push("/coach").then(() => setValue(2))}
              icon={
                <Tooltip title="Coach" placement="right">
                  <span
                    className={`material-symbols-${
                      router.asPath === "/coach" ? "rounded" : "outlined"
                    }`}
                  >
                    routine
                  </span>
                </Tooltip>
              }
            />
            <Tab
              disableRipple
              sx={styles}
              onClick={() => router.push("/spaces").then(() => setValue(3))}
              icon={
                <Tooltip title="Spaces" placement="right">
                  <span
                    className={`material-symbols-${
                      router.asPath === "/spaces" ? "rounded" : "outlined"
                    }`}
                  >
                    view_agenda
                  </span>
                </Tooltip>
              }
            />
          </Tabs>
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
                <IconButton color="inherit" disableRipple sx={styles}>
                  <Icon
                    className="material-symbols-outlined"
                    sx={{
                      fontVariationSettings: `"FILL" 0, "wght" 300, "GRAD" 1, "opsz" 40!important`,
                    }}
                  >
                    settings
                  </Icon>
                </IconButton>
              </Tooltip>
            </Settings>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
