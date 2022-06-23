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
import React, { useEffect, useState } from "react";
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
                token: global.session ? global.session.accessToken : undefined,
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
            : "#808080"
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
        sx: {
          width: {
            sm: "50vw",
          },
          maxHeight: "80vh",
          borderRadius: "40px 40px 0 0",
          ...(global.theme === "dark" && {
            background: "hsl(240, 11%, 20%)",
          }),
          mx: "auto",
        },
      }}
      onClose={() => setDrawerState(false)}
      onOpen={() => setDrawerState(true)}
    >
      <div
        style={{
          textAlign: "center",
          borderBottom:
            "1px solid " +
            (global.theme === "dark"
              ? "hsl(240, 11%, 25%)"
              : "rgba(200,200,200,.3)"),
        }}
      >
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ mt: 4, mb: 2, fontWeight: "600" }}
        >
          {title}
        </Typography>
        <CreateListItemButton
          parent={id}
          setListItems={setListItems}
          listItems={listItems}
        />
        <Button
          size="large"
          sx={{ mr: 1, mb: 3, borderRadius: 100 }}
          variant="outlined"
          onClick={() => {
            setDrawerState(false);
          }}
        >
          Share
        </Button>
        <Button
          size="large"
          sx={{ mb: 3, borderRadius: 100 }}
          variant="outlined"
          onClick={() => {
            setDrawerState(false);
            setDeleted(true);
            fetch("https://api.smartlist.tech/v2/lists/delete-list/", {
              method: "POST",
              body: new URLSearchParams({
                token: global.session ? global.session.accessToken : undefined,
                id: id,
              }),
            });
          }}
        >
          Delete
        </Button>
      </div>
      <Box sx={{ p: 3, textAlign: "center", overflow: "scroll" }}>
        {listItems.loading ? (
          <>
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
          </>
        ) : (
          <div style={{ textAlign: "left", display: "block" }}>
            {listItems.data.length === 0 ? (
              <Box sx={{ textAlign: "center", opacity: ".5", py: 6 }}>
                <Typography variant="h3" sx={{ mb: 2 }}>
                  ¯\_(ツ)_/¯
                </Typography>
                <Typography variant="h5">No items yet...</Typography>
              </Box>
            ) : null}
            {listItems.data.map((item: any) => (
              <ListItem
                item={item}
                listItems={listItems}
                setListItems={setListItems}
              />
            ))}
          </div>
        )}
      </Box>
    </SwipeableDrawer>
  );
}

export function List({
  count,
  title,
  description,
  id,
}: {
  count: number;
  title: string;
  description: string;
  id: number;
}) {
  const [drawerState, setDrawerState] = React.useState<boolean>(false);
  const [listItems, setListItems] = useState({
    data: "",
    loading: true,
  });

  const getListItems = async (id: number) => {
    const data = await fetch("https://api.smartlist.tech/v2/lists/fetch/", {
      method: "POST",
      body: new URLSearchParams({
        token: global.session ? global.session.accessToken : undefined,
        parent: id.toString(),
      }),
    });
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
            "&:active": {transition: "none", transform: "scale(.98)"}
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
                {count || "0"} item{count !== 1 && "s"}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ) : null}
    </>
  );
}
