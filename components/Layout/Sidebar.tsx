import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import hexToRgba from "hex-to-rgba";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { colors } from "../../lib/colors";
import Settings from "../Settings/index";
import { useHotkeys } from "react-hotkeys-hook";

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
      router.push("/insights");
    },
    [open]
  );

  const styles = (active) => {
    return {
      color: colors[themeColor][global.theme === "dark" ? 50 : 500],
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
        },
    };
  };

  useEffect(() => {
    const url = router.asPath;

    switch (url) {
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
      case "/insights":
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
            zIndex: 99,
            border: 0,
            height: "100vh",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            ...(global.theme === "dark" && {
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
                  colors[themeColor][global.theme === "dark" ? 800 : 200]
                } 0%, ${
                  colors[themeColor][global.theme === "dark" ? 900 : 100]
                } 100%)`,
                zIndex: -1,
                borderRadius: 5,
              },
              // Tab styles
              "& .MuiTab-root": {
                width: 55,
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
                      router.asPath === "/tasks" ? "rounded" : "outlined"
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
              onClick={() => router.push("/insights").then(() => setValue(3))}
              icon={
                <Tooltip title="Insights" placement="right">
                  <span
                    className={`material-symbols-${
                      router.asPath === "/insights" ? "rounded" : "outlined"
                    }`}
                  >
                    leaderboard
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
