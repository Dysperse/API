"use client";

import { Box, useMediaQuery } from "@mui/material";
import Image from "next/image";

export const AuthBranding = ({ mobile = false }: any) => {
  const isDark = useMediaQuery("(prefers-color-scheme: dark)");

  return (
    <Box
      sx={{
        display: { xs: "inline-flex", sm: mobile ? "none" : "inline-flex" },
        color: "#000",
        position: "absolute",
        top: 0,
        left: 0,
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
      <Image
        src={`/auth/logo-${isDark ? "dark" : "light"}.png`}
        alt="logo"
        width={80}
        height={80}
      />
    </Box>
  );
};
