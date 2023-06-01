import { AuthBranding, Layout, authStyles } from "@/components/Auth/Layout";
import { Box, Typography } from "@mui/material";

/**
 * Top-level component for the signup page.
 */
export default function Prompt() {
  return (
    <Layout>
      <Box>
        <Box sx={authStyles.container}>
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
            </Box>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
