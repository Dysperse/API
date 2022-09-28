import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
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
        }}
      >
        <ListItemAvatar sx={{ mr: 2 }}>
          <IconButton
            onClick={() => {
              router.push("/items");
            }}
            size="large"
            sx={{
              background: "transparent",
              transition: "background .2s",
            }}
            className="avatar"
          >
            <span className="material-symbols-rounded">chevron_left</span>
          </IconButton>
        </ListItemAvatar>

        <ListItemText
          sx={{ my: 1.4, textAlign: "center" }}
          primary={
            <Typography
              sx={{
                fontWeight: "900",
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
                fontWeight: "500",
              }}
            >
              {itemCount} item{itemCount !== 1 && "s"}
            </Typography>
          }
        />
      </Box>
      <ListItemAvatar sx={{ ml: 2 }}>
        <IconButton
          size="large"
          sx={{
            background: "transparent",
            transition: "background .2s",
          }}
          className="avatar"
        >
          <span className="material-symbols-rounded">more_vert</span>
        </IconButton>
      </ListItemAvatar>
    </ListItem>
  );
}
