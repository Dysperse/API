import { useSession } from "@/lib/client/session";
import { updateSettings } from "@/lib/client/updateSettings";
import { useStatusBar } from "@/lib/client/useStatusBar";
import {
  AppBar,
  Box,
  Button,
  Icon,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Radio,
  RadioGroup,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from "@mui/material";
import * as colors from "@radix-ui/colors";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { cloneElement, useEffect, useState } from "react";
import Layout from ".";
import { useColor, useDarkMode } from "../../lib/client/useColor";
import themes from "./themes.json";

/**
 * Function to change theme color (Not dark mode!)
 */
export function ThemeColorSettings({ children }: { children?: JSX.Element }) {
  const { session } = useSession();
  const [open, setOpen] = useState(false);

  const [currentTheme, setCurrentTheme] = useState(session?.themeColor);
  const previewPalette = useColor(currentTheme, useDarkMode(session.darkMode));
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: false, slidesToScroll: 1, align: "center" },
    [(WheelGesturesPlugin as any)({ wheelDraggingClass: "scrolling" })]
  );

  useStatusBar(open ? previewPalette[9] : previewPalette[1]);

  const trigger = cloneElement(
    children || (
      <Box sx={{ px: 1 }}>
        <Button variant="contained" sx={{ ml: "auto" }} fullWidth>
          <Icon>palette</Icon>
          Change theme color
        </Button>
      </Box>
    ),
    {
      onClick: () => setOpen(true),
    }
  );

  const [currentIndex, setCurrentIndex] = useState(1);

  useEffect(() => {
    if (emblaApi) {
      const d =
        Object.keys(themes).findIndex((d) => d === session.themeColor) + 1 || 1;
      setTimeout(() => {
        emblaApi.scrollTo(d);
        setCurrentIndex(d);
      });

      emblaApi.on("select", () => {
        const i = emblaApi.selectedScrollSnap();
        setCurrentIndex(i);
        setCurrentTheme(Object.keys(themes)[i - 1]);
        if (i === 0) {
          emblaApi.scrollTo(1);
        }
      });
    }
  }, [emblaApi]);

  const scrollToIndex = (index) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }
  };

  return (
    <>
      {trigger}
      <SwipeableDrawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="bottom"
        PaperProps={{
          sx: {
            borderRadius: 0,
            height: "100dvh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            justifyContent: "center",
          },
        }}
      >
        <Box
          sx={{
            height: "100dvh",
            display: "flex",
            flexDirection: "column",
            overflow: "visible",
            justifyContent: "center",
            background: previewPalette[9],
            transition: "all .3s",
          }}
        >
          <AppBar
            sx={{
              position: "absolute",
              background: "transparent",
              backdropFilter: "none",
              border: 0,
              "& *": {
                color: previewPalette[1] + "!important",
              },
            }}
          >
            <Toolbar>
              <IconButton>
                <Icon className="outlined">expand_circle_down</Icon>
              </IconButton>
              <Typography sx={{ mx: "auto" }}>
                {currentIndex.toString().padStart(2, "0")}
              </Typography>
              <IconButton sx={{ visibility: "hidden" }}>
                <Icon className="outlined">check_circle</Icon>
              </IconButton>
            </Toolbar>
          </AppBar>
          <Toolbar />
          <Box
            sx={{
              overflow: "visible",
              flexShrink: 0,
              height: "min(50dvw, 250px)",
              my: "auto",
            }}
            ref={emblaRef}
          >
            <Box
              sx={{
                display: "flex",
                height: "100%",
                "& .slide": {
                  flex: "0 0 50%",
                  minWidth: 0,
                  height: "100%",
                },
              }}
            >
              <Box
                key="-1"
                className="slide"
                sx={{
                  width: "50%",
                  display: "flex",
                  justifyContent: "center",
                }}
              ></Box>
              {Object.keys(themes).map((theme, index) => {
                return (
                  <Box
                    key={theme}
                    className="slide"
                    sx={{
                      width: "50%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      onClick={() => {
                        setCurrentTheme(theme);
                        scrollToIndex(index + 1);
                      }}
                      key={theme}
                      {...(currentTheme === theme && { id: "currentTheme" })}
                      sx={{
                        background: "transparent!important",
                      }}
                    >
                      <Icon
                        sx={{
                          fontSize: "min(50dvw, 250px) !important",
                          transition: "all 0.2s ease",
                          ...(currentIndex == index + 1
                            ? {
                                transform: "rotate(30deg) scale(1.2)",
                                background: `linear-gradient(${
                                  index % 3 ? "-45deg" : "45deg"
                                }, ${colors[`${theme}Dark`][`${theme}8`]}, ${
                                  colors[`${theme}Dark`][`${theme}9`]
                                })`,
                                filter: `drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))`,
                              }
                            : {
                                fontVariationSettings:
                                  '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 90 !important',
                                background: `linear-gradient(${
                                  index % 3 ? "-45deg" : "45deg"
                                }, ${colors[`${theme}Dark`][`${theme}9`]}, ${
                                  colors[`${theme}Dark`][`${theme}11`]
                                })`,
                                transform: "rotate(30deg)",
                              }),
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        hexagon
                      </Icon>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
          <Box
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              height: "250px",
              flexShrink: 0,
              overflowY: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
                gap: 1,
                "& .MuiIcon-root": { color: previewPalette[6] + "!important" },
                "& .MuiIconButton-root": {
                  background: "transparent",
                  display: { xs: "none", sm: "flex" },
                  "&:active": { background: `rgba(0,0,0,0.1)!important` },
                },
              }}
            >
              <IconButton onClick={() => emblaApi?.scrollPrev()}>
                <Icon>arrow_back_ios_new</Icon>
              </IconButton>
              <Typography
                variant="h3"
                className="font-heading"
                sx={{
                  color: previewPalette[4],
                }}
              >
                {themes[currentTheme]?.name}
              </Typography>
              <IconButton onClick={() => emblaApi?.scrollNext()}>
                <Icon>arrow_forward_ios</Icon>
              </IconButton>
            </Box>
            <Typography sx={{ mb: 2, color: previewPalette[7] }}>
              {themes[currentTheme]?.description}
            </Typography>
            <Button
              variant="outlined"
              sx={{
                borderWidth: "2px!important",
                background: "transparent!important",
                borderColor: previewPalette[6] + "!important",
                "&:active": { background: `rgba(0,0,0,0.1)!important` },
                color: previewPalette[6] + "!important",
                flexShrink: 0,
              }}
              onClick={() => {
                updateSettings(["color", currentTheme.toLowerCase()], {
                  session,
                });
                setOpen(false);
              }}
            >
              APPLY
            </Button>
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

/**
 * Top-level component for the appearance settings page.
 */
export default function AppearanceSettings() {
  const { session } = useSession();

  return (
    <Layout>
      <ThemeColorSettings />
      <ListSubheader sx={{ mt: 3 }}>Theme</ListSubheader>
      <RadioGroup name="controlled-radio-buttons-group">
        <ListItem
          onClick={() => updateSettings(["darkMode", "dark"], { session })}
          secondaryAction={
            <Radio
              edge="end"
              onChange={() => updateSettings(["darkMode", "dark"], { session })}
              checked={session.darkMode === "dark"}
            />
          }
          disablePadding
        >
          <ListItemIcon
            sx={{
              mr: 0,
              pr: 0,
              width: "20px",
            }}
          >
            <Box
              sx={{
                ml: "20px",
                background: "hsl(240,11%,20%)",
                width: "20px",
                height: "20px",
                borderRadius: 999,
              }}
            />
          </ListItemIcon>
          <ListItemButton sx={{ borderRadius: 2, transition: "none" }}>
            <ListItemText primary="Dark" />
          </ListItemButton>
        </ListItem>
        <ListItem
          onClick={() => updateSettings(["darkMode", "light"], { session })}
          secondaryAction={
            <Radio
              edge="end"
              onChange={() =>
                updateSettings(["darkMode", "light"], { session })
              }
              checked={session.darkMode === "light"}
            />
          }
          disablePadding
        >
          <ListItemIcon
            sx={{
              mr: 0,
              pr: 0,
              width: "20px",
            }}
          >
            <Box
              sx={{
                ml: "20px",
                background: "hsl(240,11%,90%)",
                width: "20px",
                height: "20px",
                borderRadius: 999,
              }}
            />
          </ListItemIcon>
          <ListItemButton sx={{ borderRadius: 2, transition: "none" }}>
            <ListItemText primary="Light" />
          </ListItemButton>
        </ListItem>
        <ListItem
          onClick={() => updateSettings(["darkMode", "system"], { session })}
          secondaryAction={
            <Radio
              edge="end"
              onChange={() =>
                updateSettings(["darkMode", "system"], { session })
              }
              checked={session.darkMode === "system"}
            />
          }
          disablePadding
        >
          <ListItemIcon
            sx={{
              mr: 0,
              pr: 0,
              width: "20px",
            }}
          >
            <Box
              sx={{
                ml: "20px",
                background: "#aaa",
                width: "20px",
                height: "20px",
                borderRadius: 999,
              }}
            />
          </ListItemIcon>
          <ListItemButton sx={{ borderRadius: 2, transition: "none" }}>
            <ListItemText primary="System" />
          </ListItemButton>
        </ListItem>
      </RadioGroup>
    </Layout>
  );
}
