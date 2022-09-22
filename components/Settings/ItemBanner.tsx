import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { useApi } from "../../hooks/useApi";
import { colors } from "../../lib/colors";
import type { ApiResponse } from "../../types/client";

/**
 * Item limit
 */
export function UpgradeBanner() {
  const { data }: ApiResponse = useApi("property/inventory/count");

  return !data ? null : (
    <Box sx={{ px: 4 }}>
      <Box
        sx={{
          border: `2px solid ${colors.orange["500"].toString()}`,
          color: colors.orange["800"].toString(),
          borderRadius: 5,
          px: 3,
          py: 2,
        }}
        ref={() => {
          global.setItemLimitReached(data >= 250);
        }}
      >
        <LinearProgress
          color="inherit"
          sx={{
            height: 8,
            borderRadius: 5,
            mb: 1,
            backgroundColor: colors.orange["100"].toString(),
          }}
          variant="determinate"
          value={(data / 250) * 100}
        />
        <Typography>{data} out of 250 items</Typography>
      </Box>
    </Box>
  );
}
