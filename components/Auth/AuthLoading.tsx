import { Box, Chip, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/router";

export default function AuthLoading() {
  const router = useRouter();
  return (
    <Box
      sx={{
        background: "hsl(240, 11%, 95%)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          color: "#200923",
          alignItems: "center",
          gap: 3,
          userSelect: "none",
          mx: 4,
          pr: 2,
          borderRadius: 4,
          mt: 4,
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:active": {
            transform: "scale(0.95)",
            transitionDuration: "0s",
          },
        }}
      >
        <picture>
          <img
            src="https://assets.dysperse.com/v6/dark.png"
            width="50"
            height="50"
            alt="logo"
            style={{
              borderRadius: "28px",
            }}
            draggable={false}
          />
        </picture>
        <Typography variant="h6" sx={{ mt: -0.5 }}>
          Dysperse
          <Chip
            label="alpha"
            color="info"
            size="small"
            sx={{ ml: 2, px: 1, background: "#200923" }}
          />
        </Typography>
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <CircularProgress
          thickness={4}
          disableShrink
          ref={(i: any) => i && i.click()}
          size={20}
          sx={{
            color: "#000",
          }}
          onClick={() => {
            router.push("/auth");
          }}
        />
      </Box>
    </Box>
  );
}
