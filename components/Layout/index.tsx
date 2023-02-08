import { Box } from "@mui/material";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { BottomNav } from "./BottomNavigation";
import { Sidebar } from "./Sidebar";

const KeyboardShortcutsModal = dynamic(
  () => import("./KeyboardShortcutsModal")
);

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
  const router = useRouter();

  return (
    <Box
      onContextMenu={(e) => e.preventDefault()}
      sx={{
        display: "flex",
      }}
    >
      {router && (
        <PWAPrompt
          copyBody="Add Dysperse to your home screen to have easy access, recieve push notifications, and more!"
          copyTitle="Add Dysperse to your home screen!"
        />
      )}
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
          position: "relative",
          width: {
            xs: "100%",
            sm: `calc(100% - 65px)`,
            md: `calc(100% - 85px)`,
          },
        }}
      >
        <Box
          sx={{
            height: "70px",
            pt: { xs: 1.8, sm: 0 },
            pl: { md: "85px" },
          }}
        >
          {children}
        </Box>
        <BottomNav />
      </Box>
    </Box>
  );
}

export default ResponsiveDrawer;
