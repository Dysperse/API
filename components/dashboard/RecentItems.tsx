import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useSWR from "swr";
import Item from "../ItemPopup";
import type { Item as ItemType } from "../../types/item";

export function RecentItems() {
  const url =
    "/api/inventory?" +
    new URLSearchParams({
      limit: "7",
      propertyToken: global.session.property.propertyToken,
      accessToken: global.session.property.accessToken,
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
        {data.data.map((item: ItemType, key: string) => (
          <Item key={key.toString()} variant="list" data={item} />
        ))}
        {data.data.length === 0 && (
          <Box sx={{ textAlign: "center", my: 2 }}>
            <picture>
              <img
                src="https://ouch-cdn2.icons8.com/Hj-wKD-6E5iYnxo_yY-janABxscaiw4DWw7PW6m3OnI/rs:fit:256:256/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvODQ0/LzAzNjE5YWJjLWQ0/ZTQtNGUyMi04ZTli/LWQ2NTliY2M2ZGE3/OC5zdmc.png"
                alt="No items"
                loading="lazy"
              />
            </picture>
            <Typography sx={{ display: "block" }} variant="h6">
              No items?!
            </Typography>
            <Typography sx={{ display: "block" }}>
              You haven&apos;t created any items yet
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
