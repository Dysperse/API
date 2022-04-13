import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Formik, Form } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";

export function CreateItemModal({
  room,
  children
}: {
  room: string;
  children: any;
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [loading, setLoading] = React.useState(true);
  function setClickLoading() {
    setLoading(true);
  }

  const initialValues = {
    categories: [],
    title: "",
    quantity: ""
  };

  const submit = (values: Object) => {
    alert(JSON.stringify(values, null, 2));
  };

  return (
    <div>
      <div onClick={handleClickOpen}>{children}</div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Item</DialogTitle>
        <DialogContent>
          <DialogContentText>{room}</DialogContentText>
          <Formik initialValues={initialValues} onSubmit={submit}>
            {({ handleChange, values, setFieldValue }) => (
              <Form>
                <TextField
                  margin="dense"
                  autoFocus
                  label="Title"
                  fullWidth
                  onChange={handleChange}
                  disabled={loading}
                  name="title"
                  variant="filled"
                />
                <TextField
                  margin="dense"
                  label="Quantity"
                  fullWidth
                  onChange={handleChange}
                  disabled={loading}
                  name="quantity"
                  variant="filled"
                />
                <Autocomplete
                  id="categories"
                  multiple
                  freeSolo
                  disabled={loading}
                  options={[1, 2, 3]}
                  onChange={(e, value) => {
                    console.log(value);
                    setFieldValue(
                      "categories",
                      value !== null ? value : initialValues.categories
                    );
                  }}
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
                  sx={{ mt: 1, float: "right" }}
                  color="primary"
                  type="submit"
                  loading={loading}
                  onClick={() => setTimeout(setClickLoading, 10)}
                  variant="outlined"
                >
                  Save
                </LoadingButton>
                <Button
                  sx={{ mt: 1, mr: 1, float: "right" }}
                  color="primary"
                  type="button"
                  onClick={() => setLoading(false)}
                >
                  Cancel
                </Button>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
}
