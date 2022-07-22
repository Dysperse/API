import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import * as colors from "@mui/material/colors";
import { useRouter } from "next/router";
import useSWR from "swr";

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
        mb: 1,
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
            color: global.theme === "dark" ? "#fff" : colors[themeColor][900],
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
        primary={<Typography sx={{ fontWeight: "500" }}>{primary}</Typography>}
        // secondary={
        //   <Typography sx={{ fontWeight: "400", fontSize: "15px" }}>
        //     {secondary}
        //   </Typography>
        // }
      />
    </ListItem>
  );
}

export default function Categories() {
  const url =
    "/api/rooms?" +
    new URLSearchParams({
      token:
        global.session &&
        (global.session.user.SyncToken || global.session.accessToken),
    });

  const { data, error } = useSWR(url, () =>
    fetch(url, {
      method: "POST",
    }).then((res) => res.json())
  );

  return (
    <Container sx={{ mb: 3 }}>
      <Typography
        variant="h4"
        sx={{
          my: { xs: 12, sm: 4 },
          fontWeight: "700",
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
        icon="camping"
        primary="Camping"
        secondary="10 items"
      />
      <Divider sx={{ my: 1 }} />
      {data &&
        data.data.map((room: any) => (
          <Action href={"/rooms/" + room.id} icon="label" primary={room.name} />
        ))}{" "}
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
