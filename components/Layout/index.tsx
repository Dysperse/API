import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useStatusBar } from "../../hooks/useStatusBar";
import { BottomNav } from "./BottomNavigation";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

import {
  Box,
  Dialog,
  Grow,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";

const PWAPrompt: any = dynamic(() => import("react-ios-pwa-prompt"), {
  ssr: false,
});

const Transition = React.forwardRef(function Transition(
  props: any,
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
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  useStatusBar(open);
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
        scroll="body"
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
            sx={{ ml: "auto", color: "#000" }}
            disableRipple
            onClick={() => setOpen(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </IconButton>
        </Box>
        <Box sx={{ mt: 2 }}>
          {[
            {
              name: "General",
              shortcuts: [
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
                  name: "Toggle group list",
                  keys: ["ctrl", "p"],
                },
                {
                  name: "Toggle app drawer",
                  keys: ["ctrl", "q"],
                },
              ],
            },
            {
              name: "Navigation",
              shortcuts: [
                {
                  name: "Dashboard",
                  keys: ["ctrl", "d"],
                },
                {
                  name: "Inventory",
                  keys: ["ctrl", "e"],
                },
                {
                  name: "Goals",
                  keys: ["ctrl", "g"],
                },
                {
                  name: "Spaces",
                  keys: ["ctrl", "l"],
                },
                {
                  name: "Settings",
                  keys: ["ctrl", ","],
                },
              ],
            },
            // Up arrow unicode
            // &#8593;
            // Down arrow unicode
            // &#8595;
            {
              name: "Inventory",
              shortcuts: [
                {
                  name: "Navigate 1 room upwards",
                  keys: ["ctrl", <>&#8593;</>],
                },
                {
                  name: "Navigate 1 room downwards",
                  keys: ["ctrl", <>&#8595;</>],
                },
              ],
            },
            {
              name: "Item management",
              shortcuts: [
                {
                  name: "Delete an item",
                  keys: ["ctrl", "shift", "d"],
                },
                {
                  name: "Edit an item",
                  keys: ["ctrl", "shift", "e"],
                },
                {
                  name: "Star an item",
                  keys: ["ctrl", "shift", "s"],
                },
                {
                  name: "Move to another room",
                  keys: ["ctrl", "shift", "m"],
                },
                {
                  name: "Focus on note input",
                  keys: ["alt", "n"],
                },
              ],
            },
          ].map((group, index) => (
            <>
              <Typography sx={{ mt: index == 0 ? 0 : 2, fontWeight: "700" }}>
                {group.name}
              </Typography>
              {group.shortcuts.map((shortcut) => (
                <Typography className="flex" sx={{ mt: 1 }}>
                  <Box>{shortcut.name}</Box>{" "}
                  <Box className="ml-auto">
                    {shortcut.keys.map((key) => (
                      <span className="kbd">{key}</span>
                    ))}
                  </Box>
                </Typography>
              ))}
            </>
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
