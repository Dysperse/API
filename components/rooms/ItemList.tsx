import Masonry from "@mui/lab/Masonry";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { ItemCard } from "./ItemCard";

export function ItemList({ items }: { items: any }) {
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
            <div key={key.toString()}>
              <ItemCard item={item} />
            </div>
          )
        )}
      </Masonry>
    </Box>
  );
}
