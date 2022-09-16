import Box from "@mui/material/Box";
import { colors } from "../lib/colors";

export function Puller({ variant }: { variant?: "side" }) {
  return (
    <Box
      className={variant === "side" ? "puller-side" : "puller"}
      sx={{
        background:
          global.theme == "dark"
            ? "hsl(240, 11%, 35%)"
            : colors[themeColor][100],
      }}
    />
  );
}
