import { Masonry } from "@mui/lab";
import { Box, Button, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import React from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { ErrorHandler } from "../components/Error";
import { fetchApiWithoutHook, useApi } from "../hooks/useApi";
import { toastStyles } from "../lib/useCustomTheme";
import Categories from "./items";

function DeleteCard({ item }) {
  const [hidden, setHidden] = React.useState(false);
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
          fetchApiWithoutHook("property/inventory/trash", {
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
  const { data, url, error } = useApi("property/inventory/trashed-items");

  return (
    <Categories>
      <Box sx={{ p: 5 }}>
        <Typography variant="h5">Trash</Typography>
        <Typography variant="body2">{data ? data.length : 0} items</Typography>
        <ConfirmationModal
          title="Empty Trash?"
          question="Are you sure you want to empty your trash? This action cannot be undone."
          callback={async () => {
            await fetchApiWithoutHook("property/inventory/clearTrash")
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
        <Masonry columns={3}>
          {data &&
            data.map((item: any) => <DeleteCard item={item} key={item.id} />)}
        </Masonry>
      </Box>
    </Categories>
  );
}
