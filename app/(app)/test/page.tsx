"use client";

import { Box, Skeleton, useMediaQuery } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

export default function HomePageLoading() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const triggers = (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
        mt: 2,
        mb: { xs: 4, sm: 0 },
        gap: 2,
      }}
    >
      <Skeleton width="100%" height={62} variant="rectangular" />
      <Skeleton
        width={62}
        height={62}
        variant="rectangular"
        sx={{ flexShrink: 0 }}
      />
    </Box>
  );
  return (
    <Box
      sx={{
        width: "100%",
        height: "100dvh",
      }}
    >
      <Grid
        container
        sx={{
          mt: { xs: 16, sm: 0 },
          width: "100%",
          height: { sm: "100dvh" },
          flex: { xs: "0 0 100dvw", sm: "0 0 100%" },
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          py: 2,
          "&>div": {
            "&:first-child": {
              pl: { xs: 4, sm: 5, xl: 20 },
              pr: { xs: 4, sm: 2.5, xl: 10 },
            },
            "&:last-child": {
              pr: { xs: 4, sm: 5, xl: 20 },
              pl: { xs: 4, sm: 2.5, xl: 10 },
            },
          },
          "& .card": {
            borderRadius: 5,
            color: (theme) => theme.palette.primary[11],
            background: (theme) => theme.palette.primary[3],
            transition: "background .2s",
            "&:hover": (theme) => ({
              background: { sm: theme.palette.primary[4] },
            }),
            "&:active": (theme) => ({ background: theme.palette.primary[5] }),
          },
        }}
      >
        <Grid
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Skeleton
              width={100}
              height={13}
              variant="rectangular"
              sx={{ mb: 2 }}
            />
            <Skeleton
              width={300}
              height={isMobile ? 43 : 65}
              variant="rectangular"
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, my: 2 }}>
              <Skeleton width={30} height={30} variant="circular" />
              <Skeleton width={"100%"} height={22} variant="rectangular" />
            </Box>
            {isMobile && triggers}
            <Skeleton width={132.09} height={18.4} variant="rectangular" />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 2 }}>
              <Skeleton width={"100%"} height={130} variant="rectangular" />
              <Skeleton width={"100%"} height={130} variant="rectangular" />
            </Box>
            <Skeleton width={"100%"} height={84} variant="rectangular" />
          </Box>
        </Grid>
        <Grid
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                justifyContent: "end",
              }}
            >
              <Skeleton width={167.45} height={39.45} variant="rectangular" />
            </Box>
            {!isMobile && triggers}
            <Skeleton
              width={117.24}
              height={18.4}
              variant="rectangular"
              sx={{ mb: 2, mt: 3 }}
            />
            <Skeleton width="100%" height={380} variant="rectangular" />
          </Box>
          <Box
            sx={{
              display: { xs: "flex", sm: "none", justifyContent: "center" },
            }}
          >
            <Skeleton width={167.45} height={39.45} variant="rectangular" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
