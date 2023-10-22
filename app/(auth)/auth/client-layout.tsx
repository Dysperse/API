"use client";

import { useColor } from "@/lib/client/useColor";
import { useCustomTheme } from "@/lib/client/useTheme";
import { ThemeProvider, createTheme } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export function AuthClientLayout({ children }) {
  const palette = useColor("violet", true);

  const userTheme = createTheme(
    useCustomTheme({
      darkMode: "dark",
      themeColor: "violet",
    })
  );

  return (
    <ThemeProvider theme={userTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
}
