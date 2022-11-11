import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { colors } from "../lib/colors";

/**
 * Changes the top app bar color
 * @param open Is the modal open?
 * @param nestedModals How many nested modals are open?
 */
export function useStatusBar(open: boolean, nestedModals = 1) {
  const pathname = usePathname();
  if (
    typeof document === "undefined" ||
    typeof window === "undefined" ||
    typeof window.matchMedia === "undefined"
  )
    return;
  const tag: HTMLMetaElement = document.querySelector(
    "meta[name=theme-color]"
  ) as HTMLMetaElement;
  useEffect(() => {
    if (!tag) return;
    if (pathname === "/tidy") {
      document
        .querySelector(`meta[name="theme-color"]`)
        ?.setAttribute("content", colors[themeColor][800]);
      return;
    }
    if (open) {
      tag.setAttribute(
        "content",
        pathname === "/tidy"
          ? colors[themeColor][700]
          : colors[themeColor][nestedModals * 100]
      );
    } else {
      if (open && nestedModals > 1) {
        tag.setAttribute(
          "content",
          pathname === "/tidy"
            ? colors[themeColor][800]
            : colors[themeColor][nestedModals * 100]
        );
      } else {
        tag.setAttribute("content", "#fff");
      }
    }
  }, [open, nestedModals, tag]);
}
