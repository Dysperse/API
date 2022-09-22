import { useEffect } from "react";
import { colors } from "../lib/colors";

export function useStatusBar(open: boolean, nestedModals = 0.5) {
  const tag: any = document.querySelector("meta[name=theme-color]");
  const isScrolledToTop = window.scrollY === 0;
  const isDarkMode = global.user.darkMode;

  if (!isScrolledToTop) {
    nestedModals = 1;
  }

  const darkModeResets = {
    top: isDarkMode ? "hsl(240, 11%, 5%)" : "#fff",
    bottom: isDarkMode ? "hsl(240, 11%, 10%)" : colors[themeColor][100],
  };

  useEffect(() => {
    if (open) {
      tag.setAttribute("content", colors[themeColor][nestedModals * 100]);
    } else {
      tag.setAttribute(
        "content",
        nestedModals === 0.5
          ? isScrolledToTop
            ? darkModeResets.top
            : darkModeResets.bottom
          : colors[themeColor][(nestedModals - 0.5) * 100]
      );
    }
  }, [
    open,
    nestedModals,
    isScrolledToTop,
    darkModeResets.bottom,
    darkModeResets.top,
    tag,
  ]);
}
