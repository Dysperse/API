import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import * as colors from "@mui/material/colors";
import { useRouter } from "next/router";

function Action({ icon, primary, secondary, href }: any) {
  const router = useRouter();
  return (
    <ListItem
      disableRipple
      button
      onClick={() => {
        router.push(href);
      }}
      secondaryAction={
        <span
          className="material-symbols-rounded"
          style={{ marginTop: "10px" }}
        >
          chevron_right
        </span>
      }
      sx={{
        transition: "transform .2s !important",
        borderRadius: 4,
        "&:active": {
          transition: "none!important",
          transform: "scale(.97)",
          background: "rgba(200,200,200,.4)",
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
          sx={{
            color: global.theme === "dark" ? "#fff" : "#000",
            borderRadius: 4,
            background:
              global.theme === "dark"
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
        primary={<Typography sx={{ fontWeight: "400" }}>{primary}</Typography>}
        secondary={secondary}
      />
    </ListItem>
  );
}

export default function Categories() {
  return (
    <Container sx={{ mb: 3 }}>
      <Typography
        variant="h4"
        sx={{
          my: { xs: 12, sm: 4 },
          fontWeight: "800",
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        Items
      </Typography>
      <Action
        href="/rooms/kitchen"
        icon="oven_gen"
        primary="Kitchen"
        secondary="10 items"
      />
      <Action
        href="/rooms/bedroom"
        icon="bedroom_parent"
        primary="Bedroom"
        secondary="10 items"
      />
      <Action
        href="/rooms/bathroom"
        icon="bathroom"
        primary="Bathroom"
        secondary="10 items"
      />
      <Action
        href="/rooms/garage"
        icon="garage"
        primary="Garage"
        secondary="10 items"
      />
      <Action
        href="/rooms/dining"
        icon="dining"
        primary="Dining room"
        secondary="10 items"
      />
      <Action
        href="/rooms/living"
        icon="living"
        primary="Living room"
        secondary="10 items"
      />
      <Action
        href="/rooms/laundry"
        icon="local_laundry_service"
        primary="Laundry room"
        secondary="10 items"
      />
      <Action
        href="/rooms/storage"
        icon="inventory_2"
        primary="Storage room"
        secondary="10 items"
      />
      <Action
        href="/rooms/garden"
        icon="yard"
        primary="Garden"
        secondary="10 items"
      />
      <Action
        href="/rooms/camping"
        icon="image"
        primary="Camping"
        secondary="10 items"
      />
      <Divider sx={{ my: 1 }} />
      <Action
        href="/starred"
        icon="star"
        primary="Starred"
        secondary="10 items"
      />
      <Action
        href="/trash"
        icon="delete"
        primary="Trash"
        secondary="10 items"
      />
    </Container>
  );
}
