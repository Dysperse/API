import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { orange } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import { SuggestionChip } from "./SuggestionChip";

export function Suggestions({ room, items }: any) {
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
