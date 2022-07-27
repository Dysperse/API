import LoadingButton from "@mui/lab/LoadingButton";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import * as colors from "@mui/material/colors";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { AutocompleteData } from "../../AutocompleteData";
import { Puller } from "../../Puller";

export function CreateListItemButton({
  parent,
  listItems,
  setListItems,
}: {
  parent: number;
  listItems: any;
  setListItems: any;
}): JSX.Element {
  const [open, setOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  useEffect(() => {
    document
      .querySelector(`meta[name="theme-color"]`)!
      .setAttribute(
        "content",
        open
          ? "#404040"
          : global.theme === "dark"
          ? "hsl(240, 11%, 5%)"
          : "#cccccc"
      );
  });
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: (values: { name: string }) => {
      fetch("https://api.smartlist.tech/v2/lists/create-item/", {
        method: "POST",
        body: new URLSearchParams({
          token:
            global.session &&
            (global.session.user.SyncToken || global.session.accessToken),
          parent: parent.toString(),
          title: values.name,
          description: "",
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          let x = listItems.data;
          x.push(res.data);
          setListItems({
            data: x,
            loading: false,
          });
          setLoading(false);
          formik.resetForm();
          setOpen(false);
        })
        .catch((err: any) => alert(JSON.stringify(err)));
    },
  });

  const stopPropagationForTab = (event: any) => {
    if (event.key !== "Esc") {
      event.stopPropagation();
    }
  };

  return (
    <>
      <FormControlLabel
        onClick={handleClickOpen}
        control={
          <IconButton sx={{ mr: "1px" }}>
            <span className="material-symbols-rounded">add_circle</span>
          </IconButton>
        }
        label="New list item"
        sx={{ m: 0, mt: 0.1, display: "block" }}
      />

      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onKeyDown={stopPropagationForTab}
        swipeAreaWidth={0}
        disableSwipeToOpen={true}
        ModalProps={{
          keepMounted: true,
        }}
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
        onClose={handleClose}
        onOpen={() => setOpen(true)}
      >
        <Puller />
        <form onSubmit={formik.handleSubmit}>
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
            <LoadingButton
              loading={loading}
              onClick={() => setTimeout(() => setLoading(true), 100)}
              type="submit"
              size="large"
              disableElevation
              sx={{
                mr: 1,
                mb: 1,
                borderRadius: 100,
              }}
              variant="contained"
            >
              Done
            </LoadingButton>
          </DialogActions>
        </form>
      </SwipeableDrawer>
    </>
  );
}
