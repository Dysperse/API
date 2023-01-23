import type { Item as ItemType } from "@prisma/client";
import dayjs from "dayjs";
import useEmblaCarousel from "embla-carousel-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { useStatusBar } from "../../hooks/useStatusBar";
import { colors } from "../../lib/colors";
import { Puller } from "../Puller";
import { AddToListModal } from "./AddToList";
import { CategoryModal } from "./CategoryModal";
import { DeleteButton } from "./DeleteButton";
import { MoveToRoom } from "./MoveToRoom";
import { ShareModal } from "./ShareModal";
import { StarButton } from "./StarButton";

import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Collapse,
  Grid,
  Icon,
  Menu,
  MenuItem,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";

/**
 * Item popup
 * @param {boolean} displayRoom - Display the room name?
 * @param {any} data - Item data
 * @param {variant} variant - The variant of the trigger
 */

const Item = React.memo(function Item({
  displayRoom = false,
  data,
}: {
  displayRoom?: boolean;
  data: ItemType;
}) {
  const router = useRouter();
  const id = data.id;
  const [drawerState, setDrawerState] = useState(false);
  const [item, setItemData] = useState(data);
  const [deleted, setDeleted] = useState<boolean>(false);
  useEffect(() => {
    drawerState ? neutralizeBack(() => setDrawerState(false)) : revivalBack();
  });

  useStatusBar(drawerState);

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
        : null
    );
  };

  /**
   * Closes the popup
   * @returns void
   */
  const handleClose = () => {
    setContextMenu(null);
  };

  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: 1,
  });

  emblaApi?.on("select", () => {
    setDrawerState(false);
    handleItemDelete();
  });

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
    setDrawerState(false);

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
            fetchApiWithoutHook("property/inventory/restore", {
              id: item.id.toString(),
              lastModified: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            });
            setDeleted(false);
            // Set embla slide to 1
            emblaApi?.scrollTo(1);
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
          sx: {
            maxHeight: "90vh",
            maxWidth: "800px",
          },
        }}
        swipeAreaWidth={0}
        anchor="bottom"
        open={drawerState}
        onClose={() => setDrawerState(false)}
        onOpen={() => setDrawerState(true)}
      >
        <Box
          sx={{
            flexGrow: 1,
            height: "100%",
            position: "relative",

            overflowY: "scroll!important",
            background: `${colors[themeColor][50]}!important`,
            ...(global.user.darkMode && {
              background: "hsl(240, 11%, 15%)",
            }),
            maxWidth: "100vw",
          }}
        >
          <Puller />
          <Box sx={{ p: 5 }}>
            <Grid container spacing={5}>
              <Grid
                item
                xs={12}
                sm={6}
                xl={7}
                sx={{
                  width: "100%",
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <TextField
                    defaultValue={item.name || "(no title)"}
                    variant="standard"
                    // multiline
                    onKeyDown={(e: any) => {
                      if (e.key == "Enter") e.target.blur();
                    }}
                    onBlur={(e: any) => {
                      setItemData({
                        ...item,
                        name: e.target.value,
                      });
                      fetchApiWithoutHook("property/inventory/edit", {
                        name: item.name,
                        id: item.id,
                      });
                    }}
                    placeholder="(no title)"
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        background: `${
                          global.user.darkMode
                            ? "hsl(240, 11%, 15%)"
                            : colors[themeColor][50]
                        }!important`,
                        fontWeight: "600",
                        fontSize: "30px",
                        textDecoration: "underline",
                        textAlign: "right!important",
                        borderRadius: "15px",
                        display: "block",
                      },
                    }}
                  />
                  <TextField
                    defaultValue={item.quantity}
                    variant="standard"
                    id="quantity"
                    onChange={(e) => {
                      setItemData({
                        ...item,
                        quantity: e.target.value,
                      });
                    }}
                    placeholder="Click to add quantity"
                    sx={{
                      mb: 2,
                    }}
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        borderRadius: "15px",
                        py: 0,
                        "& *::placeholder": {
                          color: global.user.darkMode
                            ? "hsl(240, 11%, 60%)"
                            : colors[themeColor][800],
                        },
                        color: global.user.darkMode
                          ? "hsl(240, 11%, 90%)"
                          : colors[themeColor][900],
                        ...(item.quantity !== "" && {
                          textDecoration: "underline",
                        }),
                        fontWeight: "500",
                        maxWidth: "250px",
                        display: "block",
                      },
                    }}
                  />
                  <div
                    style={{
                      maxWidth: "100%",
                      overflowX: "auto",
                      overflowY: "visible",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {[
                      displayRoom ? item.room : undefined,
                      ...JSON.parse(item.category),
                    ]
                      .filter((category) => category)
                      .map((category: string) => {
                        return (
                          <Chip
                            key={Math.random().toString()}
                            label={category}
                            onClick={() => {
                              router.push("/items");
                              setDrawerState(false);
                            }}
                            sx={{
                              background: global.user.darkMode
                                ? "hsl(240,11%,20%)"
                                : `${colors[themeColor][100]}!important`,
                              "&:hover": {
                                background: global.user.darkMode
                                  ? "hsl(240,11%,25%)"
                                  : `${colors[themeColor][200]}!important`,
                              },
                              transition: "none",
                              px: 1.5,
                              mr: 1,
                              mb: 2.5,
                              textTransform: "capitalize",
                            }}
                          />
                        );
                      })}

                    <CategoryModal setItemData={setItemData} item={item} />
                  </div>
                  <TextField
                    multiline
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
                        "& *::placeholder": {
                          color: global.user.darkMode
                            ? "hsl(240, 11%, 24%)"
                            : colors[themeColor][700],
                        },
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
                    onKeyDown={(e: any) => {
                      if (e.key == "Enter") e.target.blur();
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
                    disabled={global.permission === "read-only"}
                    placeholder={
                      global.permission !== "read-only"
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
                    mt: { xs: -2.5, sm: 0 },
                    overflow: "hidden",
                  }}
                >
                  <>
                    {global.property.role !== "read-only" && (
                      <StarButton
                        styles={styles}
                        item={item}
                        handleItemStar={handleItemStar}
                      />
                    )}

                    {global.property.role !== "read-only" && (
                      <MoveToRoom
                        room={data.room}
                        styles={styles}
                        setDrawerState={setDrawerState}
                        item={item}
                        setDeleted={setDeleted}
                      />
                    )}
                    <ShareModal
                      styles={styles}
                      title={item.name}
                      quantity={item.quantity}
                      room={item.room}
                    />

                    {global.property.role !== "read-only" && (
                      <AddToListModal item={item} styles={styles} />
                    )}

                    {global.property.role !== "read-only" && (
                      <DeleteButton
                        styles={styles}
                        handleItemDelete={handleItemDelete}
                      />
                    )}
                  </>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </SwipeableDrawer>
      <Collapse in={!deleted} sx={{ borderRadius: 5 }}>
        <Card
          sx={{
            boxShadow: "0",
            display: "block",
            my: { sm: 1 },
            width: "100%",
            maxWidth: "calc(100vw - 32.5px)",
            userSelect: "none",
            borderRadius: 5,
            color: global.user.darkMode ? "hsl(240,11%,80%)" : "#303030",
            background: `${
              global.user.darkMode
                ? "hsl(240, 11%, 17%)"
                : "rgba(200,200,200,.3)"
            }!important`,
            "&:hover": {
              color: global.user.darkMode ? "hsl(240,11%,90%)" : "#000",
              background: `${
                global.user.darkMode
                  ? "hsl(240, 11%, 17%)"
                  : "rgba(200,200,200,.4)"
              }!important`,
            },
            "&:active": {
              color: global.user.darkMode ? "hsl(240,11%,95%)" : "#000",
              background: `${
                global.user.darkMode
                  ? "hsl(240, 11%, 17%)"
                  : "rgba(200,200,200,.6)"
              }!important`,
            },

            transition: "transform .2s",
            mb: { xs: 2, sm: 0 },
            ...(item.starred && {
              background: colors.orange[50],
            }),
            "& *:not(.MuiTouchRipple-root *, .override *)": {
              background: "transparent",
            },
          }}
        >
          <div className="embla" ref={emblaRef}>
            <div className="embla__container">
              <Box
                sx={{
                  display: "flex",
                  flex: "0 0 100%",
                  flexGrow: 1,
                  alignItems: "center",
                  borderRadius: 5,
                  mr: 0.5,
                  justifyContent: "end",
                  px: 2,
                  color: "#fff",
                  background: colors.red[900] + "!important",
                }}
              >
                <Icon>delete</Icon>
              </Box>
              <CardActionArea
                disableRipple
                onContextMenu={handleContextMenu}
                onClick={() => setDrawerState(true)}
                sx={{
                  flex: "0 0 100%",
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
                <CardContent sx={{ px: 3, py: 2 }}>
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
                                disabled={global.permission === "read-only"}
                                size="small"
                                key={Math.random().toString()}
                                label={category}
                                sx={{
                                  pointerEvents: "none",
                                  px: 1.5,
                                  mr: 1,
                                  mb: 1,
                                  color: "inherit",
                                  background: "rgba(200,200,200,.3)",
                                  textTransform: "capitalize",
                                }}
                              />
                            );
                          }
                        )}
                      </div>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{ ml: "auto", flexShrink: 0 }}
                    >
                      {displayRoom
                        ? data.room
                        : item.quantity.substring(0, 18) || ""}
                      {!displayRoom && item.quantity.length > 18 && "..."}
                      {!item.quantity ||
                        (!item.quantity.includes(" ") && " pcs.")}
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </div>
          </div>
        </Card>
      </Collapse>
    </>
  );
});
export default Item;
