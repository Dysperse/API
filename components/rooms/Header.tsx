import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { decode } from "js-base64";
import { colors } from "../../lib/colors";
import { useRouter } from "next/router";
import { useState } from "react";
import BoringAvatar from "boring-avatars";
/**
 * Header component for the room
 * @param useAlias
 * @param room
 * @param itemCount
 */
export function Header({
  useAlias,
  room,
  itemCount,
}: {
  useAlias: any;
  room: string;
  itemCount: number;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <ListItem
      sx={{
        transition: "transform .2s !important",
        borderRadius: 5,
        overflow: "hidden",
        background:
          theme === "dark"
            ? "hsl(240,11%,18%)!important"
            : "rgba(200,200,200,.3)!important",
        mb: 2,
        py: 3,
        "&:focus": {
          background:
            theme === "dark" ? "hsl(240,11%,27%)" : "rgba(200,200,200,.3)",
        },

        ...(theme === "dark" && {
          "&:hover .avatar": {
            background: "hsl(240,11%,27%)",
          },
        }),
      }}
    >
      <Box
        sx={{
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          width: "100%",
          color: "#fff",
        }}
      >
        <ListItemText
          sx={{ my: 2, textAlign: "center" }}
          primary={
            <Typography
              sx={{
                fontWeight: "400",
                fontSize: {
                  xs: "25px",
                  md: "35px",
                },
              }}
              gutterBottom
              variant="h4"
            >
              {((room: string) => room.charAt(0).toUpperCase() + room.slice(1))(
                useAlias
                  ? decode(room).split(",")[1]
                  : room.replaceAll("-", " ")
              )}
            </Typography>
          }
          secondary={
            <Typography
              sx={{
                color: "inherit",
                fontWeight: "600",
              }}
            >
              {itemCount} item{itemCount !== 1 && "s"}
            </Typography>
          }
        />
      </Box>
      <Box
        sx={{
          "& *": {
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            display: "inline-block",
          },
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,.1)",
            zIndex: 1,
          }}
        />
        <BoringAvatar
          colors={["#741952", "#FE3174", "#F1C15D", "#94BB68", "#09A3AD"]}
          square
          size={"100vw"}
          name={room.toString()}
          variant="marble"
        />
      </Box>
    </ListItem>
  );
}
