"use client";

import { containerRef } from "@/app/(app)/container";
import { CreateTask } from "@/app/(app)/tasks/Task/Create";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Badge, Box } from "@mui/material";
import dayjs from "dayjs";
import { usePathname, useRouter } from "next/navigation";

export const shouldHideNavigation = (path) => {
  return [
    { path: "/claim-esb", desktop: true },
    { path: "/users", desktop: false },
    { path: "/boards/edit/", desktop: false },
    { path: "/tasks/search", desktop: false },
    { path: "/tasks/plan", desktop: false },
    { path: "/integrations", desktop: true },
    { path: "/rooms/", desktop: false },
    { path: "/spaces", desktop: false },
    { path: "/onboarding", desktop: false },
    { path: "/settings", desktop: false },
    { path: "/availability", desktop: false },
    { path: "/tasks/insights", desktop: false },
  ].find((_path) => {
    if (_path.desktop) {
      return path?.includes(_path.path);
    } else {
      return (
        path?.includes(_path.path) &&
        typeof window !== "undefined" &&
        window.innerWidth < 600
      );
    }
  });
};
/**
 * Bottom navigation bar
 * @returns {any}
 */
export function BottomNav() {
  const iconStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    height: "45px",
    fontSize: "30px",
    flex: "0 0 40px",
    width: "60px",
  };

  const { session } = useSession();

  const styles = (active) => {
    return {
      textTransform: "none",
      color: palette[12],
      "& span": {
        opacity: 0.7,
        transition: "opacity .2s",
      },
      "& .material-symbols-rounded, & .material-symbols-outlined": {
        ...iconStyles,
      },
      fontWeight: "200",
      width: "100%",
      display: "flex",
      mx: "auto",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      "&:active .material-symbols-rounded, &:active .material-symbols-outlined":
        {
          opacity: 0.5,
          transition: "all .2s,opacity 0s,background 0s",
        },
      ...(active && {
        fontWeight: 700,
        color: `${palette[11]}!important`,
        "& .material-symbols-rounded, & .material-symbols-outlined": {
          transition: "all .2s,opacity 0s,background 0s",
          opacity: 1,
          ...iconStyles,
          background: addHslAlpha(palette[6], 0.5),
        },
      }),
    };
  };

  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const router = useRouter();
  const pathname = usePathname();
  const shouldHide = shouldHideNavigation(pathname);

  /**
   * Handles button click
   * @param {any} href
   * @returns {any}
   */
  return (
    <>
      <Box
        onClick={() => {
          containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }}
        sx={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          border: `2px solid ${addHslAlpha(palette[6], 0.5)}`,
          background: addHslAlpha(palette[1], 0.9),
          width: "calc(100% - 40px)",
          ".hideBottomNav &": {
            mb: "calc(calc(var(--bottom-nav-height) * -1) - 20px)",
          },
          mb: shouldHide ? "calc(var(--bottom-nav-height) * -1)" : "0",
          visibility: shouldHide ? "hidden" : "visible",
          transition: "margin-bottom .25s var(--transition-defaults)",
          borderRadius: 999,
          overflowX: "hidden",
          display: {
            xs: "flex",
            md: "none",
          },
          zIndex: 998,
          minHeight: "var(--bottom-nav-height)",
          paddingBottom: "calc(var(--sab) - 20px)",
          userSelect: "none",
          "&, & *": {
            overflow: "hidden!important",
          },
          alignItems: "center",
        }}
      >
        <CreateTask customTrigger="onContextMenu" disableBadge>
          <Badge
            badgeContent={
              !dayjs(session.user.lastPlannedTasks).isToday() &&
              !pathname.includes("/tasks")
                ? 1
                : 0
            }
            variant="dot"
            sx={{
              width:
                session.space.info.type == "study group"
                  ? "calc(50% - 10px)"
                  : "calc(33.33333% - 10px)",
              "& .MuiBadge-badge": {
                right: "calc(50% - 20px)",
                top: 7,
              },
            }}
          >
            <Box
              id="link1"
              onClick={() => router.push("/tasks/home")}
              sx={styles(pathname?.includes("/tasks"))}
            >
              <span
                className={`material-symbols-${
                  pathname?.includes("/tasks") ? "rounded" : "outlined"
                }`}
              >
                &#xe86c;
              </span>
            </Box>
          </Badge>
        </CreateTask>
        <Box
          id="link2"
          onClick={() => router.push("/")}
          sx={styles(pathname === "/" || pathname === "")}
        >
          <span
            className={`material-symbols-${
              pathname === "/" || pathname === "" ? "rounded" : "outlined"
            }`}
          >
            &#xf07e;
          </span>
        </Box>
        {session.space.info.type !== "study group" && (
          <Box
            id="link3"
            sx={styles(
              pathname === "/rooms" ||
                pathname?.includes("rooms") ||
                pathname === "/starred" ||
                pathname === "/trash"
            )}
            onClick={() => router.push("/rooms")}
          >
            <span
              className={`material-symbols-${
                pathname === "/rooms" ||
                pathname?.includes("rooms") ||
                pathname === "/starred" ||
                pathname === "/trash"
                  ? "rounded"
                  : "outlined"
              }`}
            >
              &#xf569;
            </span>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          position: "fixed",
          background: `linear-gradient(transparent, ${palette[1]})`,
          backdropFilter: "blur(2px)",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "calc(var(--bottom-nav-height) + 20px)",
          zIndex: 997,
        }}
      />
    </>
  );
}
