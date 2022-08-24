import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import * as colors from "@mui/material/colors";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import React, { useEffect } from "react";
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
      fetch(
        "/api/lists/create-item?" +
          new URLSearchParams({
            propertyToken: global.session.property.propertyToken,
            accessToken: global.session.property.accessToken,
            parent: parent.toString(),
            title: values.name,
            description: "",
          }),
        {
          method: "POST",
        }
      )
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
      <ListItem
        button
        disableRipple
        onClick={handleClickOpen}
        sx={{
          py: 0,
          borderRadius: 3,
          color: global.theme == "dark" ? "#fff" : "#808080",
          transition: "transform .2s",
          "&:active": {
            transition: "none",
            transform: "scale(.97)",
            background: "rgba(200,200,200,.3)",
          },
        }}
        dense
      >
        <ListItemText
          sx={{ mt: 1.4 }}
          primary={
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <span
                style={{ marginLeft: "-2px" }}
                className="material-symbols-outlined"
              >
                add_circle
              </span>
              <span
                style={{
                  color: global.theme == "dark" ? "#fff" : "#202020",
                  marginLeft: "-7px",
                }}
              >
                New list item
              </span>
            </Box>
          }
        />
      </ListItem>

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
              <TextField
                autoFocus
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    borderRadius: "20px",
                    border: "0!important",
                  },
                }}
                variant="standard"
                inputRef={(input) =>
                  setTimeout(() => input && input.focus(), 100)
                }
                fullWidth
                value={formik.values.name}
                onChange={(e) => formik.setFieldValue("name", e.target.value)}
                autoComplete="off"
                margin="dense"
                placeholder="Item name"
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
                borderRadius: 100,
              }}
            >
              Save
            </LoadingButton>
          </DialogActions>
        </form>
      </SwipeableDrawer>
    </>
  );
}
