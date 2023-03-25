import { Masonry } from "@mui/lab";
import { Box, Button, CircularProgress, Icon, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { ErrorHandler } from "../components/Error";
import { fetchRawApi, useApi } from "../lib/client/useApi";
import { toastStyles } from "../lib/client/useTheme";
import Categories from "./items";

function DeleteCard({ item }) {
  const [hidden, setHidden] = useState<boolean>(false);

  return hidden ? null : (
    <Box
      key={item.id}
      sx={{
        p: 2,
        borderRadius: 5,
        background: "rgba(200,200,200,.3)",
      }}
    >
      <Typography variant="h6">{item.name}</Typography>
      <Typography variant="body2">
        {item.quantity || "(no quantity specified)"}
      </Typography>
      <Button
        color="warning"
        fullWidth
        variant="outlined"
        sx={{
          borderRadius: 99,
          mt: 2,
        }}
      >
        Restore
      </Button>
      <Button
        color="error"
        fullWidth
        variant="contained"
        onClick={() => {
          setHidden(true);
          fetchRawApi("property/inventory/trash/item", {
            id: item.id,
            forever: true,
          }).catch(() => {
            toast.error(
              "An error occured while trying to delete this item. Please try again later",
              toastStyles
            );
            setHidden(false);
          });
        }}
        sx={{
          background: `${red["900"]}!important`,
          borderRadius: 99,
          mt: 1,
        }}
      >
        Delete
      </Button>
    </Box>
  );
}

export default function Trash() {
  const { data, url, error } = useApi("property/inventory/trash");
  const router = useRouter();

  return (
    <Categories>
      <Box sx={{ p: 5 }}>
        <Button
          onClick={() => router.push("/items")}
          size="small"
          variant="contained"
          sx={{ display: { sm: "none" }, mb: 2 }}
        >
          <Icon>west</Icon>
          Back to items
        </Button>
        <Typography variant="h5">Trash</Typography>
        <Typography variant="body2">{data ? data.length : 0} items</Typography>
        <ConfirmationModal
          title="Empty Trash?"
          question="Are you sure you want to empty your trash? This action cannot be undone."
          callback={async () => {
            await fetchRawApi("property/inventory/trash/clear")
              .catch(() => {
                toast.error(
                  "An error occured while trying to empty your trash. Please try again later",
                  toastStyles
                );
              })
              .then(() => {
                mutate(url);
              });
          }}
        >
          <Button
            variant="contained"
            disabled={!data || (data || []).length === 0}
            sx={{
              background: `${red["900"]}!important`,
              color: `${red["50"]}!important`,
              borderRadius: 99,
              mt: 1,
              mb: 3,
            }}
          >
            Empty Trash
          </Button>
        </ConfirmationModal>
        {error && (
          <ErrorHandler
            error={
              "Yikes! An error occured while trying to fetch your trash. Please try again later"
            }
          />
        )}
        {data ? (
          <Masonry columns={3}>
            {data.map((item: any) => (
              <DeleteCard item={item} key={item.id} />
            ))}
          </Masonry>
        ) : (
          <CircularProgress />
        )}
      </Box>
    </Categories>
  );
}
