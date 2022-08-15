import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { decode } from "js-base64";
import { useRouter } from "next/router";

export function Header({
  useAlias,
  room,
  itemCount,
}: {
  useAlias: any;
  room: string;
  itemCount: number;
}) {
  const router = useRouter();
  return (
    <ListItem
      sx={{
        transition: "transform .2s !important",
        borderRadius: 5,
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
      <ListItemAvatar>
        <Avatar
          className="avatar"
          onClick={() => {
            router.push("/items");
          }}
          sx={{
            cursor: "pointer",
            color: global.theme === "dark" ? "#fff" : "#000",
            borderRadius: 4,
            background: "transparent!important",
            display: { sm: "none" },
            "&:hover": {
              background:
                theme === "dark"
                  ? "hsl(240,11%,30%)"
                  : "rgba(200,200,200,.3)!important",
            },
            "&:active": {
              transition: "none!important",
              background:
                theme === "dark"
                  ? "hsl(240,11%,30%)"
                  : "rgba(200,200,200,.4)!important",
            },
          }}
        >
          <span
            style={{ fontSize: "20px" }}
            className="material-symbols-rounded"
          >
            arrow_back_ios_new
          </span>
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        sx={{ ml: { sm: -5 }, my: 2 }}
        primary={
          <Typography
            sx={{
              fontWeight: "400",
              fontSize: {
                xs: "25px",
                sm: "35px",
              },
              ml: { xs: -0.2, sm: -0.5 },
            }}
            gutterBottom
            variant="h4"
          >
            {((room: string) => room.charAt(0).toUpperCase() + room.slice(1))(
              useAlias ? decode(room).split(",")[1] : room
            )}
          </Typography>
        }
        secondary={
          <Typography
            sx={{
              color: theme === "dark" ? "white" : "black",
              fontWeight: "600",
            }}
          >
            {itemCount} out of 150 item limit
          </Typography>
        }
      />
    </ListItem>
  );
}
