import EditIcon from "@mui/icons-material/Edit";
import Masonry from "@mui/lab/Masonry";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import { orange } from "@mui/material/colors";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { useState } from "react";
import useFetch from "react-fetch-hook";
import toast from "react-hot-toast";
import { ItemCard } from "../../components/rooms/ItemCard";
import { Toolbar } from "../../components/rooms/Toolbar";

import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItem from "@mui/material/ListItem";
import * as colors from "@mui/material/colors";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { useRouter } from "next/router";

function Header({ room, itemCount }: { room: string; itemCount: number }) {
  const router = useRouter();
  return (
    <ListItem
      disableRipple
      button
      onClick={() => {
        router.push("/items");
      }}
      sx={{
        transition: "transform .2s !important",
        borderRadius: 5,
        background: "rgba(200,200,200,.3)!important",
        mb: 2,
        py: 3,
        "&:focus": {
          background: "rgba(200,200,200,.3)",
        },
        "&:active": {
          transition: "none!important",
          transform: "scale(.97)",
          background: "rgba(200,200,200,.4)!important",
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
            display: { sm: "none" },
            background: "transparent",
          }}
        >
          <span
            style={{ fontSize: "20px" }}
            className="material-symbols-rounded"
          >
            chevron_left
          </span>
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        sx={{ ml: { sm: -6 } }}
        primary={
          <Typography sx={{ fontWeight: "700" }} gutterBottom variant="h5">
            {((room: string) => room.charAt(0).toUpperCase() + room.slice(1))(
              room
            )}
          </Typography>
        }
        secondary={
          <Typography sx={{ color: "black" }}>
            {itemCount} item{itemCount !== 1 && "s"}
          </Typography>
        }
      />
    </ListItem>
  );
}

function Suggestions({ room, items }: any) {
  const suggestions = {
    kitchen: [
      "Fridge",
      "Sink",
      "Oven",
      "Microwave",
      "Tomatoes",
      "Potatoes",
      "Salt",
      "Pepper",
      "Coffee maker",
      "Paper towel",
      "Kitchen timer",
      "Spinach",
      "Lettuce",
      "Yogurt",
      "Soap",
      "Dishwasher",
      "Dishwashing liquid",
      "Dish soap",
      "Forks",
      "Spoons",
      "Knives",
      "Ketchup",
      "Mustard",
      "Flour",
    ],
    bedroom: [
      "Nightstand",
      "Pillow",
      "Pillowcase",
      "Blanket",
      "Lamp",
      "Alarm clock",
      "Desk",
      "Wall painting",
    ],
    bathroom: [
      "Hand soap",
      "Shaver",
      "Deodorant",
      "Perfume",
      "Hair brush",
      "Mirror",
      "Bath towels",
      "Washcloths",
      "Toothbrush",
      "Toothpaste",
      "Dental flosses",
      "Shaving cream",
      "Sink",
      "Bathtub",
    ],
    garage: [
      "Car",
      "Wrench",
      "Hammer",
      "Nails",
      "Saw",
      "Electric drill",
      "Batteries",
      "Screwdrivers",
    ],
    dining: [
      "Dining table",
      "Dining chairs",
      "Platters",
      "China cabinet",
      "Table linens",
      "Silverware",
      "Cups",
    ],
    "living-room": [
      "Couch",
      "Lamp",
      "Coffee table",
      "Wall painting",
      "TV",
      "Speaker",
      "Sofa",
      "Cushion",
      "End table",
      "Remote",
      "Fan",
      "TV stand",
    ],
    "laundry-room": [
      "Washing machine",
      "Dryer",
      "Laundry basket",
      "Laundry supplies",
      "Iron",
      "Iron board",
      "Hanger",
      "Laundry sheets",
    ],
    "storage-room": ["Masks", "Face shields", "Clorox wipes", "Lysol"],
    camping: [
      "Tent",
      "Stakes (for tent)",
      "Sleeping pads",
      "Camping pillow",
      "Headlamp",
      "Flashlight",
      "Camp chairs",
      "Lantern",
      "Batteries",
      "Hammock",
      "Cots",
      "Sunshade",
      "Camp rug",
      "Matches",
      "Backpack",
      "Stove",
      "Stove fuel",
      "Cutting board",
      "Cooler",
      "Ice",
      "Water bottles",
      "Camp sink",
      "Plates",
      "Bowls",
      "Knife",
      "Mugs/Cups",
      "Camp grill",
      "Portable coffee/tea maker",
      "Marshmallows",
      "Maps",
      "Underwear",
      "Pants",
      "T-Shirts",
      "Shirts",
      "Jeans",
    ],
    garden: [
      "Gloves",
      "Shovel or Spade",
      "Weeder",
      "Garden Hoe",
      "Soil Knife",
      "Pruning Shears",
      "Garden Scissors",
      "Watering Hose",
      "Spading Fork",
      "Rake",
      "Hedge and Lawn Shears",
      "Pruning Saw",
      "Wheelbarrow",
      "Garden Glide",
      "Hand Fork",
      "Lawn Mower",
      "Hand Trowel",
      "Edger",
      "Watering Can",
      "Leaf Blower",
    ],
  };
  return (
    suggestions[room] && (
      <Card
        sx={{
          boxShadow: 0,
          borderRadius: "28px",
          p: 1,
          background:
            global.theme === "dark" ? "hsl(240, 11%, 25%)" : orange[50],
          mb: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            sx={{
              color: global.theme === "dark" ? orange[100] : orange[900],
              fontWeight: "600",
            }}
          >
            Suggestions
          </Typography>
          <div
            style={{
              overflow: "scroll",
              whiteSpace: "nowrap",
              width: "calc(100vw - 80px)",
              borderRadius: "12px",
              marginTop: "20px",
            }}
          >
            {suggestions[room] &&
              suggestions[room].map((item: string, key: number) => {
                if (items.some((e: any) => e.title === item)) return "";
                return (
                  <Chip
                    key={key}
                    onClick={() => {
                      fetch("https://api.smartlist.tech/v2/items/create/", {
                        method: "POST",
                        body: new URLSearchParams({
                          token: global.session.accessToken,
                          name: item,
                          qty: "1",
                          category: "[]",
                          room: room,
                          lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                        }),
                      })
                        .then((res) => res.json())
                        .then((res) => toast.success("Created item!"));
                    }}
                    sx={{
                      mr: 1,
                      transition: "background .05s !important",
                      borderRadius: 3,
                      boxShadow: "0!important",
                      color:
                        global.theme === "dark" ? orange[100] : orange[900],
                      background:
                        global.theme === "dark"
                          ? "hsl(240, 11%, 30%)"
                          : orange[100],
                      "&:hover": {
                        background:
                          global.theme === "dark"
                            ? "hsl(240, 11%, 35%)"
                            : orange[200],
                      },
                      "&:active": {
                        background:
                          global.theme === "dark"
                            ? "hsl(240, 11%, 40%)"
                            : orange[300],
                      },
                    }}
                    label={item}
                  />
                );
              })}
          </div>
        </CardContent>
      </Card>
    )
  );
}

function LoadingScreen() {
  return (
    <Box sx={{ p: 3 }}>
      <Skeleton
        variant="rectangular"
        animation="wave"
        width={"100%"}
        sx={{ height: 160, mb: 2, borderRadius: 5 }}
      />
      <Skeleton
        variant="rectangular"
        animation="wave"
        width={"100%"}
        sx={{ height: 120, mb: 2, borderRadius: 5 }}
      />
      <Box
        sx={{
          mr: {
            sm: -2,
          },
        }}
      >
        <Masonry columns={{ xs: 1, sm: 3 }} spacing={{ xs: 0, sm: 2 }}>
          {[...new Array(25)].map(() => {
            let height = Math.random() * 400;
            if (height < 100) height = 100;
            return (
              <Paper key={Math.random().toString()} sx={{ p: 0 }} elevation={0}>
                <Skeleton
                  variant="rectangular"
                  height={height}
                  width={"100%"}
                  animation="wave"
                  sx={{ mb: 2, borderRadius: "28px" }}
                />
              </Paper>
            );
          })}
        </Masonry>
      </Box>
    </Box>
  );
}

function ItemList({ items }: { items: any }) {
  return (
    <Box
      sx={{
        display: "flex",
        mr: {
          sm: -2,
        },
      }}
    >
      <Masonry columns={{ xs: 1, sm: 3 }} spacing={{ xs: 0, sm: 2 }}>
        {items.length === 0 ? (
          <Paper
            sx={{
              boxShadow: 0,
              p: 0,
              width: "calc(100% - 15px)!important",
              textAlign: "center",
              mb: 2,
            }}
            key={(Math.random() + Math.random()).toString()}
          >
            <Card
              sx={{
                mb: 2,
                background: "rgba(200,200,200,.3)",
                borderRadius: 5,
                p: 3,
              }}
            >
              <CardContent>
                <picture>
                  <img
                    src="https://ouch-cdn2.icons8.com/XBzKv4afS9brUYd2rl02wYqlGS8RRQ59aTS-49vo_s4/rs:fit:256:266/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvNjE2/L2FmYmNiNTMyLWY5/ZjYtNGQxZC1iZjE0/LTYzMTExZmJmZWMw/ZC5zdmc.png"
                    alt="No items..."
                    style={{ width: "300px", maxWidth: "90vw" }}
                  />
                </picture>
                <Typography
                  variant="h5"
                  sx={{
                    mt: 1,
                  }}
                >
                  No items yet...
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: "inline-flex",
                    gap: "10px",
                    alignItems: "center",
                    mt: 1,
                  }}
                >
                  Hit the <EditIcon /> icon to create an item.{" "}
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        ) : null}

        {items.map(
          (item: {
            id: number;
            lastUpdated: string;
            amount: string;
            sync: string;
            title: string;
            categories: string;
            note: string;
            star: number;
            room: string;
          }) => (
            <Paper
              sx={{
                boxShadow: 0,
                p: 0,
              }}
              key={(Math.random() + Math.random()).toString()}
            >
              <ItemCard item={item} />
            </Paper>
          )
        )}
      </Masonry>
    </Box>
  );
}

function RenderRoom({ data, index }: any) {
  const [items, setItems] = useState(data.data);
  return (
    <Container key={index} sx={{ mt: 4 }}>
      <Header room={index} itemCount={data.data.length} />
      <Suggestions room={index} items={data.data} />
      <Toolbar items={items} setItems={setItems} data={data.data} />
      <ItemList items={items} />
    </Container>
  );
}

function RoomComponent({ index }: any) {
  const { isLoading, data }: any = useFetch(
    "https://api.smartlist.tech/v2/items/list/",
    {
      method: "POST",
      body: new URLSearchParams({
        token: global.session && global.session.accessToken,
        room: index,
      }),
    }
  );

  return isLoading ? (
    <LoadingScreen key={Math.random().toString()} />
  ) : (
    <RenderRoom data={data} index={index} />
  );
}

function Room() {
  const index = window.location.pathname.split("/rooms/")[1];

  return <RoomComponent index={index} key={index} />;
}

export default Room;
