import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Avatar, Box } from "@mui/material";
import * as colors from "@radix-ui/colors";

export function ProfilePicture({
  data,
  size = 150,
  sx = {},
  darkMode,
  avatarComponentOnly = false,
}: {
  data: any;
  size?: number;
  sx?: any;
  darkMode?: "dark" | "light" | "system";
  avatarComponentOnly?: boolean;
}) {
  const session = useSession();

  const isDark = useDarkMode(session?.session?.darkMode || darkMode);
  const palette = useColor(data?.color || "gray", isDark);
  const hexColors = colors[(data?.color || "gray") + "Dark"];

  const avatar = (
    <Avatar
      src={
        data?.Profile?.picture ||
        "https://source.boringavatars.com/beam/120/" +
          encodeURIComponent(data.email) +
          "?colors=" +
          [
            hexColors[Object.keys(hexColors)[6]].replace("#", ""),
            hexColors[Object.keys(hexColors)[7]].replace("#", ""),
            hexColors[Object.keys(hexColors)[8]].replace("#", ""),
            hexColors[Object.keys(hexColors)[9]].replace("#", ""),
            hexColors[Object.keys(hexColors)[11]].replace("#", ""),
          ].join(",")
      }
      sx={{
        height: size,
        width: size,
        fontSize: size == 150 ? 65 : 25,
        textTransform: "uppercase",
        background: `linear-gradient(${palette[8]} 30%, ${palette[7]})`,
        mb: 2,
        ...sx,
      }}
    />
  );
  return avatarComponentOnly ? (
    avatar
  ) : (
    <Box
      sx={{
        position: "relative",
        height: size,
        width: size,
        borderRadius: 9999,
        alignSelf: { xs: "center", md: "flex-start" },
      }}
    >
      {avatar}
    </Box>
  );
}
