import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useSWR from "swr";
import Item from "../ItemPopup";

const notEcoFriendlyProducts = [
  {
    name: "washing machine",
    error:
      "This isn't an eco-friendly product! Try buying something else instead",
  },
  {
    name: "car",
    error:
      "This isn't an eco-friendly product! Try buying something else instead",
  },
  {
    name: "petrol",
    error:
      "This isn't an eco-friendly product! Try buying something else instead",
  },
  {
    name: "gas",
    error:
      "This isn't an eco-friendly product! Try buying something else instead",
  },
  {
    name: "stove",
    error:
      "This isn't an eco-friendly product! Try buying something else instead",
  },
  {
    name: "plastic straws",
    error:
      "This isn't an eco-friendly product! Try buying something else instead",
  },
  {
    name: "styrofoam cups",
    error:
      "This isn't an eco-friendly product! Try buying something else instead",
  },
  {
    name: "plastic cups",
    error:
      "This isn't an eco-friendly product! Try buying something else instead",
  },
  {
    name: "disposable water bottles",
    error:
      "This isn't an eco-friendly product! Try buying something else instead",
  },
  {
    name: "plastic water bottles",
    error:
      "This isn't an eco-friendly product! Try buying something else instead",
  },
];

function RenderSuggestions() {
  const url =
    "/api/inventory?" +
    new URLSearchParams({
      limit: "500",
      propertyToken: global.session.property.propertyToken,
      accessToken: global.session.property.accessToken,
    });
  const { error, data } = useSWR(url, () =>
    fetch(url, {
      method: "POST",
    }).then((res) => res.json())
  );
  if (error) {
    return (
      <>
        Yikes! An error occured while trying to fetch your inventory. Try
        reloading this page
      </>
    );
  }
  if (!data) {
    return (
      <>
        {[...new Array(10)].map((_: any, id: number) => (
          <Skeleton
            key={id.toString()}
            variant="rectangular"
            animation="wave"
            sx={{ mb: 2, borderRadius: 5 }}
            height={50}
          />
        ))}
      </>
    );
  }
  return (
    <>
      {data.data.filter((item: any) =>
        notEcoFriendlyProducts
          .map((e) => e.name)
          .includes(item.title.toLowerCase())
      ).length > 0 ? (
        data.data
          .filter((item) =>
            notEcoFriendlyProducts
              .map((e) => e.name)
              .includes(item.title.toLowerCase())
          )
          .map((item: any, id: number) => (
            <Box key={id.toString()}>
              <Item data={item} variant="list" />
            </Box>
          ))
      ) : (
        <div>No suggestions! Great job!</div>
      )}
    </>
  );
}

export function ItemSuggestions() {
  return (
    <div>
      <Card
        sx={{
          width: "100%",
          p: 1,
          mb: 2,
          borderRadius: 5,
          background: "rgba(200,200,200,.3)",
        }}
      >
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: "700", mb: 2 }}>
            Suggestions
          </Typography>
          <RenderSuggestions />
        </CardContent>
      </Card>
    </div>
  );
}
