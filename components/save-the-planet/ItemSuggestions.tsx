import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import useSWR from "swr";
import Item from "../ItemPopup";

const notEcoFriendlyProducts = [
  "washing machine",
  "car",
  "petrol",
  "gas",
  "stove",
  "plastic straws",
  "styrofoam cups",
  "plastic cups",
  "disposable water bottles",
  "plastic water bottles",
];

function RenderSuggestions() {
  const url = "https://api.smartlist.tech/v2/items/list/";
  const { error, data } = useSWR(url, () =>
    fetch(url, {
      method: "POST",
      body: new URLSearchParams({
        room: "null",
        limit: "500",
        token: global.session && global.session.accessToken,
      }),
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
        {[...new Array(10)].map(() => (
          <Skeleton
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
      {data.data.filter((item) =>
        notEcoFriendlyProducts.includes(item.title.toLowerCase())
      ).length > 0 ? (
        data.data
          .filter((item) =>
            notEcoFriendlyProducts.includes(item.title.toLowerCase())
          )
          .map((item: any) => <Item data={item} variant="list" />)
      ) : (
        <>No suggestions! Great job!</>
      )}
    </>
  );
}

export function ItemSuggestions() {
  return (
    <div>
      <Typography variant="h5" sx={{ fontWeight: "700", mb: 2 }}>
        Suggestions
      </Typography>
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
          <RenderSuggestions />
        </CardContent>
      </Card>
    </div>
  );
}
