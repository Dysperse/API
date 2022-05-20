import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import useSWR from "swr";

function RenderSuggestions() {
  const url = "https://api.smartlist.tech/v2/items/list/";
  const { error, data } = useSWR(url, () =>
    fetch(url, {
      method: "POST",
      body: new URLSearchParams({
        token: global.session.accessToken,
        limit: "500",
        room: "null"
      })
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
  return <>{JSON.stringify(data)}</>;
}

export function ItemSuggestions() {
  return (
    <div>
      <Typography variant="h5" sx={{ fontWeight: "800", mb: 2 }}>
        Suggestions
      </Typography>
      <Card
        sx={{
          width: "100%",
          p: 1,
          mb: 2,
          borderRadius: 5,
          background: "rgba(200,200,200,.3)"
        }}
      >
        <CardContent>
          <RenderSuggestions />
        </CardContent>
      </Card>
    </div>
  );
}
