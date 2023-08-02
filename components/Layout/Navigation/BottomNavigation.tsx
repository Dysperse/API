import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";

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
    height: "40px",
    fontSize: "27px",
    flex: "0 0 40px",
    width: "60px",
  };

  const session = useSession();

  useEffect(() => {
    const handleTouchMove = (event) => {
      const { touches } = event;
      if (touches.length > 1) {
        // Multiple touches detected, likely a pinch or zoom gesture
        return;
      }
      const touch = touches[0];
      if (touch.clientX < 30) {
        // Swipe detected from the left edge (you can adjust the threshold as needed)
        event.preventDefault();
      }
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

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
          background: palette[3],
        },
      }),
    };
  };

  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const router = useRouter();

  const shouldHide = [
    "/claim-esb",
    "/users",
    "/coach/explore",
    "/integrations",
    "/rooms/",
    "/groups",
    "/onboarding",
    "/coach/routine",
    "/settings",
  ].find((path) => router.asPath.includes(path));

  /**
   * Handles button click
   * @param {any} href
   * @returns {any}
   */
  return (
    <Box
      sx={{
        width: "100%",
        position: "fixed",
        bottom: shouldHide ? "-90px" : 0,
        ".hideBottomNav &": {
          bottom: "-90px",
        },
        left: 0,
        transition: "bottom .3s",
        overflowX: "hidden",
        display: {
          xs: "flex",
          md: "none",
        },
        ["@media (max-height: 500px)"]: {
          display: "none",
        },
        zIndex: 998,
        minHeight: "55px",
        height: "calc(55px + calc(var(--sab) - 20px))",
        paddingBottom: "calc(var(--sab) - 20px)",

        userSelect: "none",
        "&, & *": {
          overflow: "hidden!important",
        },
        background: `linear-gradient(${addHslAlpha(
          palette[3],
          0.8
        )}, ${addHslAlpha(palette[2], 0.8)})`,
        borderRadius: "20px 20px 0 0",
        backdropFilter: "blur(10px)",
        alignItems: "center",
      }}
    >
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
        sx={styles(router.asPath.includes("/coach"))}
        onDoubleClick={() => {
          router.push("/coach").then(() => {
            setTimeout(() => {
              document.getElementById("routineTrigger")?.click();
            }, 500);
          });
        }}
        onContextMenu={() => {
          router.push("/coach").then(() => {
            setTimeout(() => {
              document.getElementById("routineTrigger")?.click();
            }, 500);
          });
        }}
        onClick={() => router.push("/coach")}
      >
        <span
          className={`material-symbols-${
            router.asPath.includes("/coach") ? "rounded" : "outlined"
          }`}
        >
          rocket_launch
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
