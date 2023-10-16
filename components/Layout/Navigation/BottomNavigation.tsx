"use client";

import { CreateTask } from "@/components/Tasks/Task/Create";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { containerRef } from "@/app/container";

export const shouldHideNavigation = (path) => {
  return [
    { path: "/claim-esb", desktop: true },
    { path: "/users", desktop: false },
    { path: "/boards/edit/", desktop: false },
    { path: "/tasks/search", desktop: false },
    { path: "/integrations", desktop: false },
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
      return path?.includes(_path.path) && window.innerWidth < 600;
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
          transition: "none",
        },
      ...(active && {
        fontWeight: 700,
        color: `${palette[11]}!important`,
        "& .material-symbols-rounded, & .material-symbols-outlined": {
          opacity: 1,
          ...iconStyles,
          background: addHslAlpha(palette[4], 0.6),
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
    <Box
      onClick={() => {
        containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }}
      sx={{
        width: "100%",
        ".hideBottomNav &": {
          mb: "calc(var(--bottom-nav-height) * -1)",
        },
        mb: shouldHide ? "calc(var(--bottom-nav-height) * -1)" : "0",
        visibility: shouldHide ? "hidden" : "visible",
        left: 0,
        transition: "margin-bottom .4s cubic-bezier(.17,.67,.08,1.4)",
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
        borderRadius: "20px 20px 0 0",
        alignItems: "center",
      }}
    >
      <CreateTask customTrigger="onContextMenu" disableBadge>
        <Box
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
      </CreateTask>
      <Box
        onClick={() => router.push("/")}
        sx={styles(
          pathname === "/" ||
            pathname === "" ||
            pathname?.includes("/mood-history")
        )}
      >
        <span
          className={`material-symbols-${
            pathname === "/" || pathname === "" ? "rounded" : "outlined"
          }`}
        >
          &#xf07e;
        </span>
      </Box>
      <Box
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
    </Box>
  );
}
