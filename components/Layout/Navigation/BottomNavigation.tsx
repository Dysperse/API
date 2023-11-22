"use client";

import { containerRef } from "@/app/(app)/container";
import { CreateTask } from "@/app/(app)/tasks/Task/Create";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, SxProps } from "@mui/material";
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
  const { session } = useSession();

  const styles = (active): SxProps => {
    return {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",

      fontSize: "35px",
      fontFamily: "Material Symbols Rounded",
      fontVariationSettings: '"FILL" 0, "wght" 100, "GRAD" 0, "opsz" 35',
      color: palette[12],
      transition: "all .4s",

      ...(active && {
        fontWeight: 700,
        color: `${palette[11]}`,
        textShadow: `0 0 10px ${palette[5]}`,
        fontVariationSettings: '"FILL" 1, "wght" 300, "GRAD" 0, "opsz" 35',
        opacity: 1,
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
          bottom: 0,
          left: 0,
          background: addHslAlpha(palette[1], 0.9),
          height: "49pt",
          borderTop: `2px solid ${addHslAlpha(palette[6], 0.5)}`,
          width: "100dvw",
          ".hideBottomNav &": {
            mb: "calc(calc(var(--bottom-nav-height) * -1) - 20px)",
          },
          visibility: shouldHide ? "hidden" : "visible",
          transition: "margin-bottom .25s var(--transition-defaults)",
          overflowX: "hidden",
          backdropFilter: "blur(4px)",
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
            &#xe86c;
          </Box>
        </CreateTask>
        <Box
          id="link2"
          onClick={() => router.push("/")}
          sx={styles(pathname === "/" || pathname === "")}
        >
          &#xf07e;
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
            &#xf569;
          </Box>
        )}
      </Box>
    </>
  );
}
