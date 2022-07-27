import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import * as colors from "@mui/material/colors";
import DialogContent from "@mui/material/DialogContent";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { neutralizeBack, revivalBack } from "../history-control";
import { Puller } from "../Puller";

export function CreateListModal({ children, parent, items, setItems }: any) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [customParent, setCustomParent] = useState(parent);

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: (values: { name: string }) => {
      fetch(
        "/api/lists/create-item?" +
          new URLSearchParams({
            token: global.session.user.SyncToken || global.session.accessToken,
            parent: customParent,
            title: values.name,
            description: "",
          }),
        {
          method: "POST",
        }
      )
        .then((res) => res.json())
        .then((res) => {
          setItems([...items, res.data]);
          formik.resetForm();
          setLoading(false);
          setOpen(false);
          toast("Created item!");
        })
        .catch((err: any) => alert(JSON.stringify(err)));
    },
  });

  React.useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        swipeAreaWidth={0}
        ModalProps={{
          keepMounted: true,
        }}
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
        onClose={() => {
          setOpen(false);
        }}
        onOpen={() => setOpen(true)}
      >
        <Puller />
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              inputRef={(input) =>
                setTimeout(() => input && input.focus(), 100)
              }
              margin="dense"
              label="Title"
              required
              fullWidth
              autoComplete="off"
              name="name"
              variant="filled"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            {customParent === "-1" &&
              (formik.values.name.toLowerCase().includes("get ") ||
                formik.values.name.toLowerCase().includes("bring ") ||
                formik.values.name.toLowerCase().includes("shop ")) && (
                <Button
                  variant="outlined"
                  sx={{ borderWidth: "2px!important", mt: 2.5 }}
                  size="small"
                  onClick={() => setCustomParent("-2")}
                >
                  Add this to your shopping list instead?
                </Button>
              )}
            {customParent === "-2" &&
              (formik.values.name.toLowerCase().includes("pay ") ||
                formik.values.name.toLowerCase().includes("fix ") ||
                formik.values.name.toLowerCase().includes("throw ")) && (
                <Button
                  variant="outlined"
                  sx={{ borderWidth: "2px!important", mt: 2.5 }}
                  size="small"
                  onClick={() => setCustomParent("-1")}
                >
                  Add this to your to do list instead?
                </Button>
              )}
            <LoadingButton
              size="large"
              disableElevation
              sx={{
                float: "right",
                mr: 1,
                mt: 2,
                borderRadius: 100,
              }}
              color="primary"
              type="submit"
              loading={loading}
              onClick={() => setTimeout(() => setLoading(true), 100)}
              variant="contained"
            >
              Create
            </LoadingButton>
          </DialogContent>
        </form>
      </SwipeableDrawer>
      <div
        onClick={() => {
          setOpen(true);
          setCustomParent(parent);
        }}
      >
        {children}
      </div>
    </>
  );
}
