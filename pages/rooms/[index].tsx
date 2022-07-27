import Masonry from "@mui/lab/Masonry";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import { orange } from "@mui/material/colors";
import Container from "@mui/material/Container";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { decode } from "js-base64";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import useFetch from "react-fetch-hook";
import toast from "react-hot-toast";
import { ItemCard } from "../../components/rooms/ItemCard";
import { Toolbar } from "../../components/rooms/Toolbar";

function Header({
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
            ? "hsl(240,11%,25%)!important"
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

function SuggestionChip({ room, item, key }: any) {
  const [hide, setHide] = useState<boolean>(false);
  return (
    <>
      {!hide && (
        <Chip
          key={key}
          onClick={() => {
            setHide(true);
            fetch(
              "/api/inventory/create?" +
                new URLSearchParams({
                  token:
                    global.session.user.SyncToken || global.session.accessToken,
                  name: item,
                  qty: "1",
                  category: "[]",
                  room: room,
                  lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                }),
              {
                method: "POST",
              }
            )
              .then((res) => res.json())
              .then((res) => {
                toast.success("Created item!");
                global.setUpdateBanner(room);
              });
          }}
          sx={{
            mr: 1,
            px: 1,
            fontWeight: "600",
            transition: "background .05s !important",
            borderRadius: 3,
            boxShadow: "0!important",
            color: global.theme === "dark" ? orange[100] : orange[900],
            background:
              global.theme === "dark" ? "hsl(240, 11%, 30%)" : orange[100],
            "&:hover": {
              background:
                global.theme === "dark" ? "hsl(240, 11%, 35%)" : orange[200],
            },
            "&:active": {
              background:
                global.theme === "dark" ? "hsl(240, 11%, 40%)" : orange[300],
            },
          }}
          label={item}
        />
      )}
    </>
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
              my: 1,
              mb: 2,
              color: global.theme === "dark" ? orange[100] : orange[900],
              fontWeight: "400",
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
              marginTop: "10px",
            }}
          >
            {suggestions[room] &&
              suggestions[room].map((item: string, key: number) => {
                if (items.some((e: any) => e.title === item)) return "";
                return (
                  <SuggestionChip
                    room={room}
                    item={item}
                    key={key.toString()}
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
    <Container sx={{ mt: 4 }}>
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
          {[...new Array(25)].map((_, id) => {
            let height = Math.random() * 400;
            if (height < 100) height = 100;
            return (
              <Paper key={id.toString()} sx={{ p: 0 }} elevation={0}>
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
    </Container>
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
            key={"_noItems"}
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
                    alt="No items found"
                    src="https://ouch-cdn2.icons8.com/XBzKv4afS9brUYd2rl02wYqlGS8RRQ59aTS-49vo_s4/rs:fit:256:266/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvNjE2/L2FmYmNiNTMyLWY5/ZjYtNGQxZC1iZjE0/LTYzMTExZmJmZWMw/ZC5zdmc.png"
                    style={{ width: "300px", maxWidth: "100%" }}
                  />
                </picture>
                <Typography
                  variant="h5"
                  sx={{
                    mt: 1,
                  }}
                >
                  No items found
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
                  Try clearing any filters. Hit the{" "}
                  <span className="material-symbols-outlined">add_circle</span>
                  button to create an item.{" "}
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        ) : null}

        {items.map(
          (
            item: {
              id: number;
              lastUpdated: string;
              amount: string;
              sync: string;
              title: string;
              categories: string;
              note: string;
              star: number;
              room: string;
            },
            key: number
          ) => (
            <div>
              <ItemCard item={item} key={key.toString()} />
            </div>
          )
        )}
      </Masonry>
    </Box>
  );
}

function RenderRoom({ data, index }: any) {
  const router = useRouter();
  const [items, setItems] = useState(data.data);
  const [updateBanner, setUpdateBanner] = useState(false);
  global.setUpdateBanner = setUpdateBanner;

  return (
    <Container key={index} sx={{ mt: 4 }}>
      <Header
        room={index}
        itemCount={data.data.length}
        useAlias={router.query.custom}
      />
      <Suggestions
        room={router.query.custom ? decode(index).split(",")[0] : index}
        items={data.data}
      />
      <Toolbar
        room={router.query.custom ? decode(index).split(",")[0] : index}
        alias={router.query.custom ? decode(index).split(",")[1] : index}
        items={items}
        setItems={setItems}
        data={data.data}
      />
      {updateBanner ===
        (router.query.custom ? decode(index).split(",")[0] : index) && (
        <Box
          sx={{
            background: "rgba(200,200,200,.4)",
            borderRadius: 5,
            p: 3,
            mb: 3,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography>New items have been added to this room.</Typography>
          <Button
            sx={{ ml: "auto", borderWidth: "2px!important", borderRadius: 4 }}
            variant="outlined"
            onClick={() => {
              setUpdateBanner(false);
              fetch(
                "/api/inventory?" +
                  new URLSearchParams({
                    token:
                      global.session &&
                      (global.session.user.SyncToken ||
                        global.session.accessToken),
                    room: router.query.custom
                      ? decode(index).split(",")[0]
                      : index,
                  }),
                {
                  method: "POST",
                }
              )
                .then((res) => res.json())
                .then((res) => {
                  setItems([]);
                  setTimeout(() => {
                    setItems(res.data);
                  }, 10);
                });
            }}
          >
            &nbsp;&nbsp;&nbsp;&nbsp;Show&nbsp;changes&nbsp;&nbsp;&nbsp;&nbsp;
          </Button>
        </Box>
      )}
      <ItemList items={items} />
    </Container>
  );
}

function RoomComponent({ index }: any) {
  const router = useRouter();
  const { isLoading, data }: any = useFetch(
    "/api/inventory?" +
      new URLSearchParams({
        token:
          global.session &&
          (global.session.user.SyncToken || global.session.accessToken),
        room: router.query.custom ? decode(index).split(",")[0] : index,
      }),
    {
      method: "POST",
    }
  );

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <RenderRoom data={data} index={index} />
  );
}

function Room() {
  const index = window.location.pathname.split("/rooms/")[1];
  const router = useRouter();

  return (
    <>
      <Head>
        <title>
          {(router.query.custom ? decode(index).split(",")[1] : index).replace(
            /./,
            (c) => c.toUpperCase()
          )}{" "}
          &bull;{" "}
          {global.session.user.houseName.replace(/./, (c) => c.toUpperCase())}{" "}
          &bull; Carbon
        </title>
      </Head>
      <RoomComponent index={index} key={index} />
    </>
  );
}

export default Room;
