import { Box, CircularProgress } from "@mui/material";

export function Loading() {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
        minHeight: "500px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress
        disableShrink
        size={20}
        sx={{
          color: global.user.darkMode ? "#fff" : "#000",
          animationDuration: ".5s",
          "& .MuiCircularProgress-circle": {
            strokeLinecap: "round",
          },
        }}
      />
    </Box>
  );
}
