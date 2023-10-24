"use client";

import { useColor } from "@/lib/client/useColor";
import { useCustomTheme } from "@/lib/client/useTheme";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export function AuthClientLayout({ children }) {
  const palette = useColor("violet", true);
  const isDark = useMediaQuery("(prefers-color-scheme: dark)");

  const userTheme = createTheme(
    useCustomTheme({
      darkMode: isDark ? "dark" : "light",
      themeColor: "violet",
    })
  );

  return (
    <ThemeProvider theme={userTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {children}
        <CssBaseline />
      </LocalizationProvider>
    </ThemeProvider>
  );
}
