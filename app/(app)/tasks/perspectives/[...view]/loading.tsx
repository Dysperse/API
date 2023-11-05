import { Box } from "@mui/material";
import { PerspectivesLoadingScreen } from "../perspectives/PerspectivesLoadingScreen";

export default function Loading() {
  return (
    <Box
      sx={{
        display: { xs: "flex", sm: "flex" },
        flexDirection: "row",
        flexGrow: 1,
        maxWidth: "100dvw",
        overflowX: { xs: "hidden", sm: "auto" },
        width: "100%",
        height: "100%",
      }}
    >
      <PerspectivesLoadingScreen />
    </Box>
  );
}
