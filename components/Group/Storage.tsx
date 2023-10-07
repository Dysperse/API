import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Alert, AlertTitle, Box, Skeleton, Typography } from "@mui/material";
import * as colors from "@radix-ui/colors";
import useSWR from "swr";
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
  color: any;
}) {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);

  const palette = useColor(color, isDark);

  const { data, mutate, error } = useSWR([
    "property/storage",
    {
      property: propertyId,
      accessToken,
    },
  ]);

  const storage = {
    items:
      ((((data && data.items) || { count: 0 }).count * multipliers.items) /
        max) *
      100,
    tasks: ((((data && data.tasks) || 0) * multipliers.tasks) / max) * 100,
  };

  return error || !data ? (
    <Box>
      <Typography variant="h6" sx={{ px: 1 }}>
        Storage
      </Typography>
      {error ? (
        <ErrorHandler
          callback={() => mutate()}
          error="An error occured while trying to get your account's storage information. Please try again later"
        />
      ) : (
        <Box
          sx={{
            p: 2,
            mt: 2,
            mb: 2,
            userSelect: "none",
            px: 2.5,
            borderRadius: 5,
            background: palette[2],
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
      <Typography variant="h6" sx={{ px: 1 }}>
        Storage
      </Typography>
      <Box
        sx={{
          background: palette[2],
          color: palette[12],
          borderRadius: 5,
          p: 3,
          mt: 2,
          mb: 5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            height: 20,
            borderRadius: 999,
            overflow: "hidden",
            background: palette[3],
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: `${storage.items}%`,
              background: colors[color][color + "8"],
              height: "100%",
            }}
          />
          <Box
            sx={{
              width: `${storage.tasks}%`,
              background: colors[color][color + "9"],
              height: "100%",
              borderRadius: "0 99px 99px 0",
            }}
          />
        </Box>
        <Box sx={{ display: "flex" }}>
          <Typography gutterBottom sx={{ width: "100%" }}>
            <b>Items</b>
            <Typography variant="body2">
              {Math.round(storage.items)}% &bull;{" "}
              {(data.items || { count: 0 }).count} items
            </Typography>
          </Typography>
          <Typography gutterBottom sx={{ width: "100%" }}>
            <b>Tasks</b>
            <Typography variant="body2">
              {Math.round(storage.tasks)}% &bull; {data.tasks || 0} items
            </Typography>
          </Typography>
        </Box>
        <Typography gutterBottom sx={{ mt: 1 }} variant="body2">
          <b>
            {max - getTotal(data, data.tasks, data.items)}/{max}
          </b>
          &nbsp;credits left
        </Typography>
      </Box>
    </Box>
  );
}
