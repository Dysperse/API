import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Icon,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useRouter } from "next/router";

export function PropertyButton({ handleClose, group }: any) {
  const session = useSession();
  const router = useRouter();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const isDark = useDarkMode(session.darkMode);

  const groupPalette = useColor(group.profile.color, isDark);

  return (
    <ListItemButton
      onClick={() => {
        handleClose && handleClose();
        setTimeout(() => router.push(`/groups/${group.propertyId}`), 500);
      }}
      {...(group.propertyId === session.property.propertyId && {
        id: "activeProperty",
      })}
      sx={{
        gap: 2,
        borderRadius: { xs: 0, sm: "10px" },
        transition: "transform .2s",
        background: "transparent!important",
        "&:active": {
          transform: { sm: "scale(0.97)" },
        },
        "& *": {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        ...(group.propertyId === session.property.propertyId && {
          background: handleClose ? palette[2] : { sm: palette[2] },
        }),
      }}
    >
      <Box
        sx={{
          width: 50,
          height: 50,
          background: `linear-gradient(45deg, ${groupPalette[8]}, ${groupPalette[11]})`,
          color: groupPalette[1],
          borderRadius: 99,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon sx={{ display: { sm: "none" } }}>
          {group.profile.type === "house"
            ? "home"
            : group.profile.type === "apartment"
            ? "apartment"
            : group.profile.type === "dorm"
            ? "cottage"
            : "school"}
        </Icon>
      </Box>
      <ListItemText
        primary={<b>{group.profile.name}</b>}
        secondary={group.profile.type}
        sx={{
          color: palette[12],
          textTransform: "capitalize",
        }}
      />
      <ListItemIcon sx={{ minWidth: "unset" }}>
        <Icon>arrow_forward_ios</Icon>
      </ListItemIcon>
    </ListItemButton>
  );
}
