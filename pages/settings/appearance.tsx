import { useSession } from "@/lib/client/session";
import { updateSettings } from "@/lib/client/updateSettings";
import { useStatusBar } from "@/lib/client/useStatusBar";
import {
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
  Typography,
} from "@mui/material";
import * as colors from "@radix-ui/colors";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { cloneElement, useState } from "react";
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
      <Button
        onClick={() => setOpen(true)}
        variant="contained"
        sx={{ ml: "auto" }}
      >
        Change
      </Button>
    ),
    {
      onClick: () => setOpen(true),
    }
  );

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
            overflow: "visible",
            justifyContent: "center",
            background: previewPalette[9],
          },
        }}
      >
        <Box sx={{ overflow: "hidden" }} ref={emblaRef}>
          <Box
            sx={{
              display: "flex",
              "& .slide": {
                flex: "0 0 50dvw",
                minWidth: 0,
              },
            }}
          >
            {Object.keys(themes).map((theme, index) => {
              return (
                <Box
                  key={theme}
                  className="slide"
                  sx={{
                    width: "50dvw",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <IconButton
                    onClick={() => {
                      emblaApi?.scrollTo(index);
                      setCurrentTheme(theme);
                    }}
                    size="small"
                    key={theme}
                    {...(currentTheme === theme && { id: "currentTheme" })}
                    sx={{
                      background: "transparent!important",
                    }}
                  >
                    <Icon
                      sx={{
                        fontSize: "min(50dvw, 250px) !important",
                        background: `linear-gradient(${
                          index % 3 ? "-45deg" : "45deg"
                        }, ${colors[`${theme}Dark`][`${theme}9`]}, ${
                          colors[`${theme}Dark`][`${theme}11`]
                        })`,
                        transform: "rotate(30deg)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        transition: "all 0.2s ease",
                        // ...(currentTheme !== theme && {
                        //   fontVariationSettings:
                        //     '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 90 !important',
                        // }),
                      }}
                    >
                      hexagon
                    </Icon>
                  </IconButton>
                </Box>
              );
            })}
          </Box>
        </Box>
        <Typography sx={{ opacity: 0.6 }}>
          {(Object.keys(themes).indexOf(currentTheme) + 1)
            .toString()
            .padStart(2, "0")}
        </Typography>
        <Typography
          variant="h3"
          className="font-heading"
          sx={{
            color: previewPalette[4],
            mb: 1,
          }}
        >
          {themes[currentTheme]?.name}
        </Typography>
        <Typography sx={{ mb: 2, color: previewPalette[7] }}>
          {themes[currentTheme]?.description}
        </Typography>
        <Button
          variant="outlined"
          sx={{
            borderWidth: "2px!important",
            background: "transparent!important",
            borderColor: previewPalette[11] + "!important",
            color: previewPalette[12] + "!important",
            mb: 1,
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
