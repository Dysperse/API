import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import useSWR from "swr";
import type { Item as ItemType } from "../../types/item";
import { ErrorHandler } from "../ErrorHandler";
import Item from "../ItemPopup";

/**
 * Description
 * @returns {any}
 */
export function RecentItems() {
  const url =
    "/api/property/inventory/recent?" +
    new URLSearchParams({
      property: global.property.propertyId,
      accessToken: global.property.accessToken,
    }).toString();
  const { data, error } = useSWR(url, () =>
    fetch(url).then((res) => res.json())
  );

  return error ? (
    <ErrorHandler error="An error occured while trying to fetch your items" />
  ) : data ? (
    <Box sx={{ mt: -1.5 }}>
      <Grid container sx={{ mt: 2 }} spacing={1.5}>
        {data.map((item: ItemType, key: string) => (
          <Grid item key={key.toString()} xs={12} sm={3} xl={2}>
            <Item variant="list" data={item} />
          </Grid>
        ))}
      </Grid>
      {data.length === 0 && (
        <Box sx={{ textAlign: "center", my: 2 }}>
          <picture>
            <img
              src="https://ouch-cdn2.icons8.com/Hj-wKD-6E5iYnxo_yY-janABxscaiw4DWw7PW6m3OnI/rs:fit:256:256/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvODQ0/LzAzNjE5YWJjLWQ0/ZTQtNGUyMi04ZTli/LWQ2NTliY2M2ZGE3/OC5zdmc.png"
              alt="No items"
              style={{
                filter: global.theme === "dark" ? "invert(1)" : "none",
              }}
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
    </Box>
  ) : (
    <Skeleton
      variant="rectangular"
      width={"100%"}
      height={500}
      animation="wave"
      sx={{ mb: 2, borderRadius: "28px" }}
    />
  );
}
