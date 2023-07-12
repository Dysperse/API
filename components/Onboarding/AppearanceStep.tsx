import { useSession } from "@/lib/client/session";
import { updateSettings } from "@/lib/client/updateSettings";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, Container, Icon, Typography } from "@mui/material";
import * as colors from "@radix-ui/colors";

export function AppearanceStep({ styles, navigation }) {
  const session = useSession();
  const palette = useColor(
    session.themeColor,
    useDarkMode(session.user.darkMode),
  );

  return (
    <Box sx={styles.container}>
      <Container>
        <Typography variant="h1" className="font-heading" sx={styles.heading}>
          Make yourself at home
        </Typography>
        <Typography sx={styles.helper}>
          Pick your color, profile picture, and theme.
        </Typography>
        <Typography variant="h1" sx={styles.subheading}>
          Choose your color
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {Object.keys(colors)
            .filter((color) => !color.includes("Dark"))
            .filter((color) => !color.endsWith("A"))
            .filter(
              (color) =>
                ![
                  "bronze",
                  "gold",
                  "sand",
                  "olive",
                  "slate",
                  "mauve",
                  "gray",
                ].includes(color),
            )
            .map((color) => (
              <Box
                key={color}
                onClick={() =>
                  updateSettings(session, "color", color.toLowerCase())
                }
                sx={{
                  background:
                    colors[color] &&
                    `linear-gradient(45deg, ${colors[color][color + 10]}, ${
                      colors[color][color + 12]
                    })`,
                  width: "30px",
                  height: "30px",
                  borderRadius: 999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {session.themeColor == color.toLowerCase() && (
                  <Icon
                    sx={{
                      color: "#fff",
                    }}
                  >
                    check
                  </Icon>
                )}
              </Box>
            ))}
        </Box>
        <Typography variant="h1" sx={styles.subheading}>
          Choose a theme
        </Typography>
        <Box sx={{ display: "flex", gap: 2, pb: 1 }}>
          <Box
            sx={{
              background: colors.gray.gray4,
              borderRadius: 5,
              height: { xs: 30, sm: 150 },
              width: { xs: 30, sm: 200 },
              overflow: "hidden",
              ...(session.user.darkMode == "light" && {
                boxShadow: "0px 0px 0px 3px " + palette[9],
              }),
            }}
            onClick={() => updateSettings(session, "darkMode", "light")}
          >
            <Box
              sx={{
                background: colors.gray.gray7,
                height: "100%",
                width: 50,
              }}
            />
          </Box>

          <Box
            sx={{
              background: colors.grayDark.gray2,
              borderRadius: 5,
              height: { xs: 30, sm: 150 },
              width: { xs: 30, sm: 200 },
              overflow: "hidden",
              ...(session.user.darkMode == "dark" && {
                boxShadow: "0px 0px 0px 3px " + palette[9],
              }),
            }}
            onClick={() => updateSettings(session, "darkMode", "dark")}
          >
            <Box
              sx={{
                background: colors.grayDark.gray5,
                height: "100%",
                width: 50,
              }}
            />
          </Box>

          <Box
            sx={{
              background: colors.gray.gray5,
              borderRadius: 5,
              height: { xs: 30, sm: 150 },
              width: { xs: 30, sm: 200 },
              overflow: "hidden",
              ...(session.user.darkMode == "system" && {
                boxShadow: "0px 0px 0px 3px " + palette[9],
              }),
            }}
            onClick={() => updateSettings(session, "darkMode", "system")}
          >
            <Box
              sx={{
                background: colors.grayDark.gray5,
                height: "100%",
                width: { xs: 15, sm: 100 },
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
