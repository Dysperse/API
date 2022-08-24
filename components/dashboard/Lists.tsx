import { ListItems } from "./ListItems";
import useSWR from "swr";
import Box from "@mui/material/Box";
import React from "react";
import Card from "@mui/material/Card";
import Paper from "@mui/material/Paper";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Puller } from "../Puller";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import LoadingButton from "@mui/lab/LoadingButton";
import { neutralizeBack, revivalBack } from "../history-control";
import { useFormik } from "formik";

function Render({ data }: any) {
  const [lists, setLists] = React.useState<any>(data.lists);
  const [open, setOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  React.useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    onSubmit: async (values) => {
      setLoading(true);
      fetch(
        "/api/lists/create-custom-list?" +
          new URLSearchParams({
            accessToken: global.session.property.accessToken,
            propertyToken: global.session.property.propertyToken,
            title: values.name,
            description: values.description,
          }),
        {
          method: "POST",
        }
      )
        .then((res) => res.json())
        .then((res: any) => {
          setLoading(false);
          setOpen(false);
          setLists([...lists, res]);
        });
    },
  });

  return (
    <>
      {lists.map((list) => (
        <ListItems
          key={list.id}
          data={data.items.filter(
            (item) => item.parent.toString() === list.id.toString()
          )}
          emptyText="You haven't added any items to this list yet."
          emptyImage="https://ouch-cdn2.icons8.com/Gmb2VDsK_0vYJN8H8Q_-pj5cJEKjFQY6buBtji7rJGo/rs:fit:256:171/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvMzkz/L2E5OTFhYjE3LTNh/MDktNGM2My1iNjhi/LTk1ZDA1NmRhYzNk/MS5zdmc.png"
          title={list.title}
          description={list.description}
          parent={parseInt(list.id)}
          setLists={setLists}
          lists={lists}
        />
      ))}
      <SwipeableDrawer
        open={open}
        anchor="bottom"
        sx={{
          display: "flex",
          alignItems: { xs: "end", sm: "center" },
          height: "100vh",
          justifyContent: "center",
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: "28px",
            borderBottomLeftRadius: { xs: 0, sm: "28px!important" },
            borderBottomRightRadius: { xs: 0, sm: "28px!important" },
            position: "unset",
            mx: "auto",
            maxWidth: { sm: "30vw", xs: "100vw" },
            overflow: "hidden",
          },
        }}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(false)}
        disableSwipeToOpen
      >
        <Box sx={{ display: { sm: "none" } }}>
          <Puller />
        </Box>
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ p: 2 }}>
            <DialogTitle variant="h6" sx={{ fontWeight: "900" }}>
              Create list
            </DialogTitle>
            <DialogContent>
              Good examples of list names are short and descriptive.
              <TextField
                id="listName"
                required
                name="name"
                onChange={formik.handleChange}
                variant="filled"
                fullWidth
                margin="dense"
                sx={{ mt: 3 }}
                label="List name"
              />
              <TextField
                id="description"
                variant="filled"
                name="description"
                onChange={formik.handleChange}
                margin="dense"
                fullWidth
                label="Description (optional)"
              />
            </DialogContent>
            <DialogActions sx={{ px: 3 }}>
              <Button
                disableElevation
                type="reset"
                onClick={() => setOpen(false)}
                variant="outlined"
                size="large"
                sx={{ borderRadius: 999, borderWidth: "2px!important" }}
              >
                Cancel
              </Button>
              <LoadingButton
                disableElevation
                loading={loading}
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  borderRadius: 999,
                  border: "2px solid transparent!important",
                }}
              >
                Create
              </LoadingButton>
            </DialogActions>
          </Box>
        </form>
      </SwipeableDrawer>
      <Paper>
        <Card
          onClick={() => {
            setOpen(true);
            setTimeout(() => document.getElementById("listName")?.focus());
          }}
          sx={{
            borderRadius: 5,
            userSelect: "none",
            background:
              global.theme == "dark"
                ? "hsl(240, 11%, 13%)"
                : "rgba(200,200,200,.3)",
            cursor: "pointer",
            "&:hover": {
              background:
                global.theme == "dark"
                  ? "hsl(240, 11%, 15%)"
                  : "rgba(200,200,200,.4)",
            },
            "&:active": {
              background:
                global.theme == "dark"
                  ? "hsl(240, 11%, 20%)"
                  : "rgba(200,200,200,.5)",
            },
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              py: 3,
              px: 3.5,
              fontWeight: "600",
            }}
          >
            <span className="material-symbols-outlined">add_circle</span>Create
            list
          </CardContent>
        </Card>
      </Paper>
    </>
  );
}

export function Lists() {
  const url =
    "/api/lists/items?" +
    new URLSearchParams({
      propertyToken: global.session.property.propertyToken,
      accessToken: global.session.property.accessToken,
    });

  const { data, error }: any = useSWR(url, () =>
    fetch(url).then((res) => res.json())
  );
  return <>{data ? <Render data={data} /> : <Box>Loading...</Box>}</>;
}
