"use client";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, Skeleton, useMediaQuery } from "@mui/material";
import { memo } from "react";

export function PerspectivesLoadingScreen(): any {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const TaskSkeleton = memo(function A() {
    return (
      <Box
        sx={{
          display: "flex",
          gap: 2,
          px: 3,
          pt: 3,
          alignItems: "center",
        }}
      >
        <Skeleton
          animation="wave"
          variant="circular"
          width={30}
          height={30}
          sx={{ flexShrink: 0 }}
        />
        <Skeleton
          animation="wave"
          variant="rectangular"
          sx={{
            width: `${120 - Math.random() * 100}%`,
            minWidth: "50%",
            maxWidth: "100%",
          }}
        />
      </Box>
    );
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: { xs: "100%", sm: "100dvh" },
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 2, width: "100%" }}>
        <Skeleton
          animation="wave"
          variant="rectangular"
          sx={{
            display: { xs: "none", sm: "flex" },
            height: "55px",
            borderRadius: 5,
            opacity: 0.7,
          }}
        />
      </Box>
      <Box sx={{ display: "flex" }}>
        {[...new Array(isMobile ? 1 : Math.round(window.innerWidth / 320))].map(
          (_, i) => (
            <Box
              key={i}
              sx={{
                borderRight: `2px solid ${addHslAlpha(palette[4], 0.5)}`,
                width: { xs: "100%", sm: "320px" },
                flex: { xs: "0 0 100%", sm: "0 0 320px" },
                pt: { xs: "var(--navbar-height)", sm: 0 },
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: { xs: 3, sm: 4.3 },
                  borderBottom: {
                    sm: `2px solid ${addHslAlpha(palette[4], 0.5)}`,
                  },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                {isMobile && (
                  <Skeleton
                    animation="wave"
                    variant="circular"
                    width={30}
                    height={30}
                    sx={{
                      flexShrink: 0,
                      mr: "auto",
                    }}
                  />
                )}
                <Skeleton
                  animation="wave"
                  variant="circular"
                  width={35}
                  height={35}
                  sx={{
                    borderRadius: 3,
                    flexShrink: 0,
                  }}
                />
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  height={35}
                  width={120}
                />
                {isMobile && (
                  <Skeleton
                    animation="wave"
                    variant="circular"
                    width={30}
                    height={30}
                    sx={{
                      flexShrink: 0,
                      ml: "auto",
                    }}
                  />
                )}
              </Box>
              <Box sx={{ py: 2, px: 3, display: "flex", gap: 2.5, mb: -2 }}>
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  height={37}
                  sx={{ flexGrow: 1 }}
                />
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  height={37}
                  width={60}
                  sx={{ flexShrink: 0 }}
                />
              </Box>
              {[...new Array(isMobile ? 15 : ~~(Math.random() * 4) + 4)].map(
                (_, i) => (
                  <TaskSkeleton key={i} />
                )
              )}
            </Box>
          )
        )}
      </Box>
    </Box>
  );
}
