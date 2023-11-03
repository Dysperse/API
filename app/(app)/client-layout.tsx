"use client";
import { containerRef } from "@/app/(app)/container";
import { getTotal, max } from "@/app/(app)/spaces/Group/Storage";
import {
  BottomNav,
  shouldHideNavigation,
} from "@/components/Layout/Navigation/BottomNavigation";
import KeyboardShortcutsModal from "@/components/Layout/Navigation/KeyboardShortcuts";
import { Sidebar } from "@/components/Layout/Navigation/Sidebar";
import { UpdateButton } from "@/components/Layout/Navigation/UpdateButton";
import NotificationsPrompt from "@/components/Layout/NotificationsPrompt";
import ReleaseModal from "@/components/Layout/ReleaseModal";
import TosModal from "@/components/Layout/TosModal";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { SessionProvider, useSession } from "@/lib/client/session";
import {
  AccountStorageState,
  StorageContext,
  useAccountStorage,
} from "@/lib/client/useAccountStorage";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles, useCustomTheme } from "@/lib/client/useTheme";
import {
  Box,
  Button,
  CssBaseline,
  NoSsr,
  Snackbar,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import useSWR, { SWRConfig } from "swr";
import { fetcher } from "./fetcher";

// dayjs shi
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import isBetween from "dayjs/plugin/isBetween";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import isoWeek from "dayjs/plugin/isoWeek";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(isTomorrow);
dayjs.extend(isToday);
dayjs.extend(advancedFormat);
dayjs.extend(isoWeek);
dayjs.extend(relativeTime);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

function ActivitySave() {
  const { session } = useSession();
  const params: any = [
    "user/setActive",
    {
      timeZone: session.user.timeZone,
    },
  ];
  useSWR(params, fetcher(params, session) as any, { refreshInterval: 300000 });

  return <></>;
}

export default function ClientLayout({ children, session }) {
  const router = useRouter();
  const pathname = usePathname();
  const isDark = useDarkMode(session.darkMode);
  const shouldHide = shouldHideNavigation(pathname);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isTablet = useMediaQuery("(max-width: 900px)");
  const palette = useColor(session.themeColor, isDark);

  const [dismissed, setDismissed] = useState<boolean>(false);
  const [_session, _setSession] = useState(session);

  const [isReached, setIsReached]: any =
    useState<AccountStorageState>("loading");

  const userTheme = createTheme(
    useCustomTheme({
      darkMode: useDarkMode(session.darkMode),
      themeColor: session.themeColor,
    })
  );

  useEffect(() => {
    router.prefetch(`/tasks/home`);
    router.prefetch(`/rooms`);
    router.prefetch(`/`);
  }, [router]);

  useEffect(() => {
    if (containerRef && pathname) {
      containerRef?.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);

  const { data, error } = useSWR(["space/storage"]);

  const storage = useAccountStorage();
  const hasReachedLimit = data && getTotal(data, data.tasks, data.items) >= max;

  useEffect(() => {
    if (error) {
      storage?.setIsReached("error");
    } else {
      storage?.setIsReached(hasReachedLimit);
    }
  }, [error, hasReachedLimit, storage]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <SWRConfig value={{ fetcher: (d) => fetcher(d, session) }}>
        <SessionProvider
          session={_session}
          setSession={_setSession}
          isLoading={false}
        >
          <StorageContext.Provider value={{ isReached, setIsReached }}>
            <ThemeProvider theme={userTheme}>
              <Toaster containerClassName="noDrag" toastOptions={toastStyles} />
              <ReleaseModal />
              <KeyboardShortcutsModal />
              <UpdateButton />
              {!session.user.agreeTos && <TosModal />}

              <Snackbar
                open={Boolean(error)}
                autoHideDuration={6000}
                onClose={() => null}
                sx={{ mb: { xs: 7, sm: 2 }, transition: "all .3s" }}
                message="An error occured while trying to get your account storage information"
              />
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
                        router.push(`/spaces/${session.space.info.id}`)
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
              {/* Start container */}
              <motion.div
                initial={{ opacity: 0, background: palette[1] }}
                animate={{
                  opacity: 1,
                  background: addHslAlpha(palette[3], 0.7),
                }}
                onContextMenu={(e) => !isMobile && e.preventDefault()}
                style={{
                  display: "flex",
                }}
              >
                {/* Start Sidebar */}
                <Box
                  sx={{
                    width: { md: "85px" },
                    flexShrink: { md: 0 },
                  }}
                >
                  <Sidebar />
                </Box>
                {/* End sidebar */}
                {/* Start content */}
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
                      overflowY: pathname?.includes("tasks")
                        ? "auto"
                        : "scroll",
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
                      "& .outlined-drawer": {
                        border: `2px solid ${palette[3]}`,
                        borderRadius: 5,
                        mx: { xs: "15px", sm: "auto" },
                        mb: "15px",
                      },
                    }}
                  >
                    <NoSsr>
                      <ActivitySave />
                    </NoSsr>
                    {children}
                  </Box>
                  <CssBaseline />
                  {isTablet && <BottomNav />}
                </Box>
                {/* End content */}
              </motion.div>
              {/* End container */}
            </ThemeProvider>
          </StorageContext.Provider>
        </SessionProvider>
      </SWRConfig>
    </LocalizationProvider>
  );
}
