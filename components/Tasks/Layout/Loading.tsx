import { Box, CircularProgress } from "@mui/material";

export function Loading() {
  return (
    <Box
      sx={{
        width: "100%",
        height: {
          xs: "calc(100dvh - var(--navbar-height) - var(--bottom-nav-height))",
          sm: "100dvh",
        },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
