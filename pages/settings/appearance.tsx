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
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Layout from ".";
import { useColor, useDarkMode } from "../../lib/client/useColor";
import themes from "./themes.json";

/**
 * Function to change theme color (Not dark mode!)
 */
function ThemeColorSettings() {
  const session = useSession();
  const [open, setOpen] = useState(false);

  const [currentTheme, setCurrentTheme] = useState(session?.themeColor);
  const previewPalette = useColor(
    currentTheme,
    useDarkMode(session.user.darkMode),
  );

  useStatusBar(open ? previewPalette[9] : previewPalette[1]);

  return (
    <Box>
      <ListSubheader>Theme color</ListSubheader>
      <Button onClick={() => setOpen(true)}>Change</Button>
      <SwipeableDrawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="bottom"
        PaperProps={{
          sx: {
            borderRadius: 0,
            height: "100vh",
            background: `linear-gradient(${previewPalette[9]}, ${previewPalette[11]}, ${previewPalette[8]})`,
            display: "flex",
            flexDirection: "column",
            overflow: "visible",
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            background: previewPalette[9],
            height: "10px",
            mt: open ? "-10px" : 0,
            borderRadius: "20px 20px 0 0",
          }}
        />
        <IconButton
          onClick={() => setOpen(false)}
          sx={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 999,
            color: previewPalette[2] + "!important",
          }}
        >
          <Icon>expand_more</Icon>
        </IconButton>

        <AnimatePresence
          mode="wait"
          onExitComplete={() => {
            setTimeout(() => {
              document.getElementById("currentTheme")?.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
              });
            }, 1000);
          }}
        >
          <Box
            key={currentTheme}
            sx={{
              px: 3,
              mt: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Typography sx={{ opacity: 0.6 }}>
                {(Object.keys(themes).indexOf(currentTheme) + 1)
                  .toString()
                  .padStart(2, "0")}
              </Typography>
            </motion.div>
            <motion.div
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
            >
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
            </motion.div>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Typography sx={{ mb: 2, color: previewPalette[7] }}>
                {themes[currentTheme]?.description}
              </Typography>
            </motion.div>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                variant="outlined"
                sx={{
                  borderWidth: "2px!important",
                  background: "transparent!important",
                  borderColor: previewPalette[11] + "!important",
                  mb: 1,
                }}
                onClick={() => {
                  updateSettings(session, "color", currentTheme.toLowerCase());
                  setOpen(false);
                }}
              >
                APPLY
              </Button>
            </motion.div>
          </Box>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <Box
            key={`bottom_${currentTheme}`}
            sx={{
              "& ._container": {
                display: "flex",
                overflow: "auto",
                px: 3,
                mb: 3,
              },
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1 }}
              className="_container"
            >
              {Object.keys(themes).map((theme) => {
                const color = themes[theme];

                return (
                  <IconButton
                    size="small"
                    key={theme}
                    {...(currentTheme === theme && { id: "currentTheme" })}
                    onClick={() => setCurrentTheme(theme)}
                    sx={{
                      color:
                        colors[theme] &&
                        colors[theme][theme + 9] + "!important",
                      transition: "all 0.2s ease",
                      ...(currentTheme === theme && {
                        transform: "scale(1.5)",
                      }),
                    }}
                  >
                    <Icon sx={{ fontSize: "40px!important" }}>
                      change_history
                    </Icon>
                  </IconButton>
                );
              })}
            </motion.div>
          </Box>
        </AnimatePresence>
      </SwipeableDrawer>
    </Box>
  );
}

/**
 * Top-level component for the appearance settings page.
 */
export default function AppearanceSettings() {
  const session = useSession();
  const isDark = useDarkMode(session.darkMode);

  return (
    <Layout>
      <ThemeColorSettings />
      <ListSubheader sx={{ mt: 3 }}>Theme</ListSubheader>
      <RadioGroup name="controlled-radio-buttons-group">
        <ListItem
          onClick={() => updateSettings(session, "darkMode", "dark")}
          secondaryAction={
            <Radio
              edge="end"
              onChange={() => updateSettings(session, "darkMode", "dark")}
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
          onClick={() => updateSettings(session, "darkMode", "light")}
          secondaryAction={
            <Radio
              edge="end"
              onChange={() => updateSettings(session, "darkMode", "light")}
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
          onClick={() => updateSettings(session, "darkMode", "system")}
          secondaryAction={
            <Radio
              edge="end"
              onChange={() => updateSettings(session, "darkMode", "system")}
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
