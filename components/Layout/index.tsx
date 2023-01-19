import { Box, Grow, Toolbar, useMediaQuery } from "@mui/material";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
import { BottomNav } from "./BottomNavigation";
import { KeyboardShortcutsModal } from "./KeyboardShortcutsModal";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

const PWAPrompt: any = dynamic(() => import("react-ios-pwa-prompt"), {
  ssr: false,
});

export const Transition = React.forwardRef(function Transition(
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
  const router = useRouter();
  const trigger = useMediaQuery("(min-width: 480px)");

  return (
    <Box sx={{ display: "flex" }}>
      {router && (
        <PWAPrompt
          copyBody="Add Dysperse to your home screen to have easy access, recieve push notifications, and more!"
          copyTitle="Add Dysperse to your home screen!"
        />
      )}
      <Navbar />
      {trigger && <KeyboardShortcutsModal />}
      <Box
        sx={{
          width: { md: "85px" },
          flexShrink: { md: 0 },
        }}
      >
        {!trigger && <Sidebar />}
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 90,
          p: 0,
          ml: { md: "-85px" },
          position: "relative",
          width: {
            xs: "100%",
            sm: `calc(100% - 65px)`,
            md: `calc(100% - 85px)`,
          },
        }}
      >
        <Toolbar
          sx={{
            height: "calc(70px + env(titlebar-area-height, 0px))",
          }}
        />
        <Box
          sx={{
            height: "70px",
            pt: { xs: 1.8, sm: 0 },
            pl: { md: "85px" },
          }}
        >
          {children}
          <Toolbar />
        </Box>
        {trigger && <BottomNav />}
      </Box>
    </Box>
  );
}

export default ResponsiveDrawer;
