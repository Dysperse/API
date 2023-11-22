"use client";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { updateSettings } from "@/lib/client/updateSettings";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, Button, Icon, SwipeableDrawer, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { cloneElement, useState } from "react";
import { hslToHex } from "../page";

export function HomePageCustomization({ children }) {
  const { session, setSession } = useSession();
  const palette = useColor(
    session.themeColor,
    useDarkMode(session.user.darkMode)
  );
  const [open, setOpen] = useState<boolean>(false);
  const trigger = cloneElement(children, {
    onClick: () => setOpen(true),
  });

  const currentPattern = session.user.homePagePattern;

  const boxStyles = (isActive) => ({
    borderRadius: 5,
    aspectRatio: "1 / 1",
    border: `2px solid ${palette[isActive ? 9 : 3]}`,
    display: "flex",
    alignItems: "end",
    p: 1,
    position: "relative",
    color: palette[11],
    textShadow: `0 0 20px  ${palette[1]}`,
    "& .MuiIcon-root": {
      position: "absolute",
      top: 0,
      right: 0,
      m: 2,
    },
  });

  const handlePatternSelect = (pattern) => {
    setOpen(false);
    updateSettings(["homePagePattern", pattern], { session, setSession });
  };

  const patterns = [
    "dots",
    "topography",
    "hideout",
    "triangles",
    "dysperse",
    "anchors",
    "diamonds",
    "leaves",
    "skulls",
    "tic-tac-toe",
    "cash",
    "shapes",
    "venn",
    "wiggle",
    "motion",
    "autumn",
    "architect",
    "sand",
    "graph",
    "hexagons",
    "plus",
  ];

  return (
    <>
      {trigger}
      <SwipeableDrawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="bottom"
        PaperProps={{
          sx: {
            maxWidth: "700px",
            border: { sm: `2px solid ${palette[6]}` },
            borderRadius: 5,
            p: 3,
            maxHeight: "calc(100dvh - 100px)",
            mb: { sm: "50px" },
          },
        }}
      >
        <Box sx={{ display: "flex", mb: 2, alignItems: "center" }}>
          <Typography variant="h3" className="font-heading">
            Customize
          </Typography>
          <Button
            variant="contained"
            sx={{ ml: "auto", mt: -1 }}
            onClick={() => setOpen(false)}
          >
            Done
          </Button>
        </Box>
        <Grid container spacing={2}>
          <Grid xs={4}>
            <Box
              sx={boxStyles(currentPattern === null)}
              onClick={() => handlePatternSelect("SOLID")}
            >
              <Typography noWrap variant="h6">
                Solid
              </Typography>
            </Box>
          </Grid>
          {patterns.map((pattern, i) => (
            <Grid key={i} xs={4}>
              <Box
                onClick={() => handlePatternSelect(pattern)}
                sx={{
                  ...boxStyles(currentPattern === pattern),
                  background: `url("/api/user/homePagePattern?${new URLSearchParams(
                    {
                      color: hslToHex(
                        palette[7]
                          .replaceAll(/hsl\(|\)|%/g, "")
                          .split(",")
                          .map((e) => +e) as any
                      ),
                      pattern,
                    }
                  )}")`,
                }}
              >
                {currentPattern === pattern && <Icon>check_circle</Icon>}
                <Typography variant="h6" noWrap>
                  {capitalizeFirstLetter(pattern)}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </SwipeableDrawer>
    </>
  );
}
