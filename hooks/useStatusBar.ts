import { useCallback, useEffect, useRef } from "react";
import { colors } from "../lib/colors";

export function useStatusBar(open: boolean, nestedModals = 1) {
  const tagRef = useRef<HTMLMetaElement | null>(null);

  const setThemeColor = useCallback((isOpen: boolean, nestedModals: number) => {
    const tag = tagRef.current;
    if (!tag) return;
    if (isOpen) {
      if (global.theme !== "dark") {
        tag.setAttribute("content", colors[themeColor][nestedModals * 100]);
      } else {
        tag.setAttribute("content", `hsl(240, 11%, ${nestedModals * 10}%)`);
      }
    } else {
      if (isOpen && nestedModals > 1) {
        if (global.user.darkMode) {
          tag.setAttribute("content", `hsl(240, 11%, ${nestedModals * 10}%)`);
        } else {
          tag.setAttribute("content", colors[themeColor][nestedModals * 100]);
        }
      } else if (nestedModals === 1) {
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
}
