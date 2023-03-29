import {
  Avatar,
  CircularProgress,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@mui/material";
import { decode } from "js-base64";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { useSession } from "../../lib/client/useSession";
import { RoomActionMenu } from "./items//RoomActionMenu";

interface RoomActionButtonProps {
  disableLoading?: boolean;
  count?: {
    byRoom: {
      [key: string]: string | number | boolean;
    };
  };
  mutationUrl: string;
  icon: string | JSX.Element;
  primary: string;
  href?: string;
  isPrivate?: boolean;
  onClick?;
  isCustom?: boolean;
  disabled?: boolean;
}

const Action = React.memo(function Action({
  count,
  icon,
  mutationUrl,
  disableLoading = false,
  primary,
  href,
  onClick,
  isPrivate = false,
  isCustom = false,
  disabled = false,
}: RoomActionButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState<boolean>(false);
  const itemCount = count
    ? count.byRoom[primary.toLowerCase()]
      ? count.byRoom[primary.toLowerCase()]
      : -2
    : -1;
  const ref: any = React.useRef(null);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    ref.current.click();
    navigator.vibrate(50);
  }, []);

  const handleClick = useCallback(() => {
    if (href) router.push(href).then(() => setLoading(false));
    else {
      onClick && onClick();
    }
    setLoading(true);
  }, [href, onClick, router]);

  const session = useSession();
  const isActive =
    (!isCustom &&
      router.asPath.toLowerCase().includes(primary.toLowerCase())) ||
    (isCustom &&
      router.asPath.split("rooms/")[1] &&
      decode(router.asPath.split("rooms/")[1]).includes(primary.toLowerCase()));

  return (
    <ListItemButton
      disabled={disabled}
      onClick={handleClick}
      onMouseDown={handleClick}
      onContextMenu={handleContextMenu}
      sx={{
        mb: 0.2,
        "&:hover": {
          background: {
            sm: session.user.darkMode
              ? "hsl(240,11%,13%)!important"
              : "hsl(240,11%,90%)!important",
          },
        },
        cursor: "unset!important",
        "&:active": {
          background: session.user.darkMode
            ? "hsl(240,11%,13%)!important"
            : "hsl(240,11%,90%) !important",
        },
        borderRadius: 5,
        transition: "none!important",
        background: isActive
          ? `hsl(240,11%,${session.user.darkMode ? 13 : 90}%)`
          : "transparent!important",

        ...(session.user.darkMode && {
          "&:hover .MuiAvatar-root": {
            background: "hsl(240,11%,17%)",
          },
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar
          sx={{
            borderRadius: 4,
            color: session.user.darkMode ? "#fff" : "#000",
            background: session.user.darkMode
              ? "hsl(240,11%,17%)"
              : "hsl(240,11%,80%)",
          }}
        >
          <span
            style={{ fontSize: "20px" }}
            className="material-symbols-rounded"
          >
            {icon}
          </span>
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography
            sx={{
              fontWeight: "500",
              whiteSpace: "nowrap",
              overflow: "hidden",
              maxWidth: "calc(100% - 40px)",
              textOverflow: "ellipsis",
            }}
          >
            {primary}
          </Typography>
        }
        secondary={
          <Typography
            className="sm text-sm font-normal"
            sx={{
              ...((isCustom || itemCount === -3) && { display: "none" }),
              ...(itemCount === -1 && {
                filter: "blur(3px)!important",
              }),
            }}
          >
            {itemCount !== -2 ? itemCount : "No"} item{itemCount !== 1 && "s"}
          </Typography>
        }
      />
      <ListItemSecondaryAction>
        {!disableLoading && loading ? (
          <CircularProgress
            size={15}
            sx={{
              color: session.user.darkMode ? "#fff" : "#000",
              ml: "auto",
              mt: "8px",
              mr: 1,
              animationDuration: ".4s",
              transitionDuration: ".4s",
            }}
            disableShrink
          />
        ) : (
          <RoomActionMenu
            roomId={
              href
                ? decode(
                    href.replace("/rooms/", "").replace("?custom=true", "")
                  ).split(",")[0]
                : null
            }
            mutationUrl={mutationUrl}
            isCustom={isCustom}
            isPrivate={isPrivate}
            itemRef={ref}
          />
        )}
      </ListItemSecondaryAction>
    </ListItemButton>
  );
});

export default Action;
