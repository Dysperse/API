import { Box, Typography } from "@mui/material";

export default function Page() {
  return (
    <Box
      sx={{
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100dvh",
        position: "fixed",
        top: 0,
        left: 0,
        p: 1,
        boxSizing: "border-box",
        fontSize: "15px",
        color: "hsl(240,11%,10%)",
        background:
          "linear-gradient(45deg, hsl(240,11%,90%), hsl(240,11%,95%))",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          p: 5,
          display: "flex",
          gap: "10px",
          fontWeight: 700,
          pointerEvents: "none",
        }}
      >
        Dysperse
      </Box>
      <Box
        sx={{
          p: 4,
          borderRadius: 5,
          fontSize: { xs: "25px", sm: "50px" },
          maxWidth: "calc(100vw - 40px)",
          maxHeight: "calc(100dvh - 40px)",
        }}
      >
        <Typography className="font-heading" variant="h1">
          404
        </Typography>
        <Typography variant="h6">This page does not exist</Typography>
      </Box>
    </Box>
  );
}
