import { Alert, AlertTitle, Box, Skeleton, Typography } from "@mui/material";
import { useApi } from "../../lib/client/useApi";
import { useSession } from "../../lib/client/useSession";
import { colors } from "../../lib/colors";
import { ErrorHandler } from "../Error";

export const max = 500;
export const multipliers = { items: 1.5, tasks: 0.5 };
export const getTotal = (data, tasks, items) =>
  Math.round(
    ((data && tasks) || 0) * multipliers.tasks +
      ((data && items) || { count: 0 }).count * multipliers.items
  );

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
  const { data, error, url } = useApi("property/storage", {
    property: propertyId,
    accessToken,
  });

  const storage = {
    items:
      ((((data && data.items) || { count: 0 }).count * multipliers.items) /
        max) *
      100,
    tasks: ((((data && data.tasks) || 0) * multipliers.tasks) / max) * 100,
  };
  const session = useSession();
  return error || !data ? (
    <Box>
      <Typography variant="h6" sx={{ mt: 5, px: 1 }}>
        Storage
      </Typography>
      {error ? (
        <ErrorHandler error="An error occured while trying to get your account's storage information. Please try again later" />
      ) : (
        <Box
          sx={{
            p: 2,
            mt: 2,
            mb: 2,
            userSelect: "none",
            px: 2.5,
            borderRadius: 5,
            background: session.user.darkMode
              ? "hsl(240,11%,20%)"
              : colors[color][50],
          }}
        >
          <Skeleton animation="wave" />
        </Box>
      )}
    </Box>
  ) : (
    <Box>
      {getTotal(data, data.tasks, data.items) >= max && (
        <Alert severity="warning" sx={{ mt: 3, gap: 1.5, mb: -2 }}>
          <AlertTitle sx={{ mb: 0.5 }}>
            You&apos;ve used up all your credits
          </AlertTitle>
          To keep Dysperse free and up for everyone, we implement{" "}
          <i>generous</i> limits. Since you&apos;ve reached your account storage
          limits, you won&apos;t be able to create any more tasks or items. Try
          deleting these to free up some space.
        </Alert>
      )}
      <Typography variant="h6" sx={{ mt: 5, px: 1 }}>
        Storage
      </Typography>
      <Box
        sx={{
          background: `${
            session.user.darkMode ? "hsl(240,11%,20%)" : colors[color][50]
          }`,
          color: colors[color][session.user.darkMode ? 50 : 900].toString(),
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
            background: session.user.darkMode
              ? "hsl(240,11%,15%)"
              : colors[color][200],
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: `${storage.items}%`,
              background: colors[color][session.user.darkMode ? 500 : 700],
              height: "100%",
            }}
          />
          <Box
            sx={{
              width: `${storage.tasks}%`,
              background: colors[color][session.user.darkMode ? 200 : 800],
              height: "100%",
              borderRadius: "0 99px 99px 0",
            }}
          />
        </Box>
        <Typography gutterBottom>
          <b>Items</b>
          <br /> {Math.round(storage.items)}% &bull;{" "}
          {(data.items || { count: 0 }).count} items
        </Typography>
        <Typography gutterBottom>
          <b>Tasks</b>
          <br /> {Math.round(storage.tasks)}% &bull; {data.tasks || 0} tasks
        </Typography>
        <Typography gutterBottom sx={{ mt: 1 }}>
          <b>
            {max - getTotal(data, data.tasks, data.items)} out of {max} credits
            left
          </b>
        </Typography>
      </Box>
    </Box>
  );
}
