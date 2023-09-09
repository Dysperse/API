import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box } from "@mui/material";
import { useRouter } from "next/router";

export const shouldHideNavigation = (path) => {
  return [
    "/claim-esb",
    "/users",
    "/boards/edit/",
    "/tasks/search",
    "/coach/explore",
    "/coach/create",
    "/integrations",
    "/rooms/",
    "/spaces",
    "/onboarding",
    "/coach/routine",
    "/settings",
    "/tasks/insights",
  ].find((_path) => path.includes(_path));
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

  const session = useSession();

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
  const shouldHide = shouldHideNavigation(router.asPath);

  /**
   * Handles button click
   * @param {any} href
   * @returns {any}
   */
  return (
    <Box
      sx={{
        width: "100%",
        ".hideBottomNav &": {
          mb: "calc(var(--bottom-nav-height) * -1)",
        },
        mb: shouldHide ? "calc(var(--bottom-nav-height) * -1)" : "0",
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
        backdropFilter: "blur(10px)",
        alignItems: "center",
      }}
    >
      <Box
        onClick={() => router.push("/tasks/agenda/days")}
        sx={styles(router.asPath.includes("/tasks"))}
      >
        <span
          className={`material-symbols-${
            router.asPath.includes("/tasks") ? "rounded" : "outlined"
          }`}
        >
          check_circle
        </span>
      </Box>
      <Box
        onClick={() => router.push("/")}
        sx={styles(
          router.asPath === "/" ||
            router.asPath === "" ||
            router.asPath.includes("/mood-history")
        )}
      >
        <span
          className={`material-symbols-${
            router.asPath === "/" ||
            router.asPath === "" ||
            router.asPath.includes("/mood-history")
              ? "rounded"
              : "outlined"
          }`}
        >
          change_history
        </span>
      </Box>
      <Box
        sx={styles(
          router.asPath === "/items" ||
            router.asPath.includes("rooms") ||
            router.asPath === "/starred" ||
            router.asPath === "/trash"
        )}
        onClick={() => router.push("/items")}
      >
        <span
          className={`material-symbols-${
            router.asPath === "/items" ||
            router.asPath.includes("rooms") ||
            router.asPath === "/starred" ||
            router.asPath === "/trash"
              ? "rounded"
              : "outlined"
          }`}
        >
          inventory_2
        </span>
      </Box>
    </Box>
  );
}
