import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

/**
 * Description
 * @returns {any}
 */
export function Tips(): JSX.Element {
  return (
    <Box
      sx={{
        background:
          global.theme === "dark"
            ? "hsl(240, 11%, 13%)"
            : "rgba(200,200,200,.3)",
        p: 4,
        borderRadius: 5,
      }}
    >
      <Typography>Coming soon!</Typography>
    </Box>
  );
}
