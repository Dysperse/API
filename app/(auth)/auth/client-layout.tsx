"use client";

import { useColor } from "@/lib/client/useColor";
import { useCustomTheme } from "@/lib/client/useTheme";
import useWindowDimensions from "@/lib/client/useWindowDimensions";
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Image from "next/image";

export function AuthClientLayout({ children }) {
  const palette = useColor("violet", true);
  const isDark = useMediaQuery("(prefers-color-scheme: dark)");

  const userTheme = createTheme(
    useCustomTheme({
      darkMode: isDark ? "dark" : "light",
      themeColor: "violet",
    })
  );

  const { width, height } = useWindowDimensions();

  return (
    <ThemeProvider theme={userTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <Box sx={{ zIndex: 99 }}>{children}</Box>
        <Image
          alt="background"
          src={`/auth/background-${isDark ? "dark" : "light"}.png?purge=dev`}
          width={width}
          height={height}
          style={{
            position: "fixed",
            pointerEvents: "none",
            top: 0,
            left: 0,
            zIndex: -1,
            width: "100dvw",
            objectFit: "cover",
            height: "100dvh",
          }}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
}
