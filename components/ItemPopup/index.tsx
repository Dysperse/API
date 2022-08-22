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
import Button from "@mui/material/Button";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { neutralizeBack, revivalBack } from "../history-control";
import { Puller } from "../Puller";
import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./EditButton";
import { ItemActionsMenu } from "./ItemActionsMenu";
import { StarButton } from "./StarButton";
import SwipeableViews from "react-swipeable-views";
import type { Item } from "../../types/item";
import toast from "react-hot-toast";

export default function Item({
  displayRoom = false,
  data,
  variant,
}: {
  displayRoom?: boolean;
  data: Item;
  variant?: "list" | "card";
}) {
  const id = data.id;
  const [drawerState, setDrawerState] = useState(false);
  const [item, setItemData] = useState(data);
  const [switchingToIndex, setSwitchingToIndex] = useState<number>(1);
  const [index, setIndex] = useState<number>(1);
  const [deleted, setDeleted] = useState<boolean>(false);

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

  const handleItemStar = () => {
    setItemData({
      ...item,
      lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      star: +!item.star,
    });
    fetch(
      "/api/inventory/star?" +
        new URLSearchParams({
          propertyToken: global.session.property.propertyToken,
          accessToken: global.session.property.accessToken,
          id: item.id.toString(),
          lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        }),
      {
        method: "POST",
      }
    );
  };

  const handleItemDelete = () => {
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

    toast.success((t) => (
      <span>
        Item moved to trash
        <Button
          size="small"
          sx={{
            ml: 2,
            borderRadius: 999,
            p: "0!important",
            width: "auto",
            minWidth: "auto",
          }}
          onClick={() => {
            toast.dismiss(t.id);
            setIndex(1);
            fetch(
              "/api/inventory/restore?" +
                new URLSearchParams({
                  propertyToken: global.session.property.propertyToken,
                  accessToken: global.session.property.accessToken,
                  id: item.id.toString(),
                  lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                }),
              {
                method: "POST",
              }
            );
            setDeleted(false);
          }}
        >
          Undo
        </Button>
      </span>
    ));
  };

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
                  title: item.title,
                  quantity: item.amount,
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
            setItemData({
              ...item,
              lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            });
            setItemData({
              ...item,
              star: +!item.star,
            });
            handleClose();
            fetch(
              "/api/inventory/star?" +
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
          }}
        >
          <span
            className={
              "material-symbols-" + (item.star == 1 ? "rounded" : "outlined")
            }
            style={{ marginRight: "20px" }}
          >
            grade
          </span>
          {item.star == 1 ? "Unstar" : "Star"}
        </MenuItem>
        <MenuItem onClick={handleItemDelete}>
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
              {item.title} &bull; {data.room} &bull;{" "}
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
            ...(global.theme === "dark" && {
              background: "hsl(240, 11%, 20%)",
            }),
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
                <StarButton item={item} setItemData={setItemData} />
              )}
              {global.session.property.role !== "read-only" && (
                <EditButton item={item} setItemData={setItemData} />
              )}
              {global.session.property.role !== "read-only" && (
                <DeleteButton
                  item={item}
                  setDrawerState={setDrawerState}
                  setDeleted={setDeleted}
                />
              )}
              <ItemActionsMenu
                item={item}
                setItemData={setItemData}
                setDeleted={setDeleted}
                setDrawerState={setDrawerState}
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
              {item.title || "(no title)"}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "700",
              }}
            >
              Quantity: {item.amount || "(no quantity)"}
            </Typography>
            <div>
              {item.categories.map((category: string) => {
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
                setItemData({
                  ...item,
                  lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                });
                // Update item note
                setItemData({
                  ...item,
                  note: e.target.value,
                });
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
              defaultValue={item.note}
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
          <Collapse in={!deleted} sx={{ borderRadius: 3, overflow: "hidden" }}>
            <SwipeableViews
              index={index}
              slideStyle={{
                borderRadius: "15px!important",
              }}
              onChangeIndex={(changedIndex) => {
                setIndex(changedIndex);
                if (changedIndex === 2) {
                  handleItemDelete();
                  setTimeout(() => {
                    setDeleted(true);
                  }, 200);
                } else {
                  handleItemStar();
                  setTimeout(() => {
                    setIndex(1);
                  }, 200);
                }
              }
}onSwitching={(index) => {
                    console.log(index);
                    if (index > 1) {
                      setSwitchingToIndex(2);
                    } else if (index < 1) {
                      setSwitchingToIndex(0);
                    } else {
                      setTimeout(() => setSwitchingToIndex(1), 200);
                    }
                  }}
            >
              <Box
                sx={{
                  background: colors.orange[item.star === 1 ? "900" : "100"],
                  width: "100%",
                  transition: "background .2s",
                  height: "100%",
                  color: item.star === 1 ? "#fff" : "#000",
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 3,
                  justifyContent: "end",
                  px: 2,
                }}
              >
                <span
                  style={{
                    display: switchingToIndex == 0 ? "block" : "none",
                  }}
                  className={
                    "animateIcon material-symbols-" +
                    (item.star == 0 ? "outlined" : "rounded")
                  }
                >
                  star
                </span>
              </Box>
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
                    background:
                      global.theme == "dark"
                        ? "hsl(240, 11%, 20%)"
                        : "rgba(200,200,200,.3)",
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
                    <Typography sx={{ fontWeight: "400" }}>
                      {item.title}
                    </Typography>
                  }
                  secondary={
                    <Typography sx={{ fontWeight: "300", fontSize: "15px" }}>
                      {dayjs(item.lastUpdated).fromNow()}
                    </Typography>
                  }
                />
              </ListItemButton>
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
                }}
              >
                <span className="material-symbols-rounded">delete</span>
              </Box>
            </SwipeableViews>
          </Collapse>
        ) : (
          <>
            <Collapse in={!deleted} sx={{ borderRadius: 5 }}>
              <Card
                onContextMenu={handleContextMenu}
                sx={{
                  boxShadow: "0",
                  display: "block",
                  my: 1.5,
                  width: "100%",
                  maxWidth: "calc(100vw - 32.5px)",
                  borderRadius: "28px",
                  background:
                    (global.theme === "dark"
                      ? "hsl(240, 11%, 17%)"
                      : "rgba(200,200,200,.3)") + "!important",
                  transition: "transform .2s",
                  "&:active": {
                    transform: "scale(0.98)",
                    transition: "none",
                  },
                  ...(item.star === 1 && {
                    background: deepOrange[global.theme === "dark" ? 900 : 50],
                  }),
                }}
                onClick={() => setDrawerState(true)}
              >
                <SwipeableViews
                  index={index}
                  slideStyle={{
                    borderRadius: "15px!important",
                  }}
                  onChangeIndex={(changedIndex) => {
                    setIndex(changedIndex);
                    if (changedIndex === 2) {
                      handleItemDelete();
                      setTimeout(() => {
                        setDeleted(true);
                      }, 200);
                    } else {
                      handleItemStar();
                      setTimeout(() => {
                        setIndex(1);
                      }, 200);
                    }
                  }}
                  onSwitching={(index) => {
                    console.log(index);
                    if (index > 1) {
                      setSwitchingToIndex(2);
                    } else if (index < 1) {
                      setSwitchingToIndex(0);
                    } else {
                      setTimeout(() => setSwitchingToIndex(1), 200);
                    }
                  }}
                >
                  <Box
                    sx={{
                      background:
                        colors.orange[item.star === 1 ? "900" : "100"],
                      width: "100%",
                      transition: "background .2s",
                      height: "100%",
                      color: item.star === 1 ? "#fff" : "#000",
                      display: "flex",
                      alignItems: "center",
                      borderRadius: 5,
                      justifyContent: "end",
                      px: 2,
                    }}
                  >
                    <span
                      style={{
                        display: switchingToIndex === 0 ? "block" : "none",
                      }}
                      className={
                        "animateIcon material-symbols-" +
                        (item.star == 0 ? "outlined" : "rounded")
                      }
                    >
                      star
                    </span>
                  </Box>
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
                        {item.title.substring(0, 18) || "(no title)"}
                        {item.title.length > 18 && "..."}
                      </Typography>
                      <Typography
                        sx={{
                          mb: 1,
                        }}
                      >
                        {!item.amount.includes(" ") && "Quantity: "}
                        {displayRoom
                          ? data.room
                          : item.amount.substring(0, 18) || "(no quantity)"}
                        {!displayRoom && item.amount.length > 18 && "..."}
                      </Typography>
                      {!displayRoom &&
                        item.categories.map((category: string) => {
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
                  <Box
                    sx={{
                      background: colors.red["800"],
                      width: "100%",
                      height: "100%",
                      color: "#fff",
                      display: "flex",
                      ml: 1,
                      mr: 1,
                      alignItems: "center",
                      px: 2,
                      borderRadius: "28px",
                    }}
                  >
                    <span
                      style={{
                        display: switchingToIndex === 2 ? "block" : "none",
                      }}
                      className="animateIcon material-symbols-rounded"
                    >
                      delete
                    </span>
                  </Box>
                </SwipeableViews>
              </Card>
            </Collapse>
          </>
        )}
      </>
    </>
  );
}
