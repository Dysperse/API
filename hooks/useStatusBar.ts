import { useEffect } from "react";
import { colors } from "../lib/colors";

/**
 * Changes the top app bar color
 * @param open Is the modal open?
 * @param nestedModals How many nested modals are open?
 */
export function useStatusBar(open: boolean, nestedModals = 1) {
  const tag: HTMLMetaElement = document.querySelector(
    "meta[name=theme-color]"
  ) as HTMLMetaElement;
  useEffect(() => {
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
  }, [open, nestedModals, tag]);
}
