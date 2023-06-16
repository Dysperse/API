import { useEffect } from "react";

export function useStatusBar(color: string) {
  useEffect(() => {
    if (typeof document !== "undefined") {
      document
        .querySelector(`meta[name="theme-color"]`)
        ?.setAttribute("content", color);
    }
  });
}
