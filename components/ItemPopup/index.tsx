import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import * as colors from "@mui/material/colors";
import { deepOrange } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { neutralizeBack, revivalBack } from "../history-control";
import { Puller } from "../Puller";
import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./EditButton";
import { ItemActionsMenu } from "./ItemActionsMenu";
import { StarButton } from "./StarButton";

export default function Item({ displayRoom = false, data, variant }: any) {
  const id = data.id;
  const [itemData] = useState(data);
  const [title, setTitle] = useState(data.title);
  const [quantity, setQuantity] = useState(data.amount);
  const [star, setStar] = useState(parseInt(itemData.star, 10));
  const [deleted, setDeleted] = useState<boolean>(false);
  const [categories, setCategories] = useState(data.categories);
  const [note, setNote] = useState(data.note);
  const [lastUpdated, setLastUpdated] = useState(data.lastUpdated);
  const [drawerState, setDrawerState] = useState<boolean>(false);

  useEffect(() => {
    drawerState ? neutralizeBack(() => setDrawerState(false)) : revivalBack();
  });

  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  useEffect(() => {
    document.documentElement.classList[drawerState ? "add" : "remove"](
      "prevent-scroll"
    );
    document.documentElement.classList[contextMenu !== null ? "add" : "remove"](
      "prevent-scroll"
    );
    document
      .querySelector(`meta[name="theme-color"]`)!
      .setAttribute(
        "content",
        drawerState === true
          ? window.innerWidth > 900
            ? global.theme === "dark"
              ? "hsl(240, 11%, 5%)"
              : "#cccccc"
            : global.theme === "dark"
            ? "hsl(240, 11%, 20%)"
            : colors[themeColor][50]
          : document.documentElement!.scrollTop === 0
          ? global.theme === "dark"
            ? "hsl(240, 11%, 10%)"
            : "#fff"
          : global.theme === "dark"
          ? "hsl(240, 11%, 20%)"
          : colors[global.themeColor]["100"]
      );
  }, [drawerState, contextMenu]);

  return (
    <>
      <Menu
        BackdropProps={{
          sx: { opacity: "0!important" },
        }}
        sx={{
          transition: "all .2s",
          "& .MuiPaper-root": {
            borderRadius: "15px",
            minWidth: 180,
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            background:
              global.theme === "dark"
                ? colors[global.themeColor][900]
                : colors[global.themeColor][100],

            color:
              global.theme === "dark"
                ? colors[global.themeColor][200]
                : colors[global.themeColor][800],
            "& .MuiMenu-list": {
              padding: "4px",
            },
            "& .MuiMenuItem-root": {
              "&:hover": {
                background:
                  global.theme === "dark"
                    ? colors[global.themeColor][800]
                    : colors[global.themeColor][200],
                color:
                  global.theme === "dark"
                    ? colors[global.themeColor][100]
                    : colors[global.themeColor][900],
                "& .MuiSvgIcon-root": {
                  color:
                    global.theme === "dark"
                      ? colors[global.themeColor][200]
                      : colors[global.themeColor][800],
                },
              },
              padding: "10px 15px",
              borderRadius: "15px",
              marginBottom: "1px",

              "& .MuiSvgIcon-root": {
                fontSize: 25,
                color: colors[global.themeColor][700],
                marginRight: 1.9,
              },
              "&:active": {
                background:
                  global.theme === "dark"
                    ? colors[global.themeColor][700]
                    : colors[global.themeColor][300],
              },
            },
          },
        }}
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={() => {
            setDrawerState(true);
            handleClose();
          }}
        >
          <span
            className="material-symbols-rounded"
            style={{ marginRight: "20px" }}
          >
            open_in_new
          </span>
          View
        </MenuItem>
        <MenuItem
          onClick={() => {
            const href =
              "https://" +
              window.location.hostname +
              "/share/" +
              encodeURIComponent(
                JSON.stringify({
                  name: global.session.account.name,
                  title: title,
                  quantity: quantity,
                  room: data.room,
                })
              );

            navigator.share({ url: href }).then(handleClose);
          }}
        >
          <span
            className="material-symbols-rounded"
            style={{ marginRight: "20px" }}
          >
            share
          </span>
          Share
        </MenuItem>
        <MenuItem
          onClick={() => {
            setLastUpdated(dayjs().format("YYYY-MM-DD HH:mm:ss"));
            setStar((s: number) => +!s);
            handleClose();
            fetch(
              "/api/inventory/star?" +
                new URLSearchParams({
                  token:
                    global.session &&
                    (global.session.account.SyncToken ||
                      global.session.property.propertyToken),
                  id: id.toString(),
                  lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                }),
              {
                method: "POST",
              }
            );
          }}
        >
          <span
            className={
              "material-symbols-" + (star == 1 ? "rounded" : "outlined")
            }
            style={{ marginRight: "20px" }}
          >
            grade
          </span>
          {star == 1 ? "Unstar" : "Star"}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setDeleted(true);
            fetch(
              "/api/inventory/trash?" +
                new URLSearchParams({
                  propertyToken: global.session.property.propertyToken,
                  accessToken: global.session.property.accessToken,
                  id: id.toString(),
                  lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                }),
              {
                method: "POST",
              }
            );
            handleClose();
          }}
        >
          <span
            className="material-symbols-rounded"
            style={{ marginRight: "20px" }}
          >
            delete
          </span>
          Delete
        </MenuItem>
      </Menu>
      <SwipeableDrawer
        sx={{
          opacity: "1!important",
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: { sm: 5 },
            mt: { sm: "20px" },
            ...(global.theme === "dark" && {
              background: "hsl(240, 11%, 20%)",
            }),
            mr: { sm: "20px" },
            height: { sm: "calc(100vh - 40px)!important" },
          },
        }}
        swipeAreaWidth={0}
        anchor="right"
        open={drawerState}
        onClose={() => setDrawerState(false)}
        onOpen={() => setDrawerState(true)}
      >
        {drawerState && (
          <Head>
            <title>
              {title} &bull; {data.room} &bull;{" "}
              {global.session.property.houseName.replace(/./, (c) =>
                c.toUpperCase()
              )}{" "}
              &bull; Carbon
            </title>
          </Head>
        )}
        <Puller variant="side" />

        <Box
          sx={{
            flexGrow: 1,
            height: "100vh",
            borderRadius: { sm: 5 },
            overflow: "hidden!important",
            width: {
              sm: "60vw",
              md: "40vw",
              xs: "100vw",
            },
            background: colors[themeColor][50],
            maxWidth: "100vw",
          }}
        >
          <AppBar
            position="absolute"
            sx={{
              borderTopLeftRadius: "28px!important",
              borderTopRightRadius: "28px!important",
              background:
                global.theme === "dark"
                  ? "hsl(240, 11%, 20%)"
                  : colors[themeColor][50],
              py: 1,
              color: global.theme === "dark" ? "#fff" : "#000",
            }}
            elevation={0}
          >
            <Toolbar>
              <Tooltip title="Back">
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  disableRipple
                  aria-label="menu"
                  sx={{
                    transition: "none",
                    mr: 1,
                    color:
                      global.theme === "dark"
                        ? "hsl(240, 11%, 90%)"
                        : "#606060",
                    "&:hover": {
                      background: "rgba(200,200,200,.3)",
                      color:
                        global.theme === "dark" ? "hsl(240, 11%, 95%)" : "#000",
                    },
                    "&:focus-within": {
                      background:
                        (global.theme === "dark"
                          ? colors[themeColor]["900"]
                          : colors[themeColor]["100"]) + "!important",
                      color:
                        global.theme === "dark" ? "hsl(240, 11%, 95%)" : "#000",
                    },
                  }}
                  onClick={() => setDrawerState(false)}
                >
                  <span className="material-symbols-rounded">arrow_back</span>
                </IconButton>
              </Tooltip>
              <Typography sx={{ flexGrow: 1 }}></Typography>
              {global.session.property.role !== "read-only" && (
                <StarButton
                  setLastUpdated={setLastUpdated}
                  id={id}
                  star={star}
                  setStar={setStar}
                />
              )}
              {global.session.property.role !== "read-only" && (
                <EditButton
                  id={id}
                  title={title}
                  setTitle={setTitle}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  categories={categories}
                  setCategories={setCategories}
                  setLastUpdated={setLastUpdated}
                />
              )}
              {global.session.property.role !== "read-only" && (
                <DeleteButton
                  id={id}
                  deleted={deleted}
                  setDrawerState={setDrawerState}
                  setDeleted={setDeleted}
                />
              )}
              <ItemActionsMenu
                setDrawerState={setDrawerState}
                id={id}
                room={data.room}
                setDeleted={setDeleted}
                star={star}
                title={title}
                quantity={quantity}
              />
            </Toolbar>
          </AppBar>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              height: "100vh",
              px: 7,
              gap: 2,
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: "400" }}>
              {title || "(no title)"}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "700",
              }}
            >
              Quantity: {quantity || "(no quantity)"}
            </Typography>
            <div>
              {categories.map((category: string) => {
                return (
                  <Chip
                    key={Math.random().toString()}
                    label={category}
                    sx={{ px: 2, mr: 1 }}
                  />
                );
              })}
            </div>
            <TextField
              multiline
              fullWidth
              onBlur={(e) => {
                e.target.placeholder = "Click to add note";
                e.target.spellcheck = false;
                setLastUpdated(dayjs().format("YYYY-MM-DD HH:mm:ss"));
                setNote(e.target.value);
                fetch(
                  "/api/inventory/updateNote?" +
                    new URLSearchParams({
                      propertyToken: global.session.property.propertyToken,
                      accessToken: global.session.property.accessToken,
                      id: id.toString(),
                      lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                      note: e.target.value,
                    }),
                  {
                    method: "POST",
                  }
                );
              }}
              onKeyUp={(e: any) => {
                if (e.code === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  e.target.value = e.target.value.trim();
                  e.target.blur();
                }
              }}
              InputProps={{
                disableUnderline: true,
                sx: {
                  px: 2.5,
                  py: 1.5,
                  borderRadius: "15px",
                },
              }}
              spellCheck={false}
              variant="filled"
              defaultValue={note}
              maxRows={4}
              onFocus={(e) => {
                e.target.placeholder = "SHIFT+ENTER for new lines";
                e.target.spellcheck = true;
              }}
              disabled={global.session.property.role === "read-only"}
              placeholder={
                global.session.property.role !== "read-only"
                  ? "Click to add note"
                  : "You do not have permission to edit this item"
              }
            />
          </Box>
        </Box>
      </SwipeableDrawer>

      <>
        {variant === "list" ? (
          <Collapse in={!deleted}>
            <ListItemButton
              onContextMenu={handleContextMenu}
              onClick={() => setDrawerState(true)}
              disableRipple
              sx={{
                py: 0.1,
                borderRadius: "10px",
                transition: "transform .2s",
                "&:active": {
                  transition: "none",
                  transform: "scale(.97)",
                  background: "rgba(200,200,200,.3)",
                },
              }}
            >
              <ListItemText
                sx={{
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  maxWidth: "calc(100vw - 200px)",
                  overflow: "hidden",
                }}
                primary={
                  <Typography sx={{ fontWeight: "400" }}>{title}</Typography>
                }
                secondary={
                  <Typography sx={{ fontWeight: "300", fontSize: "15px" }}>
                    {dayjs(lastUpdated).fromNow()}
                  </Typography>
                }
              />
            </ListItemButton>
          </Collapse>
        ) : (
          <>
            {!deleted && (
              <Card
                onContextMenu={handleContextMenu}
                sx={{
                  mt: {
                    xs: 3,
                    sm: 0.5,
                  },
                  boxShadow: "0",
                  // "&:hover": {
                  //   boxShadow:
                  //     "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                  // },
                  display: "block",
                  width: "100%",
                  maxWidth: "calc(100vw - 20px)",
                  borderRadius: "28px",
                  background:
                    (global.theme === "dark"
                      ? "hsl(240, 11%, 17%)"
                      : "rgba(200,200,200,.3)") + "!important",
                  transition: "transform .2s",
                  "& *": { transition: "none!important" },
                  "&:active": {
                    transform: "scale(0.98)",
                    transition: "none",
                  },
                  ...(star === 1 && {
                    background: deepOrange[global.theme === "dark" ? 900 : 50],
                  }),
                }}
                onClick={() => setDrawerState(true)}
              >
                <CardActionArea
                  disableRipple
                  sx={{
                    transition: "none!important",
                    "&:focus-within": {
                      background:
                        (global.theme === "dark"
                          ? "hsl(240, 11%, 18%)"
                          : "rgba(200,200,200,.01)") + "!important",
                    },
                    borderRadius: "28px",
                    "&:active": {
                      boxShadow: "none!important",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        display: "block",
                        mb: 1,
                      }}
                    >
                      {title.substring(0, 18) || "(no title)"}
                      {title.length > 18 && "..."}
                    </Typography>
                    <Typography
                      sx={{
                        mb: 1,
                      }}
                    >
                      {!quantity.includes(" ") && "Quantity: "}
                      {displayRoom
                        ? data.room
                        : quantity.substring(0, 18) || "(no quantity)"}
                      {!displayRoom && quantity.length > 18 && "..."}
                    </Typography>
                    {!displayRoom &&
                      categories.map((category: string) => {
                        if (category.trim() === "") return false;
                        return (
                          <Chip
                            key={Math.random().toString()}
                            sx={{ pointerEvents: "none", m: 0.25 }}
                            label={category}
                          />
                        );
                      })}
                  </CardContent>
                </CardActionArea>
              </Card>
            )}
          </>
        )}
      </>
    </>
  );
}
