import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import { deepOrange } from "@mui/material/colors";
import Grid from "@mui/material/Grid";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SwipeableViews from "react-swipeable-views";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import { colors } from "../../lib/colors";
import { neutralizeBack, revivalBack } from "../history-control";
import { Puller } from "../Puller";
import { AddToListModal } from "./AddToList";
import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./EditButton";
import { MoveToRoom } from "./MoveToRoom";
import { ShareModal } from "./ShareModal";
import { StarButton } from "./StarButton";
import type { Item as ItemType } from "../../types/item";

/**
 * Item popup
 * @param {boolean} displayRoom - Display the room name?
 * @param {any} data - Item data
 * @param {variant} variant - The variant of the trigger
 */
export default function Item({
  displayRoom = false,
  data,
  variant,
}: {
  displayRoom?: boolean;
  data: ItemType;
  variant?: "list" | "card";
}) {
  const router = useRouter();
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

  /**
   * Overrides default context menu and opens the custom one
   * @param {React.MouseEvent} event
   * @returns {any}
   */
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

  /**
   * Closes the popup
   * @returns void
   */
  const handleClose = () => {
    setContextMenu(null);
  };

  useEffect(() => {
    document
      .querySelector(`meta[name="theme-color"]`)
      ?.setAttribute(
        "content",
        drawerState === true
          ? window.innerWidth > 900
            ? global.user.darkMode
              ? "hsl(240, 11%, 5%)"
              : colors[themeColor][50]
            : global.user.darkMode
            ? "hsl(240, 11%, 20%)"
            : colors[themeColor][50]
          : document.documentElement?.scrollTop === 0
          ? global.user.darkMode
            ? "hsl(240, 11%, 10%)"
            : "#fff"
          : global.user.darkMode
          ? "hsl(240, 11%, 20%)"
          : colors[global.themeColor]["100"]
      );
  }, [drawerState, contextMenu]);

  /**
   * Callback for clicking on the star button
   * @returns {void}
   */
  const handleItemStar = (): void => {
    setItemData({
      ...item,
      lastModified: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      starred: !item.starred,
    });
    fetchApiWithoutHook("property/inventory/star", {
      id: item.id.toString(),
      lastModified: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      starred: item.starred,
    });
  };

  /**
   * Callback for deleting an item
   * @returns {any}
   */
  const handleItemDelete = () => {
    setDeleted(true);

    fetchApiWithoutHook("property/inventory/trash", {
      id: id.toString(),
      lastModified: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    });

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
            fetchApiWithoutHook("property/inventory/restore", {
              id: item.id.toString(),
              lastModified: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            });
            setDeleted(false);
          }}
        >
          Undo
        </Button>
      </span>
    ));
  };
  const styles = {
    transition: "none",
    mr: 1,
    py: 2,
    gap: 2,

    color: global.user.darkMode
      ? "hsl(240, 11%, 90%)"
      : colors[themeColor]["800"],
    "&:hover, &:active": {
      background: global.user.darkMode
        ? "hsl(240, 11%, 25%)"
        : colors[themeColor][200],
      color: global.user.darkMode
        ? "hsl(240, 11%, 95%)"
        : colors[themeColor][900],
    },
  };
  return (
    <>
      <Menu
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
            const href = `https://${
              window.location.hostname
            }/share/${encodeURIComponent(
              JSON.stringify({
                name: global.user.name,
                title: item.name,
                quantity: item.quantity,
                room: data.room,
              })
            )}`;

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
            handleItemStar();
            handleClose();
          }}
        >
          <span
            className={`material-symbols-${
              item.starred ? "rounded" : "outlined"
            }`}
            style={{ marginRight: "20px" }}
          >
            grade
          </span>
          {item.starred ? "Unstar" : "Star"}
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
        PaperProps={{
          elevation: 0,
          sx: {
            maxHeight: "90vh",
            width: { xs: "100vw", sm: "95vw", md: "80vw", lg: "70vw" },
            mx: "auto",
            background: "transparent",
          },
        }}
        swipeAreaWidth={0}
        anchor="bottom"
        open={drawerState}
        onClose={() => setDrawerState(false)}
        onOpen={() => setDrawerState(true)}
      >
        {drawerState && (
          <Head>
            <title>
              {item.name} &bull; {data.room} &bull;{" "}
              {global.property.profile.name.replace(/./, (c) =>
                c.toUpperCase()
              )}{" "}
              &bull; Carbon
            </title>
          </Head>
        )}

        <Box
          sx={{
            flexGrow: 1,
            height: "100%",
            position: "relative",
            borderRadius: "28px 28px 0 0",
            overflowY: "scroll!important",
            background: `${colors[themeColor][50]}!important`,
            ...(global.user.darkMode && {
              background: "hsl(240, 11%, 20%)",
            }),
            maxWidth: "100vw",
          }}
        >
          <Box
            sx={{
              position: "sticky",
              top: 0,
              height: { xs: 40, sm: 0 },
              // display: { sm: "none" },
              zIndex: 9,
              background: global.user.darkMode
                ? "hsl(240, 11%, 20%)"
                : colors[themeColor][50],
            }}
          >
            <Puller />
          </Box>
          <Box sx={{ p: 5, pt: 7 }}>
            <Grid container spacing={5}>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  alignItems: "center",
                  display: "flex",
                  width: "100%",
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <Typography variant="h3" sx={{ fontWeight: "600" }}>
                    {item.name || "(no title)"}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      my: 1,
                      mb: 2,
                      fontWeight: "300",
                    }}
                  >
                    Quantity: {item.quantity || "(no quantity)"}
                  </Typography>
                  <div>
                    {[item.room, ...item.category].map((category: string) => {
                      return (
                        <Chip
                          key={Math.random().toString()}
                          label={category}
                          onClick={() => {
                            router.push("/items");
                            setDrawerState(false);
                          }}
                          sx={{
                            px: 2,
                            mr: 1,
                            mb: 2.5,
                            mt: -0.5,
                            textTransform: "capitalize",
                          }}
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
                        lastModified: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                      });
                      // Update item note
                      setItemData({
                        ...item,
                        note: e.target.value,
                      });
                      fetchApiWithoutHook("property/inventory/updateNote", {
                        id: id.toString(),
                        lastModified: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                        note: e.target.value,
                      });
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
                        background: `${
                          global.user.darkMode
                            ? "hsl(240, 11%, 24%)"
                            : colors[themeColor][100]
                        }!important`,
                        cursor: "pointer",
                        p: 2.5,
                        borderRadius: "15px",
                        display: "block",
                      },
                    }}
                    minRows={3}
                    spellCheck={false}
                    variant="filled"
                    defaultValue={item.note}
                    maxRows={4}
                    onFocus={(e) => {
                      e.target.placeholder = "SHIFT+ENTER for new lines";
                      e.target.spellcheck = true;
                    }}
                    disabled={global.property.role === "read-only"}
                    placeholder={
                      global.property.role !== "read-only"
                        ? "Click to add note"
                        : "You do not have permission to edit this item"
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    background: global.user.darkMode
                      ? "hsl(240, 11%, 25%)"
                      : colors[themeColor][100],
                    borderRadius: 5,
                    overflow: "hidden",
                  }}
                >
                  <Box sx={{}}>
                    {global.property.role !== "read-only" && (
                      <StarButton
                        styles={styles}
                        item={item}
                        handleItemStar={handleItemStar}
                      />
                    )}
                    {global.property.role !== "read-only" && (
                      <EditButton
                        styles={styles}
                        item={item}
                        setItemData={setItemData}
                      />
                    )}
                    {global.property.role !== "read-only" && (
                      <AddToListModal item={item} styles={styles} />
                    )}
                    {global.property.role !== "read-only" && (
                      <DeleteButton
                        styles={styles}
                        handleItemDelete={handleItemDelete}
                      />
                    )}
                    <MoveToRoom
                      styles={styles}
                      setDrawerState={setDrawerState}
                      item={item}
                      setDeleted={setDeleted}
                    />
                    <ShareModal
                      styles={styles}
                      title={item.name}
                      quantity={item.quantity}
                      room={item.room}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </SwipeableDrawer>

      {variant === "list" ? (
        <Collapse in={!deleted} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <SwipeableViews
            enableMouseEvents
            index={index}
            slideStyle={{
              borderRadius: "15px!important",
            }}
            disabled={global.property.role === "read-only"}
            onChangeIndex={(changedIndex) => {
              if (global.property.role !== "read-only") {
                setIndex(changedIndex);
                if (changedIndex === 2) {
                  handleItemDelete();
                  setTimeout(() => {
                    setDeleted(true);
                    setSwitchingToIndex(1);
                  }, 200);
                } else {
                  handleItemStar();
                  setTimeout(() => {
                    setIndex(1);
                    setSwitchingToIndex(1);
                  }, 200);
                }
              }
            }}
            onSwitching={(index) => {
              if (index > 1) {
                setSwitchingToIndex(2);
              } else if (index < 1) {
                setSwitchingToIndex(0);
              } else {
                setTimeout(() => setSwitchingToIndex(1), 200);
              }
            }}
          >
            {global.property.role !== "read-only" && (
              <Box
                sx={{
                  background: colors.orange[item.starred ? "900" : "100"],
                  width: "100%",
                  transition: "background .2s",
                  height: "100%",
                  color: item.starred ? "#fff" : "#000",
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
                  className={`animateIcon material-symbols-${
                    item.starred ? "rounded" : "outlined"
                  }`}
                >
                  star
                </span>
              </Box>
            )}
            <ListItemButton
              onContextMenu={handleContextMenu}
              onClick={() => setDrawerState(true)}
              disableRipple
              sx={{
                background: "rgba(200,200,200,.3)!important",
                pointerEvents: switchingToIndex == 1 ? "" : "none",
                py: 2,
                px: 3,
                borderRadius: 5,
                transition: "transform .2s",
                "&:active": {
                  transition: "none",
                  transform: "scale(.97)",
                  background: global.user.darkMode
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
                    {item.name}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography
                      gutterBottom
                      sx={{ fontWeight: "300", fontSize: "15px" }}
                    >
                      {dayjs(item.lastModified).fromNow()}
                    </Typography>
                    <Chip
                      sx={{ textTransform: "capitalize" }}
                      label={data.room}
                      size="small"
                    />
                    {item.category.map((category: string) => {
                      if (category.trim() === "") return false;
                      return (
                        <Chip
                          key={Math.random().toString()}
                          sx={{ pointerEvents: "none", mx: 0.5 }}
                          label={category}
                          size="small"
                        />
                      );
                    })}
                  </>
                }
              />
            </ListItemButton>
            {global.property.role !== "read-only" && (
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
            )}
          </SwipeableViews>
        </Collapse>
      ) : (
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
              background: `${
                global.user.darkMode
                  ? "hsl(240, 11%, 17%)"
                  : "rgba(200,200,200,.3)"
              }!important`,
              transition: "transform .2s",
              "&:active": {
                transform: "scale(0.98)",
                transition: "none",
              },
              ...(item.starred && {
                background: deepOrange[global.user.darkMode ? 900 : 50],
              }),
            }}
            onClick={() => setDrawerState(true)}
          >
            <SwipeableViews
              enableMouseEvents
              index={index}
              disabled={global.property.role === "read-only"}
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
                  background: colors.orange[item.starred ? "900" : "100"],
                  width: "100%",
                  transition: "background .2s",
                  height: "100%",
                  color: item.starred ? "#fff" : "#000",
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
                  className={`animateIcon material-symbols-${
                    item.starred ? "rounded" : "rounded"
                  }`}
                >
                  star
                </span>
              </Box>
              <CardActionArea
                disableRipple
                sx={{
                  transition: "none!important",
                  "&:focus-within": {
                    background: `${
                      global.user.darkMode
                        ? "hsl(240, 11%, 18%)"
                        : "rgba(200,200,200,.01)"
                    }!important`,
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
                    {item.name.substring(0, 18) || "(no title)"}
                    {item.name.length > 18 && "..."}
                  </Typography>
                  <Typography
                    sx={{
                      mb: 1,
                    }}
                  >
                    {!item.quantity.includes(" ") && "Quantity: "}
                    {displayRoom
                      ? data.room
                      : item.quantity.substring(0, 18) ||
                        "(no quantity specified)"}
                    {!displayRoom && item.quantity.length > 18 && "..."}
                  </Typography>
                  {!displayRoom &&
                    item.category.map((category: string) => {
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
      )}
    </>
  );
}
