import { useEffect } from "react";
import { colors } from "../lib/colors";
import { useRouter } from "next/router";

/**
 * Changes the top app bar color
 * @param open Is the modal open?
 * @param nestedModals How many nested modals are open?
 */
export function useStatusBar(open: boolean, nestedModals = 1) {
  const router = useRouter();
  const tag: HTMLMetaElement = document.querySelector(
    "meta[name=theme-color]"
  ) as HTMLMetaElement;
  const isScrolledToTop = window.scrollY === 0;
  const isDarkMode = global.user.darkMode;

  if (!isScrolledToTop) {
    nestedModals = 1;
  }

  const darkModeResets = {
    top: isDarkMode ? "hsl(240, 11%, 5%)" : "#fff",
    bottom: isDarkMode ? "hsl(240, 11%, 10%)" : colors[themeColor][200],
  };

  useEffect(() => {
    if (open) {
      tag.setAttribute(
        "content",
        router.asPath === "/tidy"
          ? colors[themeColor][500]
          : colors[themeColor][nestedModals * 100]
      );
    } else {
      tag.setAttribute(
        "content",
        router.asPath === "/tidy"
          ? colors[themeColor][800]
          : colors[themeColor][nestedModals * 100]
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
