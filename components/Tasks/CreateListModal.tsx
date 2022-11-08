import LoadingButton from "@mui/lab/LoadingButton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import * as React from "react";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import { colors } from "../../lib/colors";
import { Puller } from "../Puller";

export function CreateListModal({
  mutateUrl,
  setValue,
  open,
  setOpen,
  listData,
  setListData,
}) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchApiWithoutHook("property/lists/createList", {
      name,
      description,
    }).then((res) => {
      setListData([
        ...listData,
        {
          ...res,
          items: [],
        },
      ]);
      setValue(res.id);
    });
    setOpen(false);
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      disableSwipeToOpen
      PaperProps={{
        elevation: 0,
        sx: {
          mx: "auto",
          maxWidth: "500px",
          background: colors[themeColor][50],
          borderRadius: "20px 20px 0 0",
        },
      }}
    >
      <Puller />
      <Box
        sx={{
          p: 3,
          pt: 0,
        }}
      >
        <form onSubmit={handleSubmit}>
          <TextField
            variant="filled"
            autoComplete="off"
            fullWidth
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              mt: 2,
            }}
            label="List name..."
            placeholder="My wishlist"
          />
          {/* <TextField
                variant="filled"
                autoComplete="off"
                fullWidth
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{
                  mt: 2,
                }}
                label="Add a description..."
                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              /> */}
          <LoadingButton
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, borderRadius: 999 }}
            size="large"
            disableElevation
          >
            Create
          </LoadingButton>
        </form>
      </Box>
    </SwipeableDrawer>
  );
}
