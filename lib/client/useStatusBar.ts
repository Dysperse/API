import { useEffect } from "react";

export function useStatusBar(color: string | undefined) {
  useEffect(() => {
    if (!color) return;
    if (typeof document !== "undefined") {
      document
        .querySelector(`meta[name="theme-color"]`)
        ?.setAttribute("content", color);
    }
  });
}
