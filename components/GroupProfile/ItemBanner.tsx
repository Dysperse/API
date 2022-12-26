import React from "react";
import { useApi } from "../../hooks/useApi";
import { colors } from "../../lib/colors";
import type { ApiResponse } from "../../types/client";

import { Progress } from "@mantine/core";
import { Box, Typography } from "@mui/material";

/**
 * Item limit
 */
export function UpgradeBanner({ color }: { color: string }) {
  const { data }: ApiResponse = useApi("property/inventory/count");
  const { data: boardCount }: ApiResponse = useApi("property/boards");
  const { data: memoCount } = useApi("property/spaces");

  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    if (data) {
      setTimeout(() => {
        setValue((data.count / 250) * 100);
      }, 500);
    }
  }, [data]);

  const max = 500;

  const ratio = {
    oneItem: 0.2,
    oneBoard: 0.5,
    oneMemo: 0.7,
  };

  return !data ? null : (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "700", my: 2, mb: 1 }}>
        Storage
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
        <Progress
          // radius="xl"
          size={15}
          sx={{
            marginBottom: "10px",
            background: colors[color]["200"] + "!important",
          }}
          sections={[
            {
              value: (((data || { count: 0 }).count * 2) / max) * 100,
              color: "pink",
            },
            {
              value: (((boardCount || []).length * 10) / max) * 100,
              color: "grape",
            },
            {
              value: (((memoCount || []).length * 10) / max) * 100,
              color: "violet",
            },
          ]}
        />
        <Typography>
          Items: {Math.round((((data || { count: 0 }).count * 2) / max) * 100)}%
        </Typography>
        <Typography>
          Boards: {Math.round((((boardCount || []).length * 10) / max) * 100)}%
        </Typography>
        <Typography>
          Memos: {Math.round((((memoCount || []).length * 10) / max) * 100)}%
        </Typography>
      </Box>
    </Box>
  );
}
