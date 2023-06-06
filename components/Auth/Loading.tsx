import { Box, CircularProgress, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import { AuthBranding } from "./Layout";

export default function AuthLoading() {
  const router = useRouter();
  const dark = useMediaQuery("(prefers-color-scheme: dark)");

  return (
    <Box
      sx={{
        background: `hsl(240, 11%, ${dark ? 10 : 95}%)`,
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <AuthBranding />
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
            color: dark ? "#fff" : "#000",
          }}
          onClick={() =>
            router.push(
              "/auth?next=" + encodeURIComponent(window.location.href)
            )
          }
        />
      </Box>
    </Box>
  );
}
