import LoadingButton from "@mui/lab/LoadingButton";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { useFormik } from "formik";
import React from "react";
import toast from "react-hot-toast";
import { AutocompleteData } from "../AutocompleteData";
import { Puller } from "../Puller";
import { neutralizeBack, revivalBack } from "../history-control";

export function CreateItemModal({
  toggleDrawer,
  room,
  children,
}: {
  toggleDrawer: Function;
  room: string;
  children: any;
}) {
  const [open, setOpen] = React.useState<boolean>(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  React.useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });

  const [loading, setLoading] = React.useState<boolean>(false);

  function setClickLoading() {
    setLoading(true);
  }

  const formik = useFormik({
    initialValues: {
      categories: [],
      title: "",
      quantity: "",
    },
    onSubmit: async (values: {
      categories: Array<string>;
      title: string;
      quantity: string;
    }) => {
      // alert(JSON.stringify(values));
      fetch("https://api.smartlist.tech/v2/items/create/", {
        method: "POST",
        body: new URLSearchParams({
          token:
            global.session &&
            (global.session.user.SyncToken || global.session.accessToken),
          room: room.toLowerCase(),
          name: values.title,
          qty: values.quantity,
          category: JSON.stringify(values.categories),
          lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          toast("Created item!");
          setLoading(false);
          setOpen(false);
          formik.resetForm();
        });
    },
  });

  const handleChipClick = (e) => {
    formik.setFieldValue(
      "quantity",
      formik.values.quantity + " " + e.target.innerText
    );
  };
  return (
    <div>
      <div onClick={handleClickOpen}>{children}</div>
      <SwipeableDrawer
        anchor="bottom"
        swipeAreaWidth={0}
        ModalProps={{
          keepMounted: true,
        }}
        disableSwipeToOpen={true}
        PaperProps={{
          sx: {
            width: {
              sm: "50vw",
            },
            maxWidth: "600px",
            maxHeight: "80vh",
            borderRadius: "40px 40px 0 0",
            mx: "auto",
            ...(global.theme === "dark" && {
              background: "hsl(240, 11%, 25%)",
            }),
          },
        }}
        open={open}
        onClose={handleClose}
        onOpen={() => setOpen(true)}
      >
        <Box sx={{ pt: 1 }}>
          <Puller />
        </Box>
        <DialogTitle sx={{ mt: 2, textAlign: "center", fontWeight: "600" }}>
          Create item
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2, textAlign: "center" }}>
            {room}
          </DialogContentText>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              autoComplete={"off"}
              onChange={formik.handleChange}
              value={formik.values.title}
              disabled={loading}
              name="title"
              variant="filled"
            />
            <TextField
              margin="dense"
              label="Quantity"
              autoComplete={"off"}
              fullWidth
              onChange={formik.handleChange}
              value={formik.values.quantity}
              disabled={loading}
              name="quantity"
              variant="filled"
            />
            <Stack spacing={1} direction="row" sx={{ my: 1 }}>
              <Chip
                sx={{ fontSize: "25px", height: "35px", borderRadius: 2 }}
                onClick={handleChipClick}
                label="📦"
              />
              <Chip
                sx={{ fontSize: "25px", height: "35px", borderRadius: 2 }}
                onClick={handleChipClick}
                label="🥡"
              />
              <Chip
                sx={{ fontSize: "25px", height: "35px", borderRadius: 2 }}
                onClick={handleChipClick}
                label="🛍️"
              />
            </Stack>
            <Autocomplete
              id="categories"
              multiple
              freeSolo
              disabled={loading}
              options={AutocompleteData}
              onChange={(e, newValue) =>
                formik.setFieldValue("categories", newValue)
              }
              value={formik.values.categories}
              renderInput={(params) => (
                <TextField
                  margin="dense"
                  sx={{ width: "100%" }}
                  label="Categories"
                  name="categories"
                  variant="filled"
                  {...params}
                />
              )}
            />
            <LoadingButton
              disableElevation
              sx={{
                ml: 1,
                mt: 2,
                float: "right",
                borderRadius: 100,
              }}
              size="large"
              variant="contained"
              color="primary"
              type="submit"
              loading={loading}
              onClick={() => setTimeout(setClickLoading, 10)}
            >
              Create
            </LoadingButton>
            <Button
              disableElevation
              sx={{
                ml: 1,
                mt: 2,
                float: "right",
                borderRadius: 100,
              }}
              size="large"
              variant="outlined"
              color="primary"
              type="button"
              onClick={() => {
                setLoading(false);
                setOpen(false);
              }}
            >
              Back
            </Button>
          </form>
        </DialogContent>
      </SwipeableDrawer>
    </div>
  );
}
