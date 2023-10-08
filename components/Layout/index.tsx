import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useAccountStorage } from "@/lib/client/useAccountStorage";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { useStatusBar } from "@/lib/client/useStatusBar";
import {
  Box,
  Button,
  CssBaseline,
  Snackbar,
  useMediaQuery,
} from "@mui/material";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { createRef, useEffect, useState } from "react";
import useSWR from "swr";
import { getTotal, max } from "../Group/Storage";
import { BottomNav, shouldHideNavigation } from "./Navigation/BottomNavigation";
import { Sidebar } from "./Navigation/Sidebar";
import { UpdateButton } from "./Navigation/UpdateButton";

const KeyboardShortcutsModal = dynamic(
  () => import("./Navigation/KeyboardShortcutsModal")
);

const NotificationsPrompt = dynamic(() => import("./NotificationsPrompt"));
const TosModal = dynamic(() => import("./TosModal"));

const ReleaseModal = dynamic(() => import("./ReleaseModal"));

export const containerRef: any = createRef();

/**
 * Drawer component
 * @param {any} {children} Children
 * @returns {any}
 */
export default function AppLayout({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const { data, error } = useSWR(["property/storage"]);
  const hasReachedLimit = data && getTotal(data, data.tasks, data.items) >= max;

  const storage = useAccountStorage();

  useEffect(() => {
    if (error) {
      storage?.setIsReached("error");
    } else {
      storage?.setIsReached(hasReachedLimit);
    }
  }, [error, hasReachedLimit, storage]);

  const [dismissed, setDismissed] = useState<boolean>(false);
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  useStatusBar(palette[1]);

  useEffect(() => {
    const variables = {
      "--overlay-dark": addHslAlpha(palette[1], 0.5),
      "--toast-bg": addHslAlpha(palette[3], 0.8),
      "--toast-text": palette[11],
      "--toast-solid": palette[7],
      "--bg": palette[2],
    };

    Object.entries(variables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [palette]);

  const router = useRouter();
  const shouldHide = shouldHideNavigation(router.asPath);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isTablet = useMediaQuery("(max-width: 900px)");

  useEffect(() => {
    if (containerRef && router.asPath) {
      containerRef?.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [router.asPath]);

  if (session.properties.length === 0) {
    return (
      <Box>
        Hmmm.... You find yourself in a strange place. You don&apos;t have
        access to any groups, or there are none in your account. Please contact
        support if this problem persists.
      </Box>
    );
  }

  return (
    <Box
      onContextMenu={(e) => !isMobile && e.preventDefault()}
      sx={{ display: "flex" }}
    >
      <ReleaseModal />
      <Snackbar
        open={!dismissed && hasReachedLimit && !error}
        autoHideDuration={6000}
        onClose={() => null}
        sx={{
          mb: { xs: 7, sm: 2 },
          transition: "all .2s",
          zIndex: 999,
          userSelect: "none",
        }}
        action={
          <>
            <Button
              size="small"
              color="inherit"
              sx={{ color: isDark ? "#000" : "#fff" }}
              onClick={() => setDismissed(true)}
            >
              Hide for now
            </Button>
            <Button
              onClick={() =>
                router.push(`/spaces/${session.property.propertyId}`)
              }
              color="inherit"
              size="small"
              sx={{ color: isDark ? "#000" : "#fff" }}
            >
              More info
            </Button>
          </>
        }
        message="You've reached the storage limits for this group."
      />
      <NotificationsPrompt />
      {!session.user.agreeTos && <TosModal />}
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
          height: "100dvh",
          p: 0,
          display: "flex",
          flexDirection: "column",
          ml: { md: "-85px" },
          position: "relative",
          width: {
            xs: "100%",
            sm: "calc(100% - 65px)",
            md: "calc(100% - 85px)",
          },
        }}
      >
        <Box
          ref={containerRef}
          sx={{
            height: "100dvh",
            overflowY: "scroll",
            overflowX: "hidden",
            overscrollBehaviorY: "contain",
            maxWidth: "100dvw",
            borderRadius: {
              xs: shouldHide ? "0px" : "0 0 20px 20px",
              sm: "20px 0 0 20px",
            },
            transition: "border-radius .3s, margin .3s",
            ml: { md: shouldHide ? "0px" : "85px" },
            background: palette[1],
          }}
        >
          {children}
        </Box>
        <CssBaseline />
        {isTablet && <BottomNav />}
      </Box>
    </Box>
  );
}
