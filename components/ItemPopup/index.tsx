import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { Item as ItemType } from "@prisma/client";
import dayjs from "dayjs";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
      lastModified: new Date(dayjs().format("YYYY-MM-DD HH:mm:ss")),
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
  /**
   * Callback for note key press
   * @param {React.KeyboardEvent} event
   */

  const handleUpdateNote = (e: React.KeyboardEvent) => {
    const target: HTMLInputElement = e.target as HTMLInputElement;

    if (e.code === "Enter" && !e.shiftKey) {
      e.preventDefault();
      target.value = target.value.trim();
      target.blur();
    }
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
            width: {
              xs: "100vw",
              sm: "95vw",
              md: "80vw",
              lg: "70vw",
              xl: "60vw",
            },
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
            borderRadius: "20px 20px 0 0",
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
                xl={7}
                sx={{
                  alignItems: "center",
                  display: "flex",
                  width: "100%",
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <TextField
                    value={item.name || "(no title)"}
                    sx={{
                      mb: 2,
                    }}
                    variant="standard"
                    onChange={(e) => {
                      // alert(e.target.value);
                    }}
                    multiline
                    fullWidth
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        background: `${
                          global.user.darkMode
                            ? "hsl(240, 11%, 24%)"
                            : colors[themeColor][100]
                        }!important`,
                        p: 2,
                        fontWeight: "600",
                        fontSize: "20px",
                        textDecoration: "underline",
                        textAlign: "right!important",
                        borderRadius: "15px",
                        display: "block",
                      },
                    }}
                  />
                  <div>
                    {[item.room, ...JSON.parse(item.category)].map(
                      (category: string) => {
                        return (
                          <Chip
                            size="small"
                            key={Math.random().toString()}
                            label={category}
                            onClick={() => {
                              router.push("/items");
                              setDrawerState(false);
                            }}
                            sx={{
                              px: 1.5,
                              mr: 1,
                              mb: 2.5,
                              mt: -0.5,
                              textTransform: "capitalize",
                            }}
                          />
                        );
                      }
                    )}
                  </div>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 3,
                      mb: 2,
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        my: 1,
                        mb: 2,
                        fontWeight: "300",
                      }}
                    >
                      Quantity
                    </Typography>
                    <Box sx={{ ml: "auto" }}>
                      <TextField
                        value={item.quantity}
                        variant="standard"
                        onChange={(e) => {
                          // alert(e.target.value);
                        }}
                        multiline
                        fullWidth
                        InputProps={{
                          disableUnderline: true,
                          sx: {
                            background: `${
                              global.user.darkMode
                                ? "hsl(240, 11%, 24%)"
                                : colors[themeColor][100]
                            }!important`,
                            p: 2,
                            textAlign: "right!important",
                            maxWidth: "100px",
                            borderRadius: "15px",
                            display: "block",
                          },
                        }}
                      />
                    </Box>
                  </Box>
                  <TextField
                    multiline
                    fullWidth
                    onBlur={(e) => {
                      e.target.placeholder = "Click to add note";
                      e.target.spellcheck = false;
                      setItemData({
                        ...item,
                        lastModified: new Date(
                          dayjs().format("YYYY-MM-DD HH:mm:ss")
                        ),
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
                    onKeyUp={handleUpdateNote}
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
              <Grid item xs={12} sm={6} xl={5}>
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
                      room={data.room}
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
      <Collapse in={!deleted} sx={{ borderRadius: 5 }}>
        <Card
          onContextMenu={handleContextMenu}
          sx={{
            boxShadow: "0",
            display: "block",
            my: 1,
            width: "100%",
            maxWidth: "calc(100vw - 32.5px)",
            borderRadius: 5,
            background: {
              xs: "transparent",
              sm: `${
                global.user.darkMode
                  ? "hsl(240, 11%, 17%)"
                  : "rgba(200,200,200,.25)"
              }!important`,
            },
            transition: "transform .2s",
            border: "2px solid transparent",
            ...(item.starred && {
              background: colors.orange["50"],
              borderColor: colors.orange[global.user.darkMode ? 50 : 300],
            }),
            "& *:not(.MuiTouchRipple-root *, .override *)": {
              background: "transparent",
            },
          }}
          onClick={() => setDrawerState(true)}
        >
          <CardActionArea
            sx={{
              transition: "none!important",
              "&:focus-within": {
                background: "transparent!important",
              },
              background: "transparent!important",
              borderRadius: 5,
              "&:active": {
                transition: "none",
                boxShadow: "none!important",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      display: "block",
                    }}
                  >
                    {item.name.substring(0, 18) || "(no title)"}
                    {item.name.length > 18 && "..."}
                  </Typography>
                  <div className="override">
                    {[item.room, ...JSON.parse(item.category)].map(
                      (category: string) => {
                        return (
                          <Chip
                            size="small"
                            key={Math.random().toString()}
                            label={category}
                            sx={{
                              px: 1.5,
                              mr: 1,
                              mb: 2.5,
                              mt: -0.5,
                              textTransform: "capitalize",
                            }}
                          />
                        );
                      }
                    )}
                  </div>
                </Box>
                <Typography variant="body1" sx={{ ml: "auto" }}>
                  {!item.quantity ||
                    (!item.quantity.includes(" ") && "Quantity: ")}
                  {displayRoom
                    ? data.room
                    : item.quantity.substring(0, 18) || ""}
                  {!displayRoom && item.quantity.length > 18 && "..."}
                </Typography>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      </Collapse>
    </>
  );
}
