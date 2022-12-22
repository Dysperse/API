import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
import { BottomNav } from "./BottomNavigation";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Box, Grow, Toolbar } from "@mui/material";
import { KeyboardShortcutsModal } from "./KeyboardShortcutsModal";

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
      <KeyboardShortcutsModal />
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
