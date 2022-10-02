import LoadingButton from "@mui/lab/LoadingButton";
import Masonry from "@mui/lab/Masonry";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import React from "react";
import { fetchApiWithoutHook, useApi } from "../../hooks/useApi";
import { colors } from "../../lib/colors";
import type { ApiResponse } from "../../types/client";
import type { List } from "@prisma/client";
import { ErrorHandler } from "../ErrorHandler";
import { neutralizeBack, revivalBack } from "../history-control";
import { Puller } from "../Puller";
import { ListItems } from "./ListItems";
/**
 * Description
 * @param {any} {name
 * @param {any} lists
 * @param {any} setLists
 * @param {any} tip}
 * @returns {any}
 */
function ListTip({ name, lists, setLists, tip }) {
  return (
    <Alert
      icon={
        <div style={{ marginTop: "5px" }}>
          <span
            className="material-symbols-outlined"
            style={{ color: colors.orange[global.user.darkMode ? 100 : 900] }}
          >
            lightbulb
          </span>
        </div>
      }
      severity="info"
      sx={{
        alignItems: "center",
        display: "flex",
        borderRadius: 5,
        mb: 2,
        background: colors.orange[global.user.darkMode ? 900 : 50],
        color: colors.orange[global.user.darkMode ? 100 : 900],
      }}
      action={
        <IconButton
          sx={{
            borderRadius: 999,
            background: `${
              colors.orange[global.user.darkMode ? 800 : 100]
            }!important`,
            color: `${
              colors.orange[global.user.darkMode ? 100 : 900]
            }!important`,
          }}
          onClick={() => {
            fetchApiWithoutHook("property/lists/createList", {
              name: name,
              description: "",
            }).then((res: List) => {
              setLists([...lists, { ...res, items: [] }]);
            });
          }}
        >
          <span className="material-symbols-outlined">add</span>
        </IconButton>
      }
    >
      {tip}
    </Alert>
  );
}

/**
 * Renders the list data
 * @param {any} {data}
 * @returns {JSX.Element}
 */
function Render({ data }: { data: List[] }): JSX.Element {
  const [lists, setLists] = React.useState<any>(data);
  const [open, setOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    setLists(data);
  }, [data]);

  React.useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  }, [open]);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    onSubmit: (values) => {
      setLoading(true);
      fetchApiWithoutHook("property/lists/createList", {
        name: values.name,
        description: values.description,
      }).then((res: List[]) => {
        setLoading(false);
        setOpen(false);
        setLists([...lists, { ...res, items: [] }]);
      });
    },
  });

  return (
    <Masonry
      sx={{ mt: 2 }}
      columns={{ xs: 1, sm: 2 }}
      spacing={{ xs: 0, sm: 1 }}
    >
      {lists.map((list) => (
        <ListItems
          key={list.id}
          data={list.items}
          emptyText="You haven't added any items to this list yet."
          emptyImage="https://ouch-cdn2.icons8.com/Gmb2VDsK_0vYJN8H8Q_-pj5cJEKjFQY6buBtji7rJGo/rs:fit:256:171/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvMzkz/L2E5OTFhYjE3LTNh/MDktNGM2My1iNjhi/LTk1ZDA1NmRhYzNk/MS5zdmc.png"
          title={list.name}
          description={list.description}
          parent={list.id}
          setLists={setLists}
          lists={lists}
        />
      ))}
      {lists &&
        lists.filter((e) => e.name.toLowerCase() === "shopping list").length ===
          0 && (
          <ListTip
            setLists={setLists}
            lists={lists}
            name="Shopping List"
            tip="Tip: Create a shopping list to keep track of your shopping list"
          />
        )}

      {lists &&
        lists.filter((e) => e.name.toLowerCase() === "to-do").length === 0 && (
          <ListTip
            setLists={setLists}
            lists={lists}
            name="To-do"
            tip="Tip: Create a to-do list to keep track of your tasks"
          />
        )}
      {lists &&
        lists.filter((e) => e.name.toLowerCase() === "wishlist").length ===
          0 && (
          <ListTip
            setLists={setLists}
            lists={lists}
            name="Wishlist"
            tip="Tip: Create a wishlist list to store items you want!"
          />
        )}
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
            maxWidth: { sm: "450px", xs: "100vw" },
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
              PRO TIP: You can share lists with members who aren&apos;t invited
              to your home!
              <TextField
                autoComplete="off"
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
                autoComplete="off"
                id="description"
                variant="filled"
                name="description"
                InputProps={{
                  value: formik.values.description,
                  onChange: (e) =>
                    formik.setFieldValue("description", e.target.value),
                }}
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
            my: { xs: 2, sm: 0 },
            borderRadius: 5,
            userSelect: "none",
            background: global.user.darkMode
              ? "hsl(240, 11%, 13%)"
              : "rgba(200,200,200,.3)",
            cursor: "pointer",
            "&:hover": {
              background: global.user.darkMode
                ? "hsl(240, 11%, 15%)"
                : "rgba(200,200,200,.4)",
            },
            transition: "transform 0.2s",

            "&:active": {
              transform: "scale(0.98)",
              transition: "none",
              background: global.user.darkMode
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
            <span className="material-symbols-outlined">add_circle</span>
            Create list
          </CardContent>
        </Card>
      </Paper>
    </Masonry>
  );
}

/**
 * Lists component
 * @returns {JSX.Element}
 */
export function Lists(): JSX.Element {
  const { error, loading, data }: ApiResponse = useApi("property/lists");

  return (
    <>
      {error && (
        <ErrorHandler error="An error occured while trying to fetch your lists" />
      )}
      {loading ? (
        [...new Array(10)].map(() => (
          <Paper key={Math.random().toString()}>
            <Skeleton
              animation="wave"
              variant="rectangular"
              sx={{
                mb: 2,
                borderRadius: 5,
                height: Math.random() * 200 + 200,
              }}
            />
          </Paper>
        ))
      ) : (
        <Render data={data} />
      )}
    </>
  );
}
