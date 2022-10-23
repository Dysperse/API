import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Cookies from "js-cookie";
import React from "react";
import { BottomNav } from "./BottomNavigation";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
const PWAPrompt: any = dynamic(() => import("react-ios-pwa-prompt"), {
  ssr: false,
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
      <Box
        sx={{
          width: { md: "90px" },
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
          width: {
            sm: `calc(100% - 65px)`,
            md: `calc(100% - 90px)`,
          },
        }}
      >
        <Toolbar sx={{ mb: { sm: 2 } }} />
        <Box
          sx={{
            pt: { xs: 1.8, sm: 2 },
          }}
        >
          {children}
          <Toolbar />
        </Box>
        <BottomNav />
      </Box>
    </Box>
  );
}

export default ResponsiveDrawer;
