import { Loading } from "@/components/Layout/Loading";
import { useSession } from "@/lib/client/session";
import { updateSettings } from "@/lib/client/updateSettings";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Button,
  Grid,
  Icon,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import * as colors from "@radix-ui/colors";
import { useState } from "react";

function Intro() {
  const session = useSession();
  const palette = useColor(
    session.themeColor,
    useDarkMode(session.user.darkMode)
  );

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
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
            animation: "showHeader 3s cubic-bezier(.3,.66,.11,1.29) forwards",
            background: `linear-gradient(${palette[6]}, ${palette[9]})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            opacity: 0,
            animationDelay: "3s",
          }}
        >
          Welcome to Dysperse.
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
          <g clip-path="url(#b3adf0de96)">
            <path d="M 740.886719 404.972656 C 497.902344 449.707031 461.644531 485.96875 416.910156 728.945312 C 372.179688 485.96875 335.917969 449.707031 92.9375 404.972656 C 335.917969 360.242188 372.179688 323.980469 416.910156 81 C 461.640625 323.980469 497.902344 360.242188 740.886719 404.972656 Z M 740.886719 404.972656"></path>
          </g>
        </svg>
      </Box>
    </>
  );
}

function AppearanceStep({ styles, navigation }) {
  const session = useSession();

  return (
    <Box sx={styles.container}>
      <Typography variant="h1" className="font-heading" sx={styles.heading}>
        Make it yours
      </Typography>
      <Typography variant="h1" sx={styles.subheading}>
        What&apos;s your favorite color?
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {Object.keys(colors)
          .filter((color) => !color.includes("Dark"))
          .filter((color) => !color.endsWith("A"))
          .filter(
            (color) =>
              ![
                "bronze",
                "gold",
                "sand",
                "olive",
                "slate",
                "mauve",
                "gray",
              ].includes(color)
          )
          .map((color) => (
            <Box
              key={color}
              onClick={() =>
                updateSettings(session, "color", color.toLowerCase())
              }
              sx={{
                background:
                  colors[color] &&
                  `linear-gradient(45deg, ${colors[color][color + 10]}, ${
                    colors[color][color + 12]
                  })`,
                width: "50px",
                height: "50px",
                borderRadius: 999,
              }}
            />
          ))}
      </Box>
      <Typography variant="h1" sx={styles.subheading}>
        Choose a theme
      </Typography>
      <Button
        sx={styles.button}
        variant="outlined"
        onClick={() => updateSettings(session, "darkMode", "dark")}
      >
        <Icon className="outlined">dark_mode</Icon>
        Dark mode
      </Button>
      <Button
        sx={styles.button}
        variant="outlined"
        onClick={() => updateSettings(session, "darkMode", "light")}
      >
        <Icon className="outlined">light_mode</Icon>
        Light mode
      </Button>
      <Button
        sx={styles.button}
        variant="outlined"
        onClick={() => updateSettings(session, "darkMode", "system")}
      >
        <Icon className="outlined">computer</Icon>
        System theme
      </Button>

      <Button
        variant="contained"
        sx={styles.next}
        size="large"
        onClick={navigation.next}
      >
        Next <Icon className="outlined">arrow_forward_ios</Icon>
      </Button>
    </Box>
  );
}

function GroupStep({ styles, navigation }) {
  const session = useSession();

  return (
    <Box sx={styles.container}>
      <Button onClick={navigation.previous} size="small" sx={styles.back}>
        <Icon className="outlined">arrow_back_ios_new</Icon>Back
      </Button>
      <Typography variant="h1" className="font-heading" sx={styles.heading}>
        Your group
      </Typography>
      <Typography variant="h1" sx={styles.subheading}>
        Who is this group for?
      </Typography>
      {["Just me", "My home", "My apartment", "My dorm", "My study group"].map(
        (option) => (
          <Box key={option}>{option}</Box>
        )
      )}

      <Typography variant="h1" sx={styles.subheading}>
        What&apos;s your group&apos;s name?
      </Typography>
      <Typography sx={styles.helper}>
        It could be your home address, study group name, or anything else
        you&apos;d like.
      </Typography>
      <TextField
        sx={styles.input}
        label="Group name"
        placeholder="1234 Rainbow Road"
      />
      <Button
        variant="contained"
        sx={styles.next}
        size="large"
        onClick={navigation.next}
      >
        Next <Icon className="outlined">arrow_forward_ios</Icon>
      </Button>
    </Box>
  );
}

export default function Onboarding() {
  const session = useSession();
  const palette = useColor(
    session.themeColor,
    useDarkMode(session.user.darkMode)
  );

  const [step, setStep] = useState(0);

  const styles = {
    heading: {
      fontSize: { xs: "60px", sm: "80px" },
      background: `linear-gradient(-45deg, ${palette[4]}, ${palette[9]})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    button: {
      borderWidth: "2px !important",
      display: "flex",
      width: "auto",
      mb: 1,
      borderColor: palette[7],
      "&:hover": {
        borderColor: palette[9],
      },
    },
    back: {
      mb: 3,
    },
    next: {
      mt: 5,
      px: 2,
    },
    subheading: {
      fontSize: { xs: "20px", sm: "30px" },
      mt: 4,
      mb: 2,
      fontWeight: 900,
      background: `linear-gradient(-45deg, ${palette[4]}, ${palette[9]})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    helper: {
      mb: 2,
      mt: -1,
      background: palette[9],
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    container: {
      p: 5,
      pt: 15,
      maxHeight: "100%",
      overflow: "auto",
    },
  };

  const navigation = {
    current: step,
    next: () => setStep(step + 1),
    previous: () => setStep(step - 1),
    set: (step) => setStep(step),
  };

  const steps = [
    <AppearanceStep navigation={navigation} key={0} styles={styles} />,
    <GroupStep navigation={navigation} key={1} styles={styles} />,
  ];

  return (
    <>
      <Intro />
      <Box
        sx={{
          ["@keyframes showContent"]: {
            "0%": {
              opacity: 0,
            },
            "100%": {
              opacity: 1,
            },
          },
          opacity: 0,
          animation: "showContent 1s cubic-bezier(.3,.66,.11,1.29) forwards",
          animationDelay: "6s",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "auto",
          zIndex: 100,
        }}
      >
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
            filter: "blur(10px)",
          }}
        >
          <Loading />
        </Box>
        <LinearProgress
          variant="determinate"
          value={((step + 1) / steps.length) * 100}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 999,
            width: "100%",
          }}
        />
        <Grid container sx={{ height: "100%", zIndex: 999, position: "fixed" }}>
          <Grid xs={12} sm={8} item sx={{ height: "100%" }}>
            {steps[step]}
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            sx={{
              height: "100%",
            }}
          >
            <Typography></Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
