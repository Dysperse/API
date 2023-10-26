import { Box, Skeleton } from "@mui/material";
import { PerspectivesLoadingScreen } from "../perspectives/PerspectivesLoadingScreen";

export default function Loading() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        flexGrow: 1,
        maxWidth: "100dvw",
        overflowX: { xs: "hidden", sm: "auto" },
        width: "100%",
        height: "100%",
      }}
    >
      <Box
        sx={{
          p: 2,
          height: "100%",
          width: "320px",
          flex: "0 0 320px",
          position: "sticky",
          top: 0,
          left: 0,
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: 5,
          }}
        />
      </Box>
      <PerspectivesLoadingScreen />
    </Box>
  );
}
