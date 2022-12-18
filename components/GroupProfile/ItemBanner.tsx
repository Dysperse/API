import { useApi } from "../../hooks/useApi";
import { colors } from "../../lib/colors";
import type { ApiResponse } from "../../types/client";
import React from "react";

import { Box, LinearProgress, Typography } from "@mui/material";

/**
 * Item limit
 */
export function UpgradeBanner({ color }: { color: string }) {
  const { data }: ApiResponse = useApi("property/inventory/count");
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    if (data) {
      setTimeout(() => {
        setValue((data.count / 250) * 100);
      }, 500);
    }
  }, [data]);

  return !data ? null : (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "700", my: 2, mb: 1 }}>
        Items
      </Typography>
      <Box
        sx={{
          background: `${colors[color]["100"].toString()}`,
          color: colors[color]["900"].toString(),
          borderRadius: 5,
          px: 3,
          mt: 2,
          py: 2,
          mb: 5,
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
            "& *": {
              borderRadius: 5,
            },
            backgroundColor: colors[color]["100"].toString(),
          }}
          variant="determinate"
          value={value}
        />
        <Typography>{data.count} out of 250 items. </Typography>
      </Box>
    </Box>
  );
}
