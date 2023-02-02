import { Box, Skeleton } from "@mui/material";

export function Loading() {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        overflow: "hidden",
      }}
    >
      {[...new Array(5)].map(() => (
        <Skeleton
          variant="rectangular"
          animation="wave"
          key={Math.random().toString()}
          height={500}
          sx={{
            width: { xs: "calc(100vw - 50px)", sm: "370px" },
            flex: { xs: "0 0 calc(100vw - 50px)", sm: "0 0 370px" },
            borderRadius: 5,
          }}
        />
      ))}
    </Box>
  );
}
