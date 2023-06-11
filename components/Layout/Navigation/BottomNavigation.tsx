import { useColor } from "@/lib/client/useColor";
import { useSession } from "@/lib/client/useSession";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { openSpotlight } from "./Search";

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

  const styles = (active) => {
    return {
      textTransform: "none",
      color: session.user.darkMode ? "hsl(240,11%,80%)" : "#303030",
      "& span": {
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
        color: `${palette[10]}!important`,
        "& .material-symbols-rounded, & .material-symbols-outlined": {
          ...iconStyles,
          background: palette[3],
        },
      }),
    };
  };

  const palette = useColor(session.themeColor, session.user.darkMode);
  const router = useRouter();

  const shouldHide = ["/users", "/settings"].find((path) =>
    router.asPath.includes(path)
  );

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
        height: "55px",
        ["@supports (-webkit-touch-callout: none)"]: {
          height: "65px",
          paddingBottom: "15px",
        },
        userSelect: "none",
        "&, & *": {
          overflow: "hidden!important",
        },
        background: palette[1],
        borderTop: `1px solid ${palette[3]}`,
        backdropFilter: "blur(10px)",
        alignItems: "center",
      }}
    >
      <Box
        onClick={() => router.push("/zen")}
        sx={styles(
          router.asPath === "/" ||
            router.asPath === "" ||
            router.asPath.includes("/zen") ||
            router.asPath.includes("/mood-history")
        )}
      >
        <span
          className={`material-symbols-${
            router.asPath === "/" ||
            router.asPath === "" ||
            router.asPath.includes("/zen") ||
            router.asPath.includes("/mood-history")
              ? "rounded"
              : "outlined"
          }`}
        >
          change_history
        </span>
      </Box>
      <Box
        onClick={() => router.push("/tasks/agenda/week")}
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
      <Box onClick={() => openSpotlight()} sx={styles(false)}>
        <span className={`material-symbols-outlined`}>bolt</span>
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
