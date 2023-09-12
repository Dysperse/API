import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
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

export function PropertyButton({
  defaultPalette,
  handleClose,
  group,
  list,
  onSuccess,
}: any) {
  const session = useSession();
  const router = useRouter();
  const palette = useColor(
    defaultPalette || session.themeColor,
    useDarkMode(session.darkMode)
  );
  const isDark = useDarkMode(session.darkMode);

  const groupPalette = useColor(group.profile.color, isDark);

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <ListItemButton
      onClick={async () => {
        if (!list) {
          try {
            setLoading(true);
            handleClose();
            const res = await fetchRawApi(session, "property/switch", {
              email: session.user.email,
              accessToken1: group.accessToken,
            });
            await mutate("/api/session");
            toast.success(
              <span>
                Switched to &nbsp;<u>{res.profile.name}</u>
              </span>
            );
            onSuccess();
          } catch {
            toast.error(
              "Yikes! Something went wrong when trying to switch groups"
            );
          }
          setLoading(false);
          return;
        }
        handleClose && handleClose();
        setTimeout(() => router.push(`/spaces/${group.propertyId}`), 500);
      }}
      {...(group.propertyId === session.property.propertyId && {
        id: "activeProperty",
      })}
      sx={{
        gap: 2,
        borderRadius: 99,
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
        "&:hover": {
          background: { sm: palette[2] + "!important" },
        },
        ...(group.propertyId === session.property.propertyId && {
          background: handleClose ? palette[2] : { sm: palette[2] },
          "&:hover": {
            background: { sm: palette[3] + "!important" },
          },
        }),
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          background: `linear-gradient(45deg, ${groupPalette[8]}, ${groupPalette[11]})`,
          color: groupPalette[1],
          borderRadius: 99,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon>
          {group.profile.type === "home"
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
        secondary={capitalizeFirstLetter(group.profile.type)}
        sx={{ color: palette[12] }}
      />
      <ListItemIcon sx={{ minWidth: "unset" }}>
        {loading ? <CircularProgress /> : <Icon>arrow_forward_ios</Icon>}
      </ListItemIcon>
    </ListItemButton>
  );
}
