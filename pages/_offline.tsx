/**
 * Offline page
 */
import { Box } from "@mui/material";

export function OfflineBox() {
  return (
    <Box
      sx={{
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        p: 1,
        boxSizing: "border-box",
        fontSize: "15px",
        color: "#200923",
        background: "linear-gradient(45deg, #DB94CA, #6E79C9)",
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
          pointerEvents: "none",
        }}
      >
        Dysperse
      </Box>
      <Box
        sx={{
          p: 4,
          borderRadius: 5,
          fontSize: { xs: "25px", sm: "40px" },
          maxWidth: "calc(100vw - 40px)",
          maxHeight: "calc(100vh - 40px)",
        }}
      >
        Please connect to the internet to access Dysperse.
      </Box>
    </Box>
  );
}
/**
 * Top-level component for the offline page.
 */
export default function OfflinePage() {
  return <OfflineBox />;
}
