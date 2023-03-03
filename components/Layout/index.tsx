import { Box, Button, CssBaseline, Snackbar, Toolbar } from "@mui/material";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import { useAccountStorage, useSession } from "../../pages/_app";
import { ApiResponse } from "../../types/client";
import Group from "../Group";
import { getTotal, max } from "../Group/Storage";
import { BottomNav } from "./BottomNavigation";
import { Navbar } from "./Navbar";
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

  // Check if user has reached storage limits
  const { data, error, url }: ApiResponse = useApi("property/storage");
  const hasReachedLimit = data && getTotal(data, data.tasks, data.items) >= max;

  const storage = useAccountStorage();

  useEffect(() => {
    if (error) {
      storage?.setIsReached("error");
    } else {
      storage?.setIsReached(hasReachedLimit);
    }
  }, [error, hasReachedLimit, storage]);

  const [dismissed, setDismissed] = useState(false);
  const session = useSession();

  return (
    <Box
      onContextMenu={(e) => e.preventDefault()}
      sx={{
        display: "flex",
      }}
    >
      <Snackbar
        open={!dismissed && hasReachedLimit && !error}
        autoHideDuration={6000}
        onClose={() => null}
        sx={{
          mb: { xs: 7, sm: 2 },
          transition: "all .3s",
          zIndex: 999,
          userSelect: "none",
        }}
        action={
          <>
            <Button
              size="small"
              color="inherit"
              sx={{ color: session.user.darkMode ? "#000" : "#fff" }}
              onClick={() => setDismissed(true)}
            >
              Hide for now
            </Button>
            <Group
              data={{
                id: session.property.propertyId,
                accessToken: session.property.accessToken,
              }}
            >
              <Button
                color="inherit"
                size="small"
                sx={{ color: session.user.darkMode ? "#000" : "#fff" }}
              >
                More info
              </Button>
            </Group>
          </>
        }
        message="You've reached the storage limits for this group."
      />
      <Snackbar
        open={!navigator.onLine}
        autoHideDuration={6000}
        onClose={() => null}
        sx={{ mb: { xs: 7, sm: 2 }, transition: "all .3s" }}
        message="You're offline. Please check your network connection."
      />
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => null}
        sx={{ mb: { xs: 7, sm: 2 }, transition: "all .3s" }}
        message="An error occured while trying to get your account storage information"
      />
      <Navbar />
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
        <Toolbar sx={{ display: { md: "none" } }} />
        <Box
          sx={{
            height: "70px",
            pt: { xs: 1.8, sm: 0 },
            pl: { md: "85px" },
          }}
        >
          {children}
        </Box>
        <CssBaseline />
        <BottomNav />
      </Box>
    </Box>
  );
}

export default ResponsiveDrawer;
