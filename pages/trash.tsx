import { LoadingButton, Masonry } from "@mui/lab";
import { Box, Button, Dialog, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import React from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { ErrorHandler } from "../components/Error";
import { fetchApiWithoutHook, useApi } from "../hooks/useApi";
import Categories from "./items";

function DeleteCard({ item }) {
  const [hidden, setHidden] = React.useState(false);
  return hidden ? (
    <></>
  ) : (
    <Box
      key={item.id}
      sx={{
        p: 2,
        borderRadius: 5,
        background: "rgba(200,200,200,.3)",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: "700" }}>
        {item.name}
      </Typography>
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
          }).catch((err) => {
            toast.error(
              "An error occured while trying to delete this item. Please try again later"
            );
            setHidden(false);
          });
        }}
        sx={{
          background: red["900"] + "!important",
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
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  return (
    <Categories>
      <Box sx={{ p: 5 }}>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: "700" }}>
          Trash
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: "700" }}>
          {data ? data.length : 0} items
        </Typography>
        <Button
          onClick={() => setOpen(true)}
          variant="contained"
          disabled={!data || (data || []).length === 0}
          sx={{
            background: red["900"] + "!important",
            borderRadius: 99,
            mt: 1,
            mb: 3,
          }}
        >
          Empty Trash
        </Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 5,
            },
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: "700" }}>
              Empty Trash
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
              Are you sure you want to empty your trash? This action cannot be
              undone.
            </Typography>
            <LoadingButton
              loading={loading}
              onClick={() => {
                setLoading(true);
                fetchApiWithoutHook("property/inventory/clearTrash")
                  .catch(() => {
                    toast.error(
                      "An error occured while trying to empty your trash. Please try again later"
                    );
                  })
                  .then(() => {
                    mutate(url).then(() => {
                      setLoading(false);
                    });
                  });
              }}
              fullWidth
              variant="contained"
              sx={{
                background: red["900"] + "!important",
                borderRadius: 99,
                mt: 1,
              }}
            >
              Empty Trash
            </LoadingButton>
          </Box>
        </Dialog>
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
