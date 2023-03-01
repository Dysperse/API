import { Alert, AlertTitle, Box, Skeleton, Typography } from "@mui/material";
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
  const { data: boardCount }: ApiResponse = useApi(
    "property/boards/taskCount",
    {
      property: propertyId,
      accessToken,
    }
  );

  const max = 500;
  const multipliers = { items: 1.5, tasks: 0.5 };
  const storage = {
    items: (((data || { count: 0 }).count * multipliers.items) / max) * 100,
    tasks: (((boardCount || 0) * multipliers.tasks) / max) * 100,
  };

  const total =
    max -
    Math.round(
      (boardCount || 0) * multipliers.tasks +
        (data || { count: 0 }).count * multipliers.items
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
      {total >= max && (
        <Alert severity="warning" sx={{ mt: 3, gap: 1.5, mb: -2 }}>
          <AlertTitle sx={{ mb: 0.5 }}>
            You&apos;ve used up all your credits
          </AlertTitle>
          To keep Dysperse free and up for everyone, we implement{" "}
          <i>generous</i> limits. Since you&apos;ve reached your account storage
          limits, you won&apos;t be able to create any more tasks or items. Try
          deleting these to free up space.
        </Alert>
      )}
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
        <Box
          sx={{
            display: "flex",
            height: 20,
            borderRadius: 999,
            overflow: "hidden",
            background: global.user.darkMode
              ? "hsl(240,11%,15%)"
              : colors[color][200],
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: `${storage.items}%`,
              background: colors[color][global.user.darkMode ? 500 : 700],
              height: "100%",
            }}
          />
          <Box
            sx={{
              width: `${storage.tasks}%`,
              background: colors[color][global.user.darkMode ? 200 : 800],
              height: "100%",
              borderRadius: "0 99px 99px 0",
            }}
          />
        </Box>
        <Typography gutterBottom>
          <b>Items</b>
          <br /> {Math.round(storage.items)}% &bull;{" "}
          {(data || { count: 0 }).count} items
        </Typography>
        <Typography gutterBottom>
          <b>Tasks</b>
          <br /> {Math.round(storage.tasks)}% &bull; {boardCount || 0} tasks
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
