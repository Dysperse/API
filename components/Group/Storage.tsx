import { Progress } from "@mantine/core";
import { Box, Skeleton, Typography } from "@mui/material";
import { useApi } from "../../hooks/useApi";
import { colors } from "../../lib/colors";
import type { ApiResponse } from "../../types/client";

/**
 * Item limit
 */
export function Storage({
  propertyId,
  accessToken,
  color,
}: {
  accessToken: string;
  propertyId: string;
  color: string;
}) {
  const { data }: ApiResponse = useApi("property/inventory/room/itemCount", {
    property: propertyId,
    accessToken,
  });
  const { data: boardCount }: ApiResponse = useApi("property/boards", {
    property: propertyId,
    accessToken,
  });

  const max = 500;
  const storage = {
    items: (((data || { count: 0 }).count * 2.5) / max) * 100,
    boards: (((boardCount || []).length * 10) / max) * 100,
  };

  const total =
    max -
    Math.round(
      (boardCount || []).length * 10 + (data || { count: 0 }).count * 2.5
    );

  return !data ? (
    <Box>
      <Typography variant="h6" sx={{ mt: 5, px: 1 }}>
        Storage
      </Typography>
      <Box
        sx={{
          p: 2,
          mt: 2,
          mb: 2,
          userSelect: "none",
          px: 2.5,
          borderRadius: 5,
          background: global.user.darkMode
            ? "hsl(240,11%,20%)"
            : colors[color][50],
        }}
      >
        <Skeleton animation="wave" />
      </Box>
    </Box>
  ) : (
    <Box>
      <Typography variant="h6" sx={{ mt: 5, px: 1 }}>
        Storage
      </Typography>
      <Box
        sx={{
          background: `${
            global.user.darkMode ? "hsl(240,11%,20%)" : colors[color][50]
          }`,
          color: colors[color][global.user.darkMode ? 50 : 900].toString(),
          borderRadius: 5,
          px: 3,
          mt: 2,
          py: 2,
          mb: 5,
        }}
      >
        <Progress
          size={20}
          sx={{
            marginBottom: "10px",
            background: `${
              global.user.darkMode ? "hsl(240,11%,19%)" : colors[color][200]
            }!important`,
          }}
          sections={[
            {
              value: storage.items,
              color: colors[color][global.user.darkMode ? 500 : 700],
            },
            {
              value: storage.boards,
              color: colors[color][global.user.darkMode ? 200 : 800],
            },
          ]}
        />
        <Typography gutterBottom>
          <b>Items</b>
          <br /> {Math.round(storage.items)}% &bull;{" "}
          {(data || { count: 0 }).count} items
        </Typography>
        <Typography gutterBottom>
          <b>Boards</b>
          <br /> {Math.round(storage.boards)}% &bull;{" "}
          {(boardCount || []).length} boards
        </Typography>
        <Typography gutterBottom sx={{ mt: 1 }}>
          <b>
            {total} out of {max} credits left
          </b>
        </Typography>
      </Box>
    </Box>
  );
}
