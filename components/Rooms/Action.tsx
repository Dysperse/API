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
import React from "react";
import { useSession } from "../../pages/_app";
import { RoomActionMenu } from "./items//RoomActionMenu";

/**
 * Room button
 * @param {string | JSX.Element} icon - The room's icon
 * @param {string | JSX.Element} primary - The room's name
 * @param {string} href - The room's link
 * @param {Function} onClick - Callback function for the room's click event
 */

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
}: {
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
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const itemCount = count
    ? count.byRoom[primary.toLowerCase()]
      ? count.byRoom[primary.toLowerCase()]
      : -2
    : -1;
  const ref: any = React.useRef(null);
  const handleClick = React.useCallback(() => {
    if (href) router.push(href).then(() => setLoading(false));
    else {
      onClick && onClick();
    }
    setLoading(true);
  }, [href, onClick, router]);
  const session = useSession();

  return (
    <ListItemButton
      disabled={disabled}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        ref.current.click();
        navigator.vibrate(50);
      }}
      onClick={handleClick}
      onMouseDown={handleClick}
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
        ...((!isCustom &&
          router.asPath.toLowerCase().includes(primary.toLowerCase())) ||
        (isCustom &&
          router.asPath.split("rooms/")[1] &&
          decode(router.asPath.split("rooms/")[1]).includes(
            primary.toLowerCase()
          ))
          ? {
              background: session.user.darkMode
                ? "hsl(240,11%,13%)!important"
                : "hsl(240,11%,90%)!important",
            }
          : {
              background: "transparent!important",
            }),
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
              ...(itemCount == -1 && {
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
