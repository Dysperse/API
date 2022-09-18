import LoadingButton from "@mui/lab/LoadingButton";
import Masonry from "@mui/lab/Masonry";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { ItemCard } from "../components/rooms/ItemCard";
import type { Item } from "../types/item";

/**
 * Delete card component, including delete and restore buttons
 * @param {Object} item - Item data
 */
function DeleteCard({ item }: any) {
  const [deleted, setDeleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    !deleted && (
      <Card
        sx={{
          background:
            global.theme === "dark"
              ? "hsl(240, 11%, 25%)"
              : "rgba(200,200,200,.3)",
          borderRadius: "28px",
        }}
      >
        <CardContent>
          <ItemCard item={item} displayRoom />
          <LoadingButton
            loading={loading}
            sx={{
              float: "right",
              boxShadow: 0,
              m: 0.5,
              mb: 2,
              borderRadius: 9,
            }}
            variant="contained"
            disabled={global.property.role === "read-only"}
            onClick={() => {
              fetch(
                "/api/inventory/trash?" +
                  new URLSearchParams({
                    property: global.property.propertyId,
                    accessToken: global.property.accessToken,
                    id: item.id.toString(),
                    forever: "true",
                  }).toString(),
                {
                  method: "POST",
                }
              )
                .then(() => {
                  setDeleted(true);
                  setLoading(false);
                  toast.success("Item deleted forever");
                })
                .catch(() => {
                  toast.error(
                    "An error occured while trying to delete this item. Please try again"
                  );
                  setLoading(false);
                });
              setLoading(true);
            }}
          >
            Delete
          </LoadingButton>
          <Button
            sx={{
              float: "right",
              boxShadow: 0,
              m: 0.5,
              mb: 2,
              borderRadius: 9,
            }}
            variant="outlined"
            disabled={global.property.role === "read-only"}
            onClick={() => {
              fetch(
                "/api/restore?" +
                  new URLSearchParams({
                    property: global.property.propertyId,
                    accessToken: global.property.accessToken,
                    lastUpdated: dayjs(item.lastUpdated).format(
                      "YYYY-MM-DD HH:mm:ss"
                    ),
                    id: item.id.toString(),
                  }).toString(),
                {
                  method: "POST",
                }
              )
                .then(() => {
                  setDeleted(true);
                  setLoading(false);
                  toast.success("Item restored");
                })
                .catch(() => {
                  toast.error(
                    "An error occured while trying to restore this item. Please try again"
                  );
                  setLoading(false);
                });
              setLoading(true);
            }}
          >
            Restore
          </Button>
        </CardContent>
      </Card>
    )
  );
}

/**
 * Description
 * @returns {any}
 */
function Items() {
  const url =
    "/api/inventory/trashed-items?" +
    new URLSearchParams({
      property: global.property.propertyId,
      accessToken: global.property.accessToken,
    }).toString();
  const { data, error }: any = useSWR(url, () =>
    fetch(url, {
      method: "POST",
    }).then((res) => res.json())
  );

  if (error) {
    return (
      <>
        Yikes! An error occured while loading your trash. Try reloading this
        page
      </>
    );
  }
  return !data ? (
    <>
      {[...new Array(15)].map(() => {
        let height = Math.random() * 400;
        if (height < 100) height = 100;
        return (
          <Paper key={Math.random().toString()} sx={{ p: 0 }} elevation={0}>
            <Skeleton
              variant="rectangular"
              height={height}
              animation="wave"
              sx={{ mb: 1, borderRadius: "28px" }}
            />
          </Paper>
        );
      })}
    </>
  ) : (
    <>
      {data.data.map((item: Item) => (
        <DeleteCard item={item} key={item.id.toString()} />
      ))}
      {data.data.length === 0 && (
        <Box
          sx={{
            width: "100%",
            background: "rgba(200,200,200,.3)",
            borderRadius: 4,
          }}
        >
          You haven&apos;t deleted any items yet
        </Box>
      )}
    </>
  );
}

/**
 * Top level component for the trash page
 * @returns {any}
 */
export default function Render() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{
          my: { xs: 12, sm: 4 },
          fontWeight: "700",
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        Trash
      </Typography>
      <Masonry columns={{ xs: 1, sm: 3 }} spacing={{ xs: 0, sm: 2 }}>
        <Items />
      </Masonry>
    </Box>
  );
}
