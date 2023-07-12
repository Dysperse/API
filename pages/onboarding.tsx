import { Loading } from "@/components/Layout/Loading";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, Icon, IconButton, LinearProgress } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Logo } from ".";
import { AboutStep } from "../components/Onboarding/AboutStep";
import { AppearanceStep } from "../components/Onboarding/AppearanceStep";
import { Completion } from "../components/Onboarding/Completion";
import { GroupStep } from "../components/Onboarding/GroupStep";
import { Intro } from "../components/Onboarding/Intro";
import { ProfileStep } from "../components/Onboarding/ProfileStep";

export default function Onboarding() {
  const session = useSession();
  const palette = useColor(
    session.themeColor,
    useDarkMode(session.user.darkMode)
  );

  const [step, setStep] = useState(0);

  const styles = {
    heading: {
      fontSize: { xs: "50px", sm: "60px" },
      background: palette[12],
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    navigationButton: {
      position: "fixed",
      m: { xs: 3, sm: 0 },
      transform: { sm: "translateY(50%)" },
      mx: { sm: "20px!important" },
      border: "2px solid",
      backdropFilter: "blur(10px)",
      color: palette[9],
      borderColor: palette[7],
      p: 2,
      zIndex: 9999,
      bottom: { xs: 0, sm: "50%" },
      transition: "transform 0.2s ease",
      "&:hover": {
        transform: { sm: "translateY(50%) scale(1.1)" },
      },
      "&:active": {
        transform: { sm: "translateY(50%) scale(.9)" },
      },
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
    subheading: {
      fontSize: { xs: "15px", sm: "20px" },
      mt: 4,
      mb: 2,
      fontWeight: 900,
      color: palette[10],
    },
    helper: {
      mb: 2,
      background: palette[11],
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    container: {
      maxHeight: { sm: "100vh" },
      overflow: "auto",
      pt: { xs: 15, sm: 0 },
      px: { xs: 3, sm: 0 },
      height: { sm: "100vh" },
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      width: "100vw",
      "& .MuiContainer-root": {
        width: { sm: "calc(100% - 150px)" },
        mx: "auto",
      },
    },
  };

  const navigation = {
    current: step,
    next: () => setStep(step + 1),
    previous: () => setStep(step - 1),
    set: (step) => setStep(step),
  };

  const steps = [
    <AboutStep navigation={navigation} key={1} styles={styles} />,
    <AppearanceStep navigation={navigation} key={2} styles={styles} />,
    <ProfileStep navigation={navigation} key={3} styles={styles} />,
    <GroupStep navigation={navigation} key={4} styles={styles} />,
    <Completion navigation={navigation} key={5} styles={styles} />,
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
          animationDelay: "7s",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 100,
        }}
      >
        <Loading />
        <LinearProgress
          variant="determinate"
          value={((step + 1) / steps.length) * 100}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9990,
            width: "100%",
            "& *": {
              transition: "all .3s cubic-bezier(.3,.66,.11,1.29)",
              borderRadius: 999,
            },
            height: 10,
          }}
        />
        <Box sx={{ position: "fixed", top: 0, left: 0, m: 3, zIndex: 9999 }}>
          <Logo size="60" intensity={7} />
        </Box>
        <Box
          sx={{
            height: "100%",
            width: "100%",
            zIndex: 999,
            position: "fixed",
            backdropFilter: "blur(10px)",
            overflow: "scroll",
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            >
              {steps[step]}
            </motion.div>
          </AnimatePresence>
        </Box>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <IconButton
              onClick={navigation.previous}
              sx={{
                ...styles.navigationButton,
                left: 0,
                ...(step === 0 && {
                  display: "none!important",
                }),
              }}
            >
              <Icon className="outlined">arrow_back_ios_new</Icon>
            </IconButton>
            <IconButton
              onClick={navigation.next}
              sx={{
                ...styles.navigationButton,
                right: 0,
                ...(step === steps.length - 1 && {
                  display: "none!important",
                }),
              }}
            >
              <Icon className="outlined">arrow_forward_ios</Icon>
            </IconButton>
          </motion.div>
        </AnimatePresence>
      </Box>
    </>
  );
}
