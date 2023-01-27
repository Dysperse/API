import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/router";

export function AuthLoading() {
  const router = useRouter();
  return (
    <Box
      sx={{
        background: "linear-gradient(45deg, #DB94CA, #6E79C9)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          color: "#000",
          alignItems: "center",
          gap: "10px",
          userSelect: "none",
          px: 2,
          pt: 2,
        }}
      >
        <picture>
          <img
            src="https://i.ibb.co/F7vSQPP/Dysperse-Home-inventory-and-finance-tracking-2.png"
            width="80"
            height="80"
            alt="logo"
            style={{
              borderRadius: "28px",
            }}
            draggable={false}
          />
        </picture>
        <Typography variant="h6" sx={{ mt: -0.5 }}>
          Dysperse
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
          disableShrink
          ref={(i: any) => i && i.click()}
          size={20}
          sx={{
            color: "#c4b5b5",
          }}
          onClick={() => {
            router.push("/auth");
          }}
        />
      </Box>
    </Box>
  );
}
