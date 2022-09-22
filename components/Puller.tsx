import { colors } from "../lib/colors";

/**
 * @name Puller
 * @description A puller is a component that pulls in swipeable drawers from bottom of the screen.
 */
export function Puller({ variant }: { variant?: "side" }) {
  return (
    <div
      className={variant === "side" ? "puller-side" : "puller"}
      style={{
        background: global.user
          ? global.user.darkMode
            ? "hsl(240, 11%, 35%)"
            : colors[themeColor][100]
          : colors["brown"][100],
      }}
    />
  );
}
