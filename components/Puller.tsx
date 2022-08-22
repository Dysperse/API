import Box from "@mui/material/Box";
import * as colors from "@mui/material/colors";

export function Puller({ variant }: { variant?: "side" }) {
  return (
    <Box sx={{ mb: 1 }}>
      <Box
        className={variant === "side" ? "puller-side" : "puller"}
        sx={{
          background:
            global.theme == "dark"
              ? "hsl(240, 11%, 35%)"
              : colors[themeColor][100],
        }}
      ></Box>
    </Box>
  );
}
