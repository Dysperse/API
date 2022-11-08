import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import NoSsr from "@mui/material/NoSsr";
import Skeleton from "@mui/material/Skeleton";
import Toolbar from "@mui/material/Toolbar";
import hex2rgba from "hex-to-rgba";
import React, { useState } from "react";
import { colors } from "../../lib/colors";

/**
 * Loading screen
 * @returns JSX.Element
 */

export function Loading(): JSX.Element {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        background:
          global.user && global.user.darkMode ? "hsl(240,11%,10%)" : "#fff",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <AppBar
        sx={{
          position: "fixed",
          top: 0,
          background: "transparent",
          py: {
            sm: 1,
            xs: 0.9,
          },
        }}
        elevation={0}
      >
        <Toolbar>
          <Skeleton
            animation={false}
            sx={{ width: { xs: 130, sm: 200 }, maxWidth: "100%" }}
          />
          <Skeleton
            animation={false}
            variant="rectangular"
            sx={{
              height: 40,
              borderRadius: 5,
              mx: "auto",
              width: { xs: 0, sm: "500px" },
              maxWidth: "100%",
            }}
          />
          <Box sx={{ ml: "auto", display: "flex", gap: 1.5 }}>
            {[...new Array(3)].map((id) => (
              <Skeleton
                variant="circular"
                animation={false}
                width={35}
                key={Math.random().toString()}
                height={35}
                sx={{
                  maxWidth: "100%",
                }}
              />
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            alignItems: "center",
            height: "100vh",
            gap: 2,
            justifyContent: "center",
            width: "95px",
            pt: 5,
            px: 1,
          }}
        >
          {[...new Array(5)].map(() => (
            <Skeleton
              variant="rectangular"
              animation={false}
              key={Math.random().toString()}
              sx={{ borderRadius: 5, height: 50, width: 50 }}
            />
          ))}
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100vh",
            }}
          >
            <CircularProgress
              disableShrink
              size={20}
              sx={{
                animationDuration: "550ms",
                [`& .MuiCircularProgress-circle`]: {
                  strokeLinecap: "round",
                  stroke: colors.brown[900],
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
