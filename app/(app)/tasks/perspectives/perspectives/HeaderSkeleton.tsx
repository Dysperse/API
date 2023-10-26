import { Box, Skeleton } from "@mui/material";

export function HeaderSkeleton() {
  return (
    <Box
      sx={{
        px: 3,
        mt: 1,
        mb: -1,
        py: { xs: 3, sm: 4.3 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Skeleton
        animation={false}
        variant="circular"
        width={30}
        height={30}
        sx={{
          flexShrink: 0,
          mr: "auto",
        }}
      />
      <Skeleton
        animation={false}
        variant="circular"
        width={35}
        height={35}
        sx={{
          borderRadius: 3,
          flexShrink: 0,
        }}
      />
      <Skeleton
        animation={false}
        variant="rectangular"
        height={35}
        width={120}
      />
      <Skeleton
        animation={false}
        variant="circular"
        width={30}
        height={30}
        sx={{
          flexShrink: 0,
          ml: "auto",
        }}
      />
    </Box>
  );
}
