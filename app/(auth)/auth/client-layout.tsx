"use client";

import { useColor } from "@/lib/client/useColor";
import { useCustomTheme } from "@/lib/client/useTheme";
import { ThemeProvider, createTheme } from "@mui/material";

export function AuthClientLayout({ children }) {
  const palette = useColor("violet", true);

  const userTheme = createTheme(
    useCustomTheme({
      darkMode: "dark",
      themeColor: "violet",
    })
  );

  return <ThemeProvider theme={userTheme}>{children}</ThemeProvider>;
}
