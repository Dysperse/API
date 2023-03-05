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
          color: "#000",
          alignItems: "center",
          gap: 2.5,
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
        onClick={() => window.open("//dysperse.com")}
      >
        <picture>
          <img
            src="https://assets.dysperse.com/v6/dark.png"
            width="45"
            height="45"
            alt="logo"
            style={{
              borderRadius: "19px",
            }}
            draggable={false}
          />
        </picture>
        <Typography
          sx={{ fontWeight: "200!important", fontSize: "18px" }}
          component="div"
        >
          Dysperse
          <Chip
            label="alpha"
            color="info"
            size="small"
            sx={{
              pointerEvents: "none",
              ml: 2,
              px: 1,
              background: "#200923",
              fontWeight: "900",
            }}
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
          thickness={8}
          disableShrink
          ref={(i: any) => i && i.click()}
          size={24}
          sx={{
            color: "#000",
          }}
          onClick={() => router.push("/auth")}
        />
      </Box>
    </Box>
  );
}
