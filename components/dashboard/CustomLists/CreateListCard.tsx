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
import { useEffect, useState } from "react";
import { Puller } from "../../Puller";
import { stopPropagationForTab } from "./Lists";

export function CreateListCard({ mobile, lists, setLists }: any) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    document
      .querySelector(`meta[name="theme-color"]`)!
      .setAttribute(
        "content",
        open
          ? global.theme === "dark"
            ? "#101010"
            : "#cccccc"
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
      fetch(
        "/api/lists/create-custom-list?" +
          new URLSearchParams({
            propertyToken: global.session.property.propertyToken,
            accessToken: global.session.property.accessToken,
            title: values.title,
            description: values.description,
          }),
        {
          method: "POST",
        }
      )
        .then((res) => res.json())
        .then((res) => {
          setLoading(true);
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
          "& *": { transition: "none!important" },
          textAlign: "center",
          background:
            global.theme === "dark"
              ? "hsl(240, 11%, 20%)"
              : "rgba(200,200,200,.3)",
          transition: "transform .2s",
          "&:active": {
            transition: "none",
            transform: "scale(.97)",
            background: "rgba(200,200,200,.3)",
          },
        }}
      >
        <CardActionArea
          onClick={toggleDrawer(true)}
          sx={{ transition: "none!important" }}
        >
          <CardContent>
            <Typography component="div">
              <span
                className="material-symbols-rounded"
                style={{ display: "block" }}
              >
                add_circle
              </span>
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
          elevation: 0,
          sx: {
            background: colors[themeColor][50],
            width: {
              sm: "50vw",
            },
            maxHeight: "80vh",
            borderRadius: "30px 30px 0 0",
            mx: "auto",
            ...(global.theme === "dark" && {
              background: "hsl(240, 11%, 25%)",
            }),
          },
        }}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={0}
      >
        <Puller />
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
              label="Title (Example: School supplies, Potluck food, etc...)"
              fullWidth
              required
              autoComplete="off"
              name="title"
              variant="filled"
              onChange={formik.handleChange}
              value={formik.values.title}
            />
            {(formik.values.title.toLowerCase().includes("shopping") ||
              formik.values.title.toLowerCase().includes("to do")) && (
              <Button
                variant="outlined"
                sx={{ borderWidth: "2px!important", mt: 2 }}
                size="small"
                onClick={() => {}}
              >
                Use your{" "}
                {formik.values.title.toLowerCase().includes("shopping")
                  ? "shopping"
                  : "to do"}{" "}
                list instead?
              </Button>
            )}
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
              variant="contained"
            >
              Create
            </LoadingButton>
          </Box>
        </form>
      </SwipeableDrawer>
    </>
  );
}
