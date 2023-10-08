import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Avatar, Box, Icon, Skeleton, Typography } from "@mui/material";
import { useRouter } from "next/router";
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
  const router = useRouter();
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const orangePalette = useColor("orange", isDark);
  const redPalette = useColor("red", isDark);
  const palette = useColor(color, isDark);

  const { data, mutate, error } = useSWR([
    "property/storage",
    {
      property: propertyId,
      accessToken,
    },
  ]);

  const used = data
    ? ((data._count.Task * multipliers.tasks +
        data._count.inventory * multipliers.items) /
        max) *
      100
    : 0;

  return (
    <>
      {error || !data ? (
        <Box>
          {error ? (
            <ErrorHandler
              callback={() => mutate()}
              error="An error occured while trying to get your account's storage information. Please try again later"
            />
          ) : (
            <Skeleton animation="wave" variant="rectangular" height={120} />
          )}
        </Box>
      ) : (
        <Box
          onClick={() => router.push(`/spaces/${propertyId}/storage`)}
          sx={{
            height: "120px",
            background: palette[2],
            "&:active": {
              background: palette[3],
            },
            borderRadius: 5,
            p: 2,
            px: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5, gap: 2 }}>
            {used >= 75 && used < 100 && (
              <Avatar sx={{ background: orangePalette[4] }}>
                <Icon className="outlined" sx={{ color: orangePalette[11] }}>
                  warning
                </Icon>
              </Avatar>
            )}
            {used >= 100 && (
              <Avatar sx={{ background: redPalette[4] }}>
                <Icon className="outlined" sx={{ color: redPalette[11] }}>
                  error
                </Icon>
              </Avatar>
            )}
            <Box>
              <Typography variant="h6">Storage</Typography>
              <Typography variant="body2">{~~used}% used</Typography>
            </Box>
            <Icon sx={{ ml: "auto" }}>arrow_forward_ios</Icon>
          </Box>
          <Box
            sx={{
              width: "100%",
              background: palette[5],
              height: 15,
              borderRadius: 99,
              display: "flex",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: `${
                  ((data._count.Task * multipliers.tasks) / max) * 100
                }%`,
                background: palette[11],
              }}
            />
            <Box
              sx={{
                width: `${
                  ((data._count.inventory * multipliers.items) / max) * 100
                }%`,
                background: palette[9],
                borderRadius: "0 20px 20px 0",
              }}
            />
          </Box>
        </Box>
      )}
    </>
  );
}
