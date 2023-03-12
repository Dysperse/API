import { Box, useScrollTrigger } from "@mui/material";
import hexToRgba from "hex-to-rgba";
import { useRouter } from "next/router";
import { colors } from "../../lib/colors";
import { useSession } from "../../pages/_app";

/**
 * Bottom navigation bar
 * @returns {any}
 */
export function BottomNav() {
  const trigger = useScrollTrigger({ threshold: 0 });

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
      color: session?.user?.darkMode ? "hsl(240,11%,80%)" : "#303030",
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
        color: `${
          session?.user?.darkMode
            ? "#fff"
            : colors[session?.themeColor || "grey"][900]
        }!important`,
        "& .material-symbols-rounded, & .material-symbols-outlined": {
          ...iconStyles,
          background: `${
            session?.user?.darkMode
              ? "hsl(240,11%,17%)"
              : hexToRgba(colors[session?.themeColor || "grey"][200], 0.5)
          }!important`,
        },
      }),
    };
  };

  const router = useRouter();

  /**
   * Handles button click
   * @param {any} href
   * @returns {any}
   */
  return (
    <>
      <Box
        sx={{
          width: "100%",
          position: "fixed",
          bottom: trigger && router.asPath.includes("zen") ? -71 : 0,
          left: 0,
          transition: "bottom .3s",
          overflowX: "hidden",
          display: {
            xs: "flex",
            md: "none",
          },
          [`@media (max-height: 500px)`]: {
            display: "none",
          },
          zIndex: 999,
          height: "55px",
          userSelect: "none",
          "&, & *": {
            overflow: "hidden!important",
          },
          background: session?.user?.darkMode
            ? "hsla(240, 11%, 10%, .9)"
            : "rgba(255,255,255,.4)",
          borderTop: session?.user?.darkMode
            ? "1px solid hsla(240, 11%, 20%, .8)"
            : session?.user?.darkMode
            ? "1px solid hsla(240,11%,15%)"
            : "1px solid rgba(200,200,200,.3)",
          backdropFilter: "blur(10px)",
          alignItems: "center",
        }}
      >
        <Box
          onClick={() => router.push("/zen")}
          sx={styles(
            router.asPath === "/" ||
              router.asPath === "" ||
              router.asPath.includes("/zen")
          )}
        >
          <span
            className={`material-symbols-${
              router.asPath === "/" ||
              router.asPath === "" ||
              router.asPath.includes("/zen")
                ? "rounded"
                : "outlined"
            }`}
          >
            change_history
          </span>
        </Box>
        <Box
          onClick={() => router.push("/tasks")}
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
          sx={styles(router.asPath === "/coach")}
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
              router.asPath === "/coach" ? "rounded" : "outlined"
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
    </>
  );
}
