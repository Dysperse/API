import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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

function ListItem({ item, listItems, setListItems }: any) {
  return (
    <FormControlLabel
      control={
        <Checkbox
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
            fetch("https://api.smartlist.tech/v2/lists/delete-item/", {
              method: "POST",
              body: new URLSearchParams({
                token:
                  global.session &&
                  (global.session.account.SyncToken ||
                    global.session.property.accessToken),
                id: item.id,
              }),
            });
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
    document.documentElement.classList[drawerState ? "add" : "remove"](
      "prevent-scroll"
    );
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
          textAlign: "center",
          borderBottom:
            "1px solid " +
            (global.theme === "dark"
              ? "hsl(240, 11%, 25%)"
              : "rgba(200,200,200,.3)"),
        }}
      >
        <IconButton
          sx={{ borderRadius: 100, float: "right" }}
          onClick={() => {
            setDrawerState(false);
            setLists(lists.filter((list) => list.id !== id));
            setDeleted(true);
            fetch(
              "/api/lists/delete-custom-list?" +
                new URLSearchParams({
                  token:
                    global.session &&
                    (global.session.account.SyncToken ||
                      global.session.property.accessToken),
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
        <Typography variant="h5" sx={{ fontWeight: "600" }}>
          {title}
        </Typography>
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
                  <CreateListItemButton
                    parent={id}
                    setListItems={setListItems}
                    listItems={listItems}
                  />
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
            {listItems.data.length !== 0 && (
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
  title,
  lists,
  setLists,
  description,
  id,
}: {
  lists: any;
  setLists: any;
  title: string;
  description: string;
  id: number;
}) {
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
          token:
            global.session.account.SyncToken ||
            global.session.property.accessToken,
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

  const [deleted, setDeleted] = useState<boolean>(false);
  return (
    <>
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
            "& *": { transition: "none!important" },
            mb: 2,
            width: "100%",
            borderRadius: "28px",
            background: global.theme === "dark" ? "hsl(240, 11%, 13%)" : "#eee",
            boxShadow: 0,
            transition: "transform .2s",
            "&:active": { transition: "none", transform: "scale(.98)" },
          }}
        >
          <CardActionArea
            disableRipple
            sx={{ p: 1 }}
            onClick={() => {
              setDrawerState(true);
              getListItems(id);
            }}
          >
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                List
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ) : null}
    </>
  );
}
