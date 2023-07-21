import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, Typography } from "@mui/material";

export function Intro() {
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          textAlign: "center",
          zIndex: 100,
        }}
      >
        <Typography
          variant="h1"
          className="font-heading"
          sx={{
            ["@keyframes showHeader"]: {
              "0%": {
                opacity: 0,
                transform: "scale(2)",
              },
              "30%": {
                opacity: 1,
                transform: "scale(1)",
              },
              "80%": {
                opacity: 1,
                transform: "scale(1)",
              },
              "100%": {
                opacity: 0,
                transform: "scale(0)",
              },
            },
            animation: "showHeader 4s cubic-bezier(.3,.66,.11,1.29) forwards",
            background: `linear-gradient(${palette[6]}, ${palette[9]})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            opacity: 0,
            fontSize: { xs: "3.5rem", sm: "6rem" },
            animationDelay: "3s",
          }}
        >
          Welcome to Dysperse
        </Typography>
      </Box>
      <Box
        sx={{
          ["@keyframes hideLogo"]: {
            "0%": {
              opacity: 1,
            },
            "100%": {
              opacity: 0,
            },
          },
          animation: "hideLogo 2s cubic-bezier(0.47, 0, 0.745, 0.715) forwards",
          animationDelay: "1.5s",

          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: 100,

          "& svg": {
            ["@keyframes draw"]: {
              "0%": {
                strokeDasharray: "2594 2594",
                strokeDashoffset: 2594,
                fillOpacity: 0,
              },

              "80%": {
                strokeDasharray: "2594 2594",
                fillOpacity: 0,
              },
              "100%": {
                strokeDasharray: "2594 2594",
                strokeDashoffset: 0,
                fillOpacity: 1,
              },
            },

            "& path": {
              stroke: palette[6],
              fill: palette[6],
              strokeWidth: 10,
              strokeDasharray: "2594 2594",
              strokeDashoffset: "2594",
              animation: "draw 1s cubic-bezier(0.47, 0, 0.745, 0.715) forwards",
            },
          },
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="100"
          height="100%"
          zoomAndPan="magnify"
          viewBox="0 0 810 809.999993"
          preserveAspectRatio="xMidYMid meet"
          version="1.0"
        >
          <defs>
            <clipPath id="b3adf0de96">
              <path
                d="M 92.9375 81 L 740.9375 81 L 740.9375 729 L 92.9375 729 Z M 92.9375 81"
                clip-rule="nonzero"
                className="svg-elem-1"
              ></path>
            </clipPath>
          </defs>
          <g clipPath="url(#b3adf0de96)">
            <path d="M 740.886719 404.972656 C 497.902344 449.707031 461.644531 485.96875 416.910156 728.945312 C 372.179688 485.96875 335.917969 449.707031 92.9375 404.972656 C 335.917969 360.242188 372.179688 323.980469 416.910156 81 C 461.640625 323.980469 497.902344 360.242188 740.886719 404.972656 Z M 740.886719 404.972656"></path>
          </g>
        </svg>
      </Box>
    </>
  );
}
