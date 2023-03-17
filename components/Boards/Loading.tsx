import { Box, CircularProgress } from "@mui/material";

export function Loading() {
  return (
    <Box
      sx={{
        width: "100%",
        height: {
          xs: "calc(100vh - var(--navbar-height) - 55px)",
          sm: "100vh",
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
