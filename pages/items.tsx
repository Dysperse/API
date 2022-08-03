import Avatar from "@mui/material/Avatar";
import * as colors from "@mui/material/colors";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { encode } from "js-base64";
import { useRouter } from "next/router";
import useSWR from "swr";
import { FloatingActionButton } from "../components/Layout/FloatingActionButton";

function Action({ icon, primary, href, onClick }: any) {
  const router = useRouter();
  return (
    <ListItem
      disableRipple
      button
      onClick={() => {
        if (href) router.push(href);
        else {
          onClick && onClick();
        }
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
        (global.session.account.SyncToken ||
          global.session.property.accessToken),
    });

  const { data, error } = useSWR(url, () =>
    fetch(url, {
      method: "POST",
    }).then((res) => res.json())
  );

  return (
    <>
      <FloatingActionButton />
      <Container sx={{ mb: 3 }}>
        <Typography
          variant="h3"
          sx={{
            my: { xs: 12, sm: 4 },
            fontWeight: "400",
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          Inventory
        </Typography>
        <Action href="/rooms/kitchen" icon="oven_gen" primary="Kitchen" />
        <Action href="/rooms/bedroom" icon="bedroom_parent" primary="Bedroom" />
        <Action href="/rooms/bathroom" icon="bathroom" primary="Bathroom" />
        <Action href="/rooms/garage" icon="garage" primary="Garage" />
        <Action href="/rooms/dining" icon="dining" primary="Dining room" />
        <Action href="/rooms/living" icon="living" primary="Living room" />
        <Action
          href="/rooms/laundry"
          icon="local_laundry_service"
          primary="Laundry room"
        />
        <Action
          href="/rooms/storage"
          icon="inventory_2"
          primary="Storage room"
        />
        <Action href="/rooms/garden" icon="yard" primary="Garden" />
        <Action href="/rooms/camping" icon="camping" primary="Camping" />
        <Divider sx={{ my: 1 }} />
        {data &&
          data.data.map((room: any, id: number) => (
            <Action
              href={
                "/rooms/" + encode(room.id + "," + room.name) + "?custom=true"
              }
              icon="label"
              primary={room.name}
              key={id.toString()}
            />
          ))}
        <Action
          onClick={() =>
            document.getElementById("setCreateRoomModalOpen")!.click()
          }
          icon="add_circle"
          primary="Create room"
        />
        <Action
          onClick={() =>
            document.getElementById("houseProfileTrigger")!.click()
          }
          icon="edit"
          primary="Manage rooms"
        />
        <Divider sx={{ my: 1 }} />
        <Action href="/starred" icon="star" primary="Starred" />
        <Action href="/trash" icon="delete" primary="Trash" />
      </Container>
    </>
  );
}
