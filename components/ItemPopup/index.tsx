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
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Head from "next/head";
import useWindowDimensions from "../../components/useWindowDimensions";
import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./EditButton";
import { ItemActionsMenu } from "./ItemActionsMenu";
import { StarButton } from "./StarButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { neutralizeBack, revivalBack } from "../history-control";

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

  const { width }: any = useWindowDimensions();

  useEffect(() => {
    document.documentElement.classList[drawerState ? "add" : "remove"](
      "prevent-scroll"
    );
    document
      .querySelector(`meta[name="theme-color"]`)!
      .setAttribute(
        "content",
        drawerState === true
          ? width > 900
            ? global.theme === "dark"
              ? "hsl(240, 11%, 5%)"
              : "#cccccc"
            : global.theme === "dark"
            ? "hsl(240, 11%, 20%)"
            : "#fff"
          : document.documentElement!.scrollTop === 0
          ? global.theme === "dark"
            ? "hsl(240, 11%, 10%)"
            : "#fff"
          : global.theme === "dark"
          ? "hsl(240, 11%, 20%)"
          : colors[global.themeColor]["100"]
      );
  }, [drawerState, width]);

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
          View
        </MenuItem>
      </Menu>
      <SwipeableDrawer
        sx={{
          opacity: "1!important",
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: { sm: 4 },
            overflow: "hidden!important",
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
              {global.session.user.houseName.replace(/./, (c) =>
                c.toUpperCase()
              )}{" "}
              &bull; Carbon
            </title>
          </Head>
        )}
        <Box
          sx={{
            flexGrow: 1,
            height: "100vh",
            position: "relative",
            width: {
              sm: "40vw",
              xs: "100vw",
            },
            maxWidth: "100vw",
          }}
        >
          <AppBar
            position="absolute"
            sx={{
              background:
                global.theme === "dark" ? "hsl(240, 11%, 20%)" : "#fff",
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
                          : colors[themeColor]["50"]) + "!important",
                      color:
                        global.theme === "dark" ? "hsl(240, 11%, 95%)" : "#000",
                    },
                  }}
                  onClick={() => setDrawerState(false)}
                >
                  <span className="material-symbols-rounded">chevron_left</span>
                </IconButton>
              </Tooltip>
              <Typography sx={{ flexGrow: 1 }}></Typography>
              <StarButton
                setLastUpdated={setLastUpdated}
                id={id}
                star={star}
                setStar={setStar}
              />
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
              <DeleteButton
                id={id}
                deleted={deleted}
                setOpen={() => toast.success("Deleted item")}
                setDrawerState={setDrawerState}
                setDeleted={setDeleted}
              />
              <ItemActionsMenu
                id={id}
                room={data.room}
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
            <Typography variant="h3" sx={{ fontWeight: "700" }}>
              {title || "(no title)"}
            </Typography>
            <Typography variant="h5">
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
                      token:
                        global.session &&
                        (global.session.user.SyncToken ||
                          global.session.accessToken),
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
              placeholder="Click to add note"
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
                  mb: 1,
                  boxShadow: 0,
                  display: "block",
                  width: "100%",
                  maxWidth: "calc(100vw - 20px)",
                  borderRadius: "28px",
                  background:
                    (global.theme === "dark"
                      ? "hsl(240, 11%, 20%)"
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
                          ? "hsl(240, 11%, 20%)"
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
