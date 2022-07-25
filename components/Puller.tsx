import Box from "@mui/material/Box";
import * as colors from "@mui/material/colors";

export function Puller({ variant }: { variant?: "side" }) {
  return (
    <Box
      className={variant === "side" ? "puller-side" : "puller"}
      sx={{
        background: colors[themeColor][50],
      }}
    ></Box>
  );
}
