import { useCallback, useEffect, useRef } from "react";
import { colors } from "../lib/colors";

export function useStatusBar(open: boolean, nestedModals = 1) {
  const tagRef = useRef<HTMLMetaElement | null>(null);
  const setThemeColor = useCallback((open, nestedModals) => {
    const tag = tagRef.current;
    if (!tag) return;
    if (open) {
      if (global.theme !== "dark") {
        tag.setAttribute("content", colors[themeColor][nestedModals * 100]);
      } else {
        tag.setAttribute("content", `hsl(240, 11%, ${nestedModals * 10}%)`);
      }
    } else {
      if (open && nestedModals > 1) {
        if (global.user.darkMode) {
          tag.setAttribute("content", `hsl(240, 11%, ${nestedModals * 10}%)`);
        } else {
          tag.setAttribute("content", colors[themeColor][nestedModals * 100]);
        }
      } else {
        tag.setAttribute(
          "content",
          global.user.darkMode ? "hsl(240,11%,10%)" : "#fff"
        );
      }
    }
  }, []);

  useEffect(() => {
    tagRef.current = document.querySelector(
      "meta[name=theme-color]"
    ) as HTMLMetaElement;
    setThemeColor(open, nestedModals);
  }, [open, nestedModals, setThemeColor]);

  useEffect(() => {
    setThemeColor(open, nestedModals);
  }, [open, nestedModals, setThemeColor]);
}
