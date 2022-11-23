import { Tab, Tabs } from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import hexToRgba from "hex-to-rgba";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { colors } from "../../lib/colors";
import Settings from "../Settings/index";

export function Sidebar() {
  const [value, setValue] = useState<number>(0);
  const router = useRouter();

  const styles = (active) => {
    return {
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
          transform: "scale(0.9)",
          opacity: 0.8,
          transition: "none",
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
      case "/tidy":
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "transparent",
                height: "100%",
                width: "100%",
              },
              "& .MuiTabs-indicatorSpan": {
                minWidth: 55,
                height: 55,
                width: 55,
                backgroundColor: hexToRgba(colors[themeColor][500], 0.1),
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
                <Tooltip title="Tasks" placement="right">
                  <span
                    className={`material-symbols-${
                      router.asPath === "/tasks" ? "rounded" : "outlined"
                    }`}
                  >
                    view_kanban
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
                    blur_circular
                  </span>
                </Tooltip>
              }
            />
            <Tab
              disableRipple
              sx={styles}
              onClick={() => router.push("/tidy").then(() => setValue(3))}
              icon={
                <Tooltip title="Tidy" placement="right">
                  <span
                    className={`material-symbols-${
                      router.asPath === "/tidy" ? "rounded" : "outlined"
                    }`}
                  >
                    auto_awesome
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
