import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import useSWR from "swr";
import Item from "../ItemPopup";

export function RecentItems() {
  const url =
    "/api/inventory?" +
    new URLSearchParams({
      limit: "7",
      token:
        global.session &&
        (global.session.user.SyncToken || global.session.accessToken),
    });
  const { data, error } = useSWR(url, () =>
    fetch(url, {
      method: "POST",
    }).then((res) => res.json())
  );

  if (error) return <div>failed to load</div>;
  if (!data)
    return (
      <Skeleton
        variant="rectangular"
        width={"100%"}
        height={500}
        animation="wave"
        sx={{ borderRadius: "28px" }}
      />
    );

  return (
    <Card
      sx={{
        borderRadius: "28px",
        background: global.theme === "dark" ? "hsl(240, 11%, 13%)" : "#eee",
        boxShadow: 0,
        p: 1,
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Recent items
        </Typography>
        {data.data.map((item: Object) => (
          <Item key={Math.random().toString()} variant="list" data={item} />
        ))}
      </CardContent>
    </Card>
  );
}
