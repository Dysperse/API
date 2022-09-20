import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { useApi } from "../../hooks/useApi";
import type { ApiResponse } from "../../types/client";
import type { Item as ItemType } from "../../types/item";
import { ErrorHandler } from "../ErrorHandler";
import Item from "../ItemPopup";

/**
 * Recent items
 * @returns {JSX.Element}
 */
export function RecentItems(): JSX.Element {
  const { error, loading, data }: ApiResponse = useApi(
    "property/inventory/recent"
  );

  return error ? (
    <ErrorHandler error="An error occured while trying to fetch your items" />
  ) : loading ? (
    <Skeleton
      variant="rectangular"
      width={"100%"}
      height={500}
      animation="wave"
      sx={{ mb: 2, borderRadius: "28px" }}
    />
  ) : (
    <Box sx={{ mt: -1.5 }}>
      <Grid container sx={{ mt: 2 }} spacing={1.5}>
        {data.map((item: ItemType) => (
          <Grid item key={item.id.toString()} xs={12} sm={3} xl={2}>
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
  );
}
