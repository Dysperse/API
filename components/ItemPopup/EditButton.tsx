import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import * as colors from "@mui/material/colors";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import dayjs from "dayjs";
import { useFormik } from "formik";
import React from "react";
import { AutocompleteData } from "../AutocompleteData";

export function EditButton({
  id,
  title,
  setTitle,
  quantity,
  setQuantity,
  categories,
  setCategories,
  setLastUpdated,
}: any): JSX.Element {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      categories: categories,
      title: title,
      quantity: quantity,
    },
    onSubmit: async (values: {
      categories: Array<string>;
      title: string;
      quantity: string;
    }) => {
      fetch("https://api.smartlist.tech/v2/items/edit/", {
        method: "POST",
        body: new URLSearchParams({
          token: global.session && global.session.accessToken,
          id: id.toString(),
          lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          name: values.title,
          qty: values.quantity,
          category: JSON.stringify(values.categories),
        }),
      });

      setLastUpdated(dayjs().format("YYYY-MM-DD HH:mm:ss"));
      setTitle(values.title);
      setQuantity(values.quantity);
      setCategories(values.categories);
      handleClose();
    },
  });

  return (
    <div>
      <Tooltip title="Edit">
        <IconButton
          disableRipple
          size="large"
          edge="end"
          color="inherit"
          aria-label="menu"
          sx={{
            mr: 1,
            transition: "none",
            color: "#404040",
            "&:hover": { background: "rgba(200,200,200,.3)", color: "#000" },
            "&:active": {
              boxShadow: "none!important",
            },
            "&:focus-within": {
              background: colors[themeColor]["100"] + "!important",
              color: "#000",
              boxShadow: "inset 0px 0px 0px 2px " + colors[themeColor]["800"],
            },
          }}
          onClick={handleClickOpen}
        >
          <span className="material-symbols-rounded">edit</span>
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          transition: "all .2s",
        }}
        PaperProps={{
          sx: {
            borderRadius: "28px",
            p: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "800" }}>Edit item</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              margin="dense"
              autoFocus
              label="Title"
              fullWidth
              onChange={formik.handleChange}
              defaultValue={formik.values.title}
              name="title"
              variant="filled"
            />
            <TextField
              margin="dense"
              label="Quantity"
              fullWidth
              onChange={formik.handleChange}
              defaultValue={formik.values.quantity}
              name="quantity"
              variant="filled"
            />
            <Autocomplete
              id="categories"
              multiple
              freeSolo
              options={AutocompleteData}
              defaultValue={formik.values.categories}
              onChange={(e, newValue) =>
                formik.setFieldValue("categories", newValue)
              }
              renderInput={(params) => (
                <TextField
                  margin="dense"
                  label="Categories"
                  name="categories"
                  variant="filled"
                  {...params}
                />
              )}
            />

            <Button
              variant="contained"
              disableElevation
              size="large"
              type="submit"
              sx={{
                borderRadius: 99,
                float: "right",
                px: 3,
                py: 1,
                mt: 1,
                ml: 1,
              }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              disableElevation
              size="large"
              onClick={() => setOpen(false)}
              type="reset"
              sx={{
                borderRadius: 99,
                float: "right",
                px: 3,
                py: 1,
                mt: 1,
              }}
            >
              Cancel
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
