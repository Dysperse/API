import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { colors } from "../../lib/colors";
import Settings from "../Settings/index";

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
      color: colors[themeColor][global.user.darkMode ? 50 : 500],
      borderRadius: 3,
      textTransform: "none",
      width: 55,
      maxWidth: 55,
      minHeight: 55,
      height: 55,
      // icon
      "& .material-symbols-rounded, & .material-symbols-outlined": {
        transition: "all 0.2s ease-in-out",
      },
      "&:active .material-symbols-rounded, &:active .material-symbols-outlined":
        {
          opacity: 0.5,
          transition: "none!important",
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
              : "1px solid rgba(200,200,200,.5)",
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
                minWidth: 55,
                pointerEvents: "none",
                height: 55,
                width: 55,
                background: `linear-gradient(45deg, ${
                  global.user.darkMode
                    ? "hsl(240,11%,14%)"
                    : colors[themeColor][100]
                } 0%, ${
                  global.user.darkMode
                    ? "hsl(240,11%,13%)"
                    : colors[themeColor][50]
                } 100%)`,
                zIndex: -1,
                borderRadius: 5,
              },
              // Tab styles
              "& .MuiTab-root": {
                width: 55,
                "&.Mui-selected *": {
                  color:
                    colors[themeColor][global.user.darkMode ? 50 : 700] +
                    "!important",
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
                      router.asPath == "/tasks" ||
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
              mb: 2,
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
                  <span className="material-symbols-outlined">settings</span>
                </IconButton>
              </Tooltip>
            </Settings>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
