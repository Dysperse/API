import Typography from "@mui/material/Typography";
import { colors } from "../lib/colors";
import Box from "@mui/material/Box";
export default function Custom404() {
  // Animated 404 page with icon
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        position: { xs: "absolute", md: "relative" },
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <span
        className="material-symbols-outlined"
        style={{
          fontSize: "3rem",
          color: colors[themeColor]["900"],
        }}
      >
        error
      </span>
      <Typography
        variant="h5"
        component="h5"
        sx={{
          fontSize: "1.5rem",
          fontWeight: "500",
          mt: 2,
          color: colors[themeColor]["900"],
        }}
      >
        This page does not exist
      </Typography>
    </Box>
  );
}
