import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import * as colors from "@mui/material/colors";
import FormControlLabel from "@mui/material/FormControlLabel";
import Skeleton from "@mui/material/Skeleton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import React, { useEffect, useState } from "react";
import { neutralizeBack, revivalBack } from "../../history-control";
import { Puller } from "../../Puller";
import { CreateListItemButton } from "./CreateListItemButton";
import SwipeableViews from "react-swipeable-views";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

function ListItem({ item, listItems, setListItems }: any) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          disabled={global.session.property.role === "read-only"}
          onClick={(e: any) => {
            e.target.checked = false;
            setListItems(
              (() => {
                return {
                  loading: false,
                  data: listItems.data.filter((d: any) => d.id !== item.id),
                };
              })()
            );
            fetch(
              "/api/lists/delete-item?" +
                new URLSearchParams({
                  propertyToken: global.session.property.propertyToken,
                  accessToken: global.session.property.accessToken,
                  id: item.id,
                }),
              {
                method: "POST",
              }
            );
          }}
        />
      }
      label={item.title}
      sx={{ m: 0, display: "block" }}
    />
  );
}

function ListPopup({
  setListItems,
  setDeleted,
  listItems,
  title,
  lists,
  setLists,
  id,
  drawerState,
  setDrawerState,
}: any) {
  useEffect(() => {
    document
      .querySelector(`meta[name="theme-color"]`)!
      .setAttribute(
        "content",
        drawerState
          ? global.theme === "dark"
            ? "hsl(240, 11%, 10%)"
            : "#cccccc"
          : global.theme === "dark"
          ? "hsl(240, 11%, 20%)"
          : colors[global.themeColor][100]
      );
  });
  return (
    <SwipeableDrawer
      open={drawerState}
      anchor="bottom"
      swipeAreaWidth={0}
      disableSwipeToOpen={true}
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
      onClose={() => setDrawerState(false)}
      onOpen={() => setDrawerState(true)}
    >
      <Puller />
      <Box
        sx={{
          p: 3,
          pt: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          borderBottom:
            "1px solid " +
            (global.theme === "dark"
              ? "hsl(240, 11%, 25%)"
              : "rgba(200,200,200,.3)"),
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "600" }}>
          {title}
        </Typography>
        {global.session.property.role !== "read-only" && (
          <IconButton
            sx={{ borderRadius: 100 }}
            onClick={() => {
              setDrawerState(false);
              setLists(lists.filter((list) => list.id !== id));
              setDeleted(true);
              fetch(
                "/api/lists/delete-custom-list?" +
                  new URLSearchParams({
                    propertyToken: global.session.property.propertyToken,
                    accessToken: global.session.property.accessToken,
                    id: id,
                  }),
                {
                  method: "POST",
                }
              );
            }}
          >
            <span className="material-symbols-rounded">delete</span>
          </IconButton>
        )}
      </Box>
      <Box sx={{ p: 3, textAlign: "center", overflow: "scroll" }}>
        {listItems.loading ? (
          <>
            {[...new Array(15)].map((_, i) => (
              <Skeleton
                animation="wave"
                key={i.toString()}
                variant="rectangular"
                sx={{
                  mb: 2,
                  borderRadius: 3,
                  height: 35,
                  width: "100%",
                }}
              />
            ))}
          </>
        ) : (
          <div style={{ textAlign: "left", display: "block" }}>
            {listItems.data.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 6 }}>
                <Typography variant="h3" sx={{ mb: 2, opacity: 0.7 }}>
                  ¯\_(ツ)_/¯
                </Typography>
                <Typography variant="h5" sx={{ opacity: 0.7 }}>
                  No items yet...
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {global.session.property.role !== "read-only" && (
                    <CreateListItemButton
                      parent={id}
                      setListItems={setListItems}
                      listItems={listItems}
                    />
                  )}
                </Box>
              </Box>
            ) : null}
            {listItems.data.map((item: any, id: number) => (
              <ListItem
                key={id.toString()}
                item={item}
                listItems={listItems}
                setListItems={setListItems}
              />
            ))}
            {listItems.data.length !== 0 &&
              global.session.property.role !== "read-only" && (
                <CreateListItemButton
                  parent={id}
                  setListItems={setListItems}
                  listItems={listItems}
                />
              )}
          </div>
        )}
      </Box>
    </SwipeableDrawer>
  );
}

export function List({
  mobile,
  title,
  lists,
  setLists,
  description,
  id,
}: {
  mobile: boolean;
  lists: any;
  setLists: any;
  title: string;
  description: string;
  id: number;
}) {
  const [index, setIndex] = React.useState<number>(0);

  const [drawerState, setDrawerState] = React.useState<boolean>(false);
  const [listItems, setListItems] = useState({
    data: "",
    loading: true,
  });
  useEffect(() => {
    drawerState ? neutralizeBack(() => setDrawerState(false)) : revivalBack();
  });

  const getListItems = async (id: number) => {
    const data = await fetch(
      "/api/lists/items?" +
        new URLSearchParams({
          propertyToken: global.session.property.propertyToken,
          accessToken: global.session.property.accessToken,
          parent: id.toString(),
        }),
      {
        method: "POST",
      }
    );
    const e = await data.json();

    setListItems({
      data: e.data,
      loading: false,
    });
  };
  const [open, setOpen] = useState<boolean>(false);
  const [deleted, setDeleted] = useState<boolean>(false);
  const [disablePointerEvents, setDisablePointerEvents] =
    useState<boolean>(false);

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setIndex(0);
          setDisablePointerEvents(false);
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            width: "450px",
            maxWidth: "calc(100vw - 20px)",
            borderRadius: "28px",
            p: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "800" }}>
          Delete list?
          <DialogContentText id="alert-dialog-slide-description" sx={{ mt: 1 }}>
            Are you sure you want to delete this list? This action cannot be
            undone.
          </DialogContentText>
        </DialogTitle>
        <DialogActions>
          <Button
            variant="outlined"
            disableElevation
            size="large"
            sx={{
              borderRadius: 99,
              px: 3,
              py: 1,
              borderWidth: "2px!important",
            }}
            onClick={() => {
              setOpen(false);
              setIndex(0);
              setDisablePointerEvents(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            size="large"
            sx={{
              borderRadius: 99,
              px: 3,
              py: 1,
              border: "2px solid transparent",
            }}
            onClick={() => {
              setLists(lists.filter((list) => list.id !== id));
              setDeleted(true);
              setDisablePointerEvents(false);
              fetch(
                "/api/lists/delete-custom-list?" +
                  new URLSearchParams({
                    propertyToken: global.session.property.propertyToken,
                    accessToken: global.session.property.accessToken,
                    id: id.toString(),
                  }),
                {
                  method: "POST",
                }
              );
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ListPopup
        title={title}
        id={id}
        setLists={setLists}
        lists={lists}
        listItems={listItems}
        drawerState={drawerState}
        setDrawerState={setDrawerState}
        setDeleted={setDeleted}
        setListItems={setListItems}
      />
      {!deleted ? (
        <Card
          sx={{
            mb: 2,
            mr: 2,
            width: { sm: "100%" },
            borderRadius: "28px",
            background: global.theme === "dark" ? "hsl(240, 11%, 13%)" : "#eee",
            boxShadow: 0,
            transition: "transform .2s",
            "&:active": { transition: "none", transform: "scale(.98)" },
          }}
        >
          <SwipeableViews
            enableMouseEvents
            index={index}
            slideStyle={{
              borderRadius: "15px!important",
            }}
            onChangeIndex={(changedIndex) => {
              setIndex(changedIndex);
              setOpen(true);
            }}
            onSwitching={(index: number) => {
              // Disable pointer events when swiping
              if (index > 0) {
                setDisablePointerEvents(true);
              } else {
                setTimeout(() => {
                  setDisablePointerEvents(false);
                }, 100);
              }
            }}
          >
            <CardActionArea
              disableRipple
              sx={{
                p: 1,
                pointerEvents: disablePointerEvents ? "none" : "auto",
              }}
              onClick={() => {
                setDrawerState(true);
                getListItems(id);
              }}
            >
              <CardContent
                sx={{
                  ...(mobile && {
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }),
                }}
              >
                {mobile && (
                  <span className="material-symbols-rounded">list_alt</span>
                )}
                <Typography
                  sx={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                  gutterBottom={!mobile}
                  variant="h6"
                  component="div"
                >
                  {title}
                </Typography>
                {!mobile && (
                  <Typography variant="body2" color="text.secondary">
                    List
                  </Typography>
                )}
              </CardContent>
            </CardActionArea>
            <Box
              sx={{
                background: colors.red["800"],
                width: "100%",
                height: "100%",
                color: "#fff",
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                px: 2,
                userSelect: "none",
                mr: 1,
              }}
            >
              <span className="material-symbols-rounded">delete</span>
            </Box>
          </SwipeableViews>
        </Card>
      ) : null}
    </>
  );
}
