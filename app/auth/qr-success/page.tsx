"use client";
import { AuthBranding, Layout, authStyles } from "@/components/Auth/Layout";
import { useColor } from "@/lib/client/useColor";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { useRouter } from "next/navigation";

/**
 * Top-level component for the signup page.
 */
export default function Prompt() {
  const router = useRouter();
  const isDark = useMediaQuery("(prefers-color-scheme: dark)");
  const palette = useColor("violet", isDark);

  return (
    <Layout>
      <Box>
        <Box sx={authStyles(palette).container}>
          <AuthBranding mobile />
          <Box sx={{ pt: 3 }}>
            <Box sx={{ px: 1 }}>
              <Typography
                variant="h3"
                sx={{ mb: 1, mt: { xs: 3, sm: 0 } }}
                className="font-heading"
              >
                Authenticated!
              </Typography>
              <Typography sx={{ my: 2, mb: 3 }}>
                You should be redirected on your other device soon...
              </Typography>
              <Button
                sx={authStyles(palette).submit}
                onClick={() => router.push("/")}
                size="large"
                fullWidth
                disableRipple
              >
                Continue
                <span className="material-symbols-outlined">east</span>
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
