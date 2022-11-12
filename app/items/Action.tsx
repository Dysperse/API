"use client";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import React from "react";
import { colors } from "../../lib/colors";

/**
 * Room button
 * @param {string | JSX.Element} icon - The room's icon
 * @param {string | JSX.Element} primary - The room's name
 * @param {string} href - The room's link
 * @param {Function} onClick - Callback function for the room's click event
 */
export function Action({
  count,
  icon,
  disableLoading = false,
  primary,
  href,
  onClick,
}: {
  disableLoading?: boolean;
  count?: {
    byRoom: {
      [key: string]: string | number | boolean;
    };
  };
  icon: string | JSX.Element;
  primary: string;
  href?: string;
  onClick?;
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const itemCount =
    count && count.byRoom[primary.toLowerCase()]
      ? count.byRoom[primary.toLowerCase()]
      : 0;
  return (
    <ListItem
      button
      onClick={() => {
        if (href) router.push(href);
        else {
          onClick && onClick();
        }
        setLoading(true);
      }}
      secondaryAction={
        !disableLoading && loading ? (
          <CircularProgress size={18} sx={{ ml: "auto", mt: "8px" }} />
        ) : (
          <span
            className="material-symbols-rounded"
            style={{ marginTop: "10px" }}
          >
            chevron_right
          </span>
        )
      }
      sx={{
        mb: 1,
        transition: "transform .1s !important",
        background: "transparent!important",

        borderRadius: 4,
        "&:active": {
          transform: "scale(.99)",
          background: "transparent!important",
        },
        ...(theme === "dark" && {
          "&:hover .MuiAvatar-root": {
            background: "hsl(240,11%,27%)",
          },
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar
          sx={{
            color: global.user.darkMode ? "#fff" : colors[themeColor][900],
            borderRadius: 4,
            background: global.user.darkMode
              ? "hsl(240,11%,17%)"
              : colors[themeColor][100],
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
        primary={<Typography sx={{ fontWeight: "500" }}>{primary}</Typography>}
        secondary={
          <Typography sx={{ fontWeight: "400", fontSize: "15px" }}>
            {itemCount} item{itemCount !== 1 && "s"}
          </Typography>
        }
      />
    </ListItem>
  );
}
