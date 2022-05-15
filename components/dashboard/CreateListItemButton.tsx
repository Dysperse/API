import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import LoadingButton from "@mui/lab/LoadingButton";
import { AutocompleteData } from "../AutocompleteData";

export function CreateListItemButton({
  parent,
  listItems,
  setListItems
}: {
  parent: number;
  listItems: any;
  setListItems: any;
}): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    document
      .querySelector(`meta[name="theme-color"]`)!
      .setAttribute(
        "content",
        open ? "#404040" : global.theme === "dark" ? "#101010" : "#808080"
      );
  });
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const formik = useFormik({
    initialValues: {
      name: ""
    },
    onSubmit: (values: { name: string }) => {
      fetch("https://api.smartlist.tech/v2/lists/create-item/", {
        method: "POST",
        body: new URLSearchParams({
          token: global.session ? global.session.accessToken : undefined,
          parent: parent.toString(),
          title: values.name,
          description: ""
        })
      })
        .then((res) => res.json())
        .then((res) => {
          let x = listItems.data;
          x.push(res.data);
          setListItems({
            data: x,
            loading: false
          });
          setLoading(false);
          formik.resetForm();
          setOpen(false);
        })
        .catch((err: any) => alert(JSON.stringify(err)));
    }
  });

  const stopPropagationForTab = (event: any) => {
    if (event.key !== "Esc") {
      event.stopPropagation();
    }
  };

  return (
    <>
      <Button
        onClick={handleClickOpen}
        size="large"
        disableElevation
        sx={{ textTransform: "none", mr: 1, mb: 3, borderRadius: 100 }}
        variant="contained"
        autoFocus
      >
        Create item
      </Button>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onKeyDown={stopPropagationForTab}
        swipeAreaWidth={0}
        disableSwipeToOpen={true}
        ModalProps={{
          keepMounted: true
        }}
        PaperProps={{
          sx: {
            width: {
              sm: "45vw"
            },
            maxHeight: "80vh",
            borderRadius: "40px 40px 0 0",
            mx: "auto"
          }
        }}
        onClose={handleClose}
        onOpen={() => setOpen(true)}
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle sx={{ textAlign: "center" }} id="alert-dialog-title">
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ mt: 4, mb: 2 }}
            >
              Create item
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Autocomplete
                id="name"
                options={AutocompleteData}
                freeSolo
                onChange={(e, d) => formik.setFieldValue("name", d)}
                value={formik.values.name}
                renderInput={(params) => (
                  <TextField
                    autoFocus
                    {...params}
                    inputRef={(input) =>
                      setTimeout(() => input && input.focus(), 100)
                    }
                    fullWidth
                    onChange={(e) =>
                      formik.setFieldValue("name", e.target.value)
                    }
                    autoComplete="off"
                    margin="dense"
                    label="Name"
                    variant="filled"
                  />
                )}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              type="reset"
              size="large"
              disableElevation
              sx={{
                textTransform: "none",
                borderRadius: 100,
                mb: 1
              }}
              variant="outlined"
            >
              Cancel
            </Button>
            <LoadingButton
              loading={loading}
              onClick={() => setTimeout(() => setLoading(true), 100)}
              type="submit"
              size="large"
              disableElevation
              sx={{
                textTransform: "none",
                mr: 1,
                mb: 1,
                borderRadius: 100
              }}
              variant="contained"
            >
              Create
            </LoadingButton>
          </DialogActions>
        </form>
      </SwipeableDrawer>
    </>
  );
}
