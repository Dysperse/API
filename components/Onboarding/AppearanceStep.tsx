import { useSession } from "@/lib/client/session";
import { updateSettings } from "@/lib/client/updateSettings";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { ThemeColorSettings } from "@/pages/settings/appearance";
import themes from "@/pages/settings/themes.json";
import { Box, Container, Typography } from "@mui/material";
import * as colors from "@radix-ui/colors";
import toast from "react-hot-toast";

export function AppearanceStep({ styles, navigation }) {
  const session = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  const circleStyles = {
    borderRadius: 5,
    height: 30,
    overflow: "hidden",
    transition: "transform .2s ease",
    width: 30,
    "&:hover": {
      transform: "scale(1.1)",
    },
    "&:active": {
      transform: "scale(.9)",
    },
  };

  return (
    <Box sx={styles.container}>
      <Container>
        <Typography variant="h1" className="font-heading" sx={styles.heading}>
          Make yourself at home
        </Typography>
        <Typography sx={styles.helper}>
          Pick your color, profile picture, and theme.
        </Typography>
        <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h1" sx={styles.subheading}>
              Color
            </Typography>
            <ThemeColorSettings>
              <Box
                sx={{
                  p: 3,
                  border: "2px solid " + palette[9],
                  transition: "all .2s",
                  "&:hover": {
                    background: palette[2],
                    boxShadow: `0 0 25px 1px ${palette[8]}`,
                  },
                  borderRadius: 5,
                }}
              >
                <Typography variant="h5" className="font-heading">
                  {themes[session.themeColor].name}
                </Typography>
                <Typography variant="body2">
                  {themes[session.themeColor].description}
                </Typography>
              </Box>
            </ThemeColorSettings>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h1" sx={styles.subheading}>
              Theme
            </Typography>
            <Box sx={{ display: "flex", gap: 2, pb: 1 }}>
              <Box
                sx={{
                  background: colors.gray.gray4,
                  ...circleStyles,
                  ...(session.darkMode == "light" && {
                    boxShadow: "0px 0px 0px 3px " + palette[9],
                  }),
                }}
                onClick={() =>
                  toast.promise(
                    updateSettings(["darkMode", "light"], { session }),
                    {
                      loading: "Saving...",
                      error: "Couldn't save",
                      success: "Saved!",
                    }
                  )
                }
              />

              <Box
                sx={{
                  background: colors.grayDark.gray2,
                  ...circleStyles,
                  ...(session.darkMode == "dark" && {
                    boxShadow: "0px 0px 0px 3px " + palette[9],
                  }),
                }}
                onClick={() =>
                  toast.promise(
                    updateSettings(["darkMode", "dark"], { session }),
                    {
                      loading: "Saving...",
                      error: "Couldn't save",
                      success: "Saved!",
                    }
                  )
                }
              />

              <Box
                sx={{
                  ...circleStyles,
                  background: colors.grayDark.gray5,
                  transform: "rotate(45deg)",
                  ...(session.darkMode == "system" && {
                    boxShadow: "0px 0px 0px 3px " + palette[9],
                  }),
                }}
                onClick={() =>
                  toast.promise(
                    updateSettings(["darkMode", "system"], { session }),
                    {
                      loading: "Saving...",
                      error: "Couldn't save",
                      success: "Saved!",
                    }
                  )
                }
              >
                <Box
                  sx={{
                    background: colors.gray.gray5,
                    height: "100%",
                    width: 15,
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
