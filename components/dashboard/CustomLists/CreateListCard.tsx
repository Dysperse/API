import AddCircleIcon from "@mui/icons-material/AddCircle";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import * as colors from "@mui/material/colors";
import DialogTitle from "@mui/material/DialogTitle";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { stopPropagationForTab } from "./Lists";

export function CreateListCard({ lists, setLists }: any) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    document.documentElement.classList[open ? "add" : "remove"](
      "prevent-scroll"
    );
    document
      .querySelector(`meta[name="theme-color"]`)!
      .setAttribute(
        "content",
        open
          ? global.theme === "dark"
            ? "#101010"
            : "#808080"
          : document.documentElement!.scrollTop === 0
          ? "#fff"
          : colors[global.themeColor][100]
      );
  });
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    onSubmit: (values: { title: string; description: string }) => {
      fetch("https://api.smartlist.tech/v2/lists/create-list/", {
        method: "POST",
        body: new URLSearchParams({
          token: global.session ? global.session.accessToken : undefined,
          title: values.title,
          description: values.description,
          star: "0",
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          formik.resetForm();
          setLists([
            ...lists,
            ...[
              {
                ...res.data,
              },
            ],
          ]);

          setLoading(false);
          setOpen(false);
        })
        .catch((err: any) => alert(JSON.stringify(err)));
    },
  });

  return (
    <>
      <Card
        sx={{
          boxShadow: 0,
          mb: 2,
          borderRadius: "28px",
          width: "100%",
          textAlign: "center",
          background:
            global.theme === "dark"
              ? "hsl(240, 11%, 20%)"
              : colors["grey"][100],
          "& *": { transition: "all .05s !important" },
        }}
      >
        <CardActionArea
          onClick={toggleDrawer(true)}
          sx={{ transition: "none!important" }}
        >
          <CardContent>
            <AddCircleIcon sx={{ my: 1 }} />
            <Typography gutterBottom variant="h5" component="div">
              Create list
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <SwipeableDrawer
        onKeyDown={stopPropagationForTab}
        open={open}
        anchor="bottom"
        PaperProps={{
          sx: {
            width: {
              sm: "50vw",
            },
            borderRadius: "40px 40px 0 0",
            mx: "auto",
          },
        }}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}

        swipeAreaWidth={0}
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle sx={{ mt: 2, textAlign: "center" }}>
            Create list
          </DialogTitle>
          <Box sx={{ p: 3 }}>
            <TextField
              inputRef={(input) =>
                setTimeout(() => input && input.focus(), 100)
              }
              margin="dense"
              label="Title"
              fullWidth
              autoComplete="off"
              name="title"
              variant="filled"
              onChange={formik.handleChange}
              value={formik.values.title}
            />

            <LoadingButton
              size="large"
              disableElevation
              sx={{
                float: "right",
                mr: 1,
                mt: 2,
                mb: 2,
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
            <Button
              onClick={() => setOpen(false)}
              sx={{
                float: "right",
                mr: 1,
                mt: 2,
                mb: 2,
                borderRadius: 100,
              }}
              size="large"
              color="primary"
              type="reset"
              variant="outlined"
            >
              Cancel
            </Button>
          </Box>
        </form>
      </SwipeableDrawer>
    </>
  );
}
