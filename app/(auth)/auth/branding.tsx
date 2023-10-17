import { Logo } from "@/components/Logo";
import { Box } from "@mui/material";

export const AuthBranding = ({ mobile = false }: any) => (
  <Box
    sx={{
      display: { xs: "inline-flex", sm: mobile ? "none" : "inline-flex" },
      color: "#000",
      position: "absolute",
      top: 0,
      left: 0,
      [`@media (prefers-color-scheme: dark)`]: {
        color: "#fff",
        "& img": {
          filter: "invert(1)",
        },
      },
      alignItems: "center",
      gap: 2.5,
      userSelect: "none",
      mx: mobile ? 2 : 4,
      pr: 2,
      borderRadius: 4,
      mt: mobile ? 2 : 4,
      cursor: "pointer",
      transition: "all 0.2s ease",
      "&:active": {
        transform: "scale(0.95)",
        transitionDuration: "0s",
      },
    }}
    onClick={() => window.open("//dysperse.com")}
  >
    <Logo intensity={6} />
  </Box>
);
