import {
  Box,
  Icon,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { decode } from "js-base64";
import { useRouter } from "next/router";
import { useSession } from "../../lib/client/useSession";
import { CreateItemModal } from "./CreateItem/modal";
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
  const session = useSession();

  return (
    <ListItem
      sx={{
        transition: "transform .2s !important",
        overflow: "hidden",
        background: session.user.darkMode
          ? "hsl(240,11%,15%, 0.6)!important"
          : "hsla(240,11%,96%, 0.6)!important",
        position: "sticky",
        top: "0px",
        mb: 2,
        zIndex: 99,
        backdropFilter: "blur(10px)",
        py: 3,
        "&:focus": {
          background: session.user.darkMode
            ? "hsl(240,11%,27%)"
            : "hsla(240,11%,97%, 0.8)",
        },
      }}
    >
      <Box
        sx={{
          zIndex: 9,
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <ListItemAvatar sx={{ mr: { xs: 0, sm: -3 } }}>
          <IconButton
            onClick={() => router.push("/items")}
            sx={{
              display: { sm: "none" },
              background: "transparent",
            }}
            className="avatar"
          >
            <Icon>west</Icon>
          </IconButton>
        </ListItemAvatar>

        <ListItemText
          sx={{ my: 1.4, textAlign: { xs: "center", sm: "left" } }}
          primary={
            <Typography
              className="font-heading"
              sx={{
                textDecoration: "underline",
                fontSize: {
                  xs: "35px",
                  md: "45px",
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
                mt: -0.5,
              }}
            >
              {itemCount} item{itemCount !== 1 && "s"}
            </Typography>
          }
        />
      </Box>
      <ListItemAvatar>
        <CreateItemModal room={useAlias ? decode(room).split(",")[0] : room}>
          <IconButton
            sx={{
              background: "transparent",
            }}
          >
            <Icon className="outlined">add_circle</Icon>
          </IconButton>
        </CreateItemModal>
      </ListItemAvatar>
    </ListItem>
  );
}
