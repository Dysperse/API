import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Cookies from "js-cookie";
import React from "react";
import { BottomNav } from "./BottomNavigation";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useHotkeys } from "react-hotkeys-hook";
import { Dialog, IconButton } from "@mui/material";
const PWAPrompt: any = dynamic(() => import("react-ios-pwa-prompt"), {
  ssr: false,
});
import { TransitionProps } from "@mui/material/transitions";
import Grow from "@mui/material/Grow";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Grow in={props.open} ref={ref} {...props} />;
});
/**
 * Drawer component
 * @param {any} {children} Children
 * @returns {any}
 */
function ResponsiveDrawer({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const [collapsed, setCollapsed] = React.useState(
    Cookies.get("collapsed") ? JSON.parse(Cookies.get("collapsed")) : false
  );
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  useHotkeys(
    "ctrl+/",
    (e) => {
      e.preventDefault();
      setOpen(!open);
    },
    [open]
  );

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      {router && (
        <PWAPrompt
          copyBody="Add Carbon to your home screen to have easy access, recieve push notifications, and more!"
          copyTitle="Add Carbon to your home screen!"
        />
      )}
      <Navbar />
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={() => setOpen(false)}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 5,
            minWidth: "500px",
            p: 3,
            maxWidth: "calc(100vw - 32px)",
          },
        }}
      >
        <Box className="flex items-center">
          <Typography sx={{ fontWeight: "700" }} variant="h5">
            Keyboard shortcuts
          </Typography>
          <IconButton
            sx={{ ml: "auto" }}
            disableRipple
            onClick={() => setOpen(true)}
          >
            <span className="material-symbols-outlined">close</span>
          </IconButton>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ fontWeight: "700" }}>General</Typography>

          {[
            {
              name: "Show this dialog",
              keys: ["ctrl", "/"],
            },
            {
              name: "Open search",
              keys: ["ctrl", "k"],
            },
            {
              name: "Toggle inbox",
              keys: ["ctrl", "i"],
            },
            {
              name: "Toggle app drawer",
              keys: ["ctrl", "q"],
            },
          ].map((shortcut) => (
            <Typography className="mt-2 flex">
              <Box>{shortcut.name}</Box>{" "}
              <Box className="ml-auto">
                {shortcut.keys.map((key) => (
                  <span className="kbd">{key}</span>
                ))}
              </Box>
            </Typography>
          ))}
        </Box>
      </Dialog>
      <Box
        sx={{
          width: { md: "85px" },
          flexShrink: { md: 0 },
        }}
      >
        <Sidebar />
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 90,
          p: 0,
          ml: { md: "-85px" },
          // background: "red",
          width: {
            sm: `calc(100% - 65px)`,
            md: `calc(100% - 85px)`,
          },
        }}
      >
        <Toolbar />
        <Box
          sx={{
            height: "70px",
            pt: { xs: 1.8, sm: 0 },
            pl: { md: "85px" },
          }}
        >
          {children}
          {
            !(
              window.location.href.includes("/items") ||
              (window.location.href.includes("/rooms") && <Toolbar />)
            )
          }
        </Box>
        <BottomNav />
      </Box>
    </Box>
  );
}

export default ResponsiveDrawer;
