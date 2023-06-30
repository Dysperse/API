import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import {
  Box,
  CircularProgress,
  Icon,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { mutate } from "swr";

export function PropertyButton({ handleClose, group, list }: any) {
  const session = useSession();
  const router = useRouter();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const isDark = useDarkMode(session.darkMode);

  const groupPalette = useColor(group.profile.color, isDark);

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <ListItemButton
      onClick={async () => {
        if (!list) {
          try {
            setLoading(true);
            const res = await fetchRawApi(session, "property/switch", {
              email: session.user.email,
              accessToken1: group.accessToken,
            });
            await mutate("/api/session");
            toast.success(
              <span>
                Switched to &nbsp;<u>{res.profile.name}</u>
              </span>,
              toastStyles
            );
          } catch {
            toast.error(
              "Yikes! Something went wrong when trying to switch groups",
              toastStyles
            );
          }
          setLoading(false);
          return;
        }
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
        {loading ? <CircularProgress /> : <Icon>arrow_forward_ios</Icon>}
      </ListItemIcon>
    </ListItemButton>
  );
}
