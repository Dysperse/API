"use client";

import { containerRef } from "@/app/(app)/container";
import { CreateTask } from "@/app/(app)/tasks/Task/Create";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";

export const shouldHideNavigation = (path) => {
  return [
    { path: "/claim-esb", desktop: true },
    { path: "/users", desktop: false },
    { path: "/edit", desktop: false },
    { path: "/tasks/search", desktop: false },
    { path: "/tasks/plan", desktop: false },
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
    <Box
      onClick={() => {
        containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }}
      sx={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        border: `2px solid ${addHslAlpha(palette[6], 0.5)}`,
        boxShadow: `0 20px 70px 20px ${palette[1]}`,
        background: addHslAlpha(palette[1], 0.9),
        width: "auto",
        ".hideBottomNav &": {
          mb: "calc(calc(var(--bottom-nav-height) * -1) - 20px)",
        },
        mb: shouldHide ? "calc(var(--bottom-nav-height) * -1)" : "0",
        visibility: shouldHide ? "hidden" : "visible",
        transition: "margin-bottom .25s var(--transition-defaults)",
        borderRadius: 999,
        overflowX: "hidden",
        backdropFilter: "blur(10px)",
        display: {
          xs: "flex",
          md: "none",
        },
        p: 1,
        px: 2,
        gap: 2,
        zIndex: 998,
        userSelect: "none",
        "&, & *": {
          overflow: "hidden!important",
        },
        alignItems: "center",
      }}
    >
      <CreateTask customTrigger="onContextMenu" disableBadge>
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
  );
}
