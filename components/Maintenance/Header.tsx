import Box from "@mui/material/Box";
import * as colors from "@mui/material/colors";
import Typography from "@mui/material/Typography";

export function Header({ count }) {
  return (
    <Box sx={{ p: { sm: 3 }, pt: { sm: 1 } }}>
      <Box
        sx={{
          width: "100%",
          background:
            "linear-gradient(45deg, " +
            colors.green[global.user.darkMode ? 900 : 100] +
            " 0%, " +
            colors.green[global.user.darkMode ? 500 : 100] +
            " 50%, " +
            colors.green[global.user.darkMode ? 700 : 100] +
            " 100%)",
          color: colors.green[global.user.darkMode ? 900 : 100],
          height: "320px",
          borderRadius: { sm: 10 },
          flexDirection: "column",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h1">{count}</Typography>
        <Typography variant="h6">Upcoming tasks this week</Typography>
      </Box>
    </Box>
  );
}
