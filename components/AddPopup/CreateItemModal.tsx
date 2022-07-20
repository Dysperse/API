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
import * as colors from "@mui/material/colors";
import DialogActions from "@mui/material/DialogActions";

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
    const timer = setTimeout(() => {
      open && document.getElementById("nameInput")!.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, [open]);
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
      fetch(
        "/api/inventory/create?" +
          new URLSearchParams({
            token:
              global.session &&
              (global.session.user.SyncToken || global.session.accessToken),
            room: room.toLowerCase(),
            name: values.title,
            qty: values.quantity,
            category: JSON.stringify(values.categories),
            lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          }),
        {
          method: "POST",
        }
      )
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
        disableSwipeToOpen={true}
        PaperProps={{
          elevation: 0,
          sx: {
            background: colors[themeColor][50],
            width: {
              sm: "50vw",
            },
            maxWidth: "600px",
            maxHeight: "80vh",
            borderRadius: "30px 30px 0 0",
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
        <Puller />
        <DialogTitle sx={{ mt: 2, textAlign: "center", fontWeight: "600" }}>
          Create item
          <DialogContentText sx={{ mt: 1, textAlign: "center" }}>
            {room}
          </DialogContentText>
        </DialogTitle>
        <DialogContent
          sx={{
            height: { xs: "274px", sm: "auto" },
            pb: { xs: 10, sm: 0 },
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              label="Item name"
              fullWidth
              autoComplete={"off"}
              onChange={formik.handleChange}
              value={formik.values.title}
              disabled={loading}
              name="title"
              id="nameInput"
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
                sx={{ fontSize: "20px", height: "35px", borderRadius: 2 }}
                onClick={handleChipClick}
                label="📦"
              />
              <Chip
                sx={{ fontSize: "20px", height: "35px", borderRadius: 2 }}
                onClick={handleChipClick}
                label="🥡"
              />
              <Chip
                sx={{ fontSize: "20px", height: "35px", borderRadius: 2 }}
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
                  label="Categories (optional)"
                  name="categories"
                  variant="filled"
                  {...params}
                />
              )}
            />
            <DialogActions
              sx={{
                position: { xs: "fixed", sm: "unset" },
                bottom: 0,
                left: 0,
                width: "100%",
                background: colors[themeColor][50],
                zIndex: 99,
              }}
            >
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
            </DialogActions>
          </form>
        </DialogContent>
      </SwipeableDrawer>
    </div>
  );
}
