import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";

function Puller() {
  return (
    <Box
      className="puller"
      sx={{
        width: "50px",
        backgroundColor: global.theme === "dark" ? "#505050" : "#eee",
        height: "7px",
        margin: "auto",
        borderRadius: 9,
        mt: 1,
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        display: "inline-block",
      }}
    />
  );
}

export function CreateListModal({ children, parent, title }: any) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: (values: { name: string }) => {
      fetch("https://api.smartlist.tech/v2/lists/create-item/", {
        method: "POST",
        body: new URLSearchParams({
          token: global.session ? global.session.accessToken : undefined,
          parent: parent,
          title: values.name,
          description: "",
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          formik.resetForm();
          setLoading(false);
          setOpen(false);
          toast("Created item!");
        })
        .catch((err: any) => alert(JSON.stringify(err)));
    },
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
        onClose={() => {
          setOpen(false);
        }}
        onOpen={() => setOpen(true)}
      >
        <Puller />
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle sx={{ mt: 2, textAlign: "center" }}>
            Create {title}
          </DialogTitle>
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
      <div onClick={() => setOpen(true)}>{children}</div>
    </>
  );
}
