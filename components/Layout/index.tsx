import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useAccountStorage } from "@/lib/client/useAccountStorage";
import { useApi } from "@/lib/client/useApi";
import { useColor } from "@/lib/client/useColor";
import { useOnlineStatus } from "@/lib/client/useOnlineStatus";
import { useSession } from "@/lib/client/useSession";
import { toastStyles } from "@/lib/client/useTheme";
import { Box, Button, CssBaseline, Snackbar } from "@mui/material";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Group from "../Group";
import { getTotal, max } from "../Group/Storage";
import { BottomNav } from "./Navigation/BottomNavigation";
import { Sidebar } from "./Navigation/Sidebar";
import { UpdateButton } from "./Navigation/UpdateButton";
const KeyboardShortcutsModal = dynamic(
  () => import("./Navigation/KeyboardShortcutsModal")
);

const ReleaseModal = dynamic(() => import("./ReleaseModal"));

/**
 * Drawer component
 * @param {any} {children} Children
 * @returns {any}
 */
function AppLayout({ children }: { children: JSX.Element }): JSX.Element {
  // Check if user has reached storage limits
  const { data, error } = useApi("property/storage");
  const hasReachedLimit = data && getTotal(data, data.tasks, data.items) >= max;

  const storage = useAccountStorage();
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (!isOnline) {
      const myPromise = new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          if (navigator.onLine) {
            clearInterval(interval);
            resolve("");
          }
        }, 1000); // adjust the interval as needed
      });

      toast.promise(
        myPromise,
        {
          loading: "You're offline. Waiting for an internet connection...",
          success: "Internet connection restored!",
          error: "Error!?",
        },
        toastStyles
      );
    }
  }, [isOnline]);

  useEffect(() => {
    if (error) {
      storage?.setIsReached("error");
    } else {
      storage?.setIsReached(hasReachedLimit);
    }
  }, [error, hasReachedLimit, storage]);

  const [dismissed, setDismissed] = useState<boolean>(false);
  const session = useSession();
  const palette = useColor(session.themeColor, session.user.darkMode);

  useEffect(() => {
    document
      .querySelector(`meta[name="theme-color"]`)
      ?.setAttribute("content", palette[1]);

    document.documentElement.style.setProperty(
      "--overlay-dark",
      addHslAlpha(palette[1], 0.5)
    );
  });

  return (
    <Box
      onContextMenu={(e) => e.preventDefault()}
      onTouchStart={(e: any) => {
        /**
         * TODO: Fix, this throws an error every time the user performs a touch action on mobile
         * "Unable to preventDefault inside passive event listener invocation."
         */
        if (e.pageX > 20 && e.pageX < window.innerWidth - 20) return;
        e.preventDefault();
      }}
      sx={{ display: "flex" }}
    >
      <ReleaseModal />
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
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => null}
        sx={{ mb: { xs: 7, sm: 2 }, transition: "all .3s" }}
        message="An error occured while trying to get your account storage information"
      />
      <UpdateButton />
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
            sm: "calc(100% - 65px)",
            md: "calc(100% - 85px)",
          },
        }}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
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
        </motion.div>
        <CssBaseline />
        <BottomNav />
      </Box>
    </Box>
  );
}

export default AppLayout;
