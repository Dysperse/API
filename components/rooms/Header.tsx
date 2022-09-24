import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import BoringAvatar from "boring-avatars";
import { decode } from "js-base64";
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
  useAlias?: string | null;
  room: string;
  itemCount: number;
}) {
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
    </ListItem>
  );
}
