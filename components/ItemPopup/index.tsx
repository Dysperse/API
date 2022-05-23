import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import * as colors from "@mui/material/colors";
import { blueGrey, orange } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";
// import Button from "@mui/material/Button";
import ListItemText from "@mui/material/ListItemText";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useWindowDimensions from "../../components/useWindowDimensions";
import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./EditButton";
import { ItemActionsMenu } from "./ItemActionsMenu";
import { StarButton } from "./StarButton";

export default function Item({ displayRoom = false, data, variant }: any) {
  const [itemData] = useState(data);
  const id = data.id;
  const [title, setTitle] = useState(data.title);
  const [quantity, setQuantity] = useState(data.amount);
  const [star, setStar] = useState(parseInt(itemData.star, 10));
  const [deleted, setDeleted] = useState(false);
  const [categories, setCategories] = useState(data.categories);
  const [note, setNote] = useState(data.note);
  const [lastUpdated, setLastUpdated] = useState(data.lastUpdated);
  const [drawerState, setDrawerState] = useState(false);

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
              ? "#101010"
              : "#808080"
            : global.theme === "dark"
            ? "#353535"
            : "#fff"
          : document.documentElement!.scrollTop === 0
          ? "#fff"
          : colors[global.themeColor]["100"]
      );
  }, [drawerState, width]);

  return (
    <>
      <SwipeableDrawer
        sx={{
          opacity: "1!important"
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: { sm: 4 },
            overflow: "hidden!important",
            mt: { sm: "10px" },
            mr: { sm: "10px" },
            height: { sm: "calc(100vh - 20px)!important" }
          }
        }}
        swipeAreaWidth={0}
        anchor="right"
        open={drawerState}
        onClose={() => setDrawerState(false)}
        onOpen={() => setDrawerState(true)}
      >
        <Box
          sx={{
            flexGrow: 1,
            height: "100vh",
            position: "relative",
            width: {
              sm: "40vw",
              xs: "100vw"
            }
          }}
        >
          <AppBar
            position="absolute"
            sx={{
              background: global.theme === "dark" ? "#353535" : "#fff",
              py: 1,
              color: global.theme === "dark" ? "#fff" : "#000"
            }}
            elevation={0}
          >
            <Toolbar>
              <Tooltip title="Back">
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={() => setDrawerState(false)}
                >
                  <ChevronLeftIcon />
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
              gap: 2
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: "600" }}>
              {title || "(no title)"}
            </Typography>
            <Typography variant="h4">{quantity || "(no quantity)"}</Typography>
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
                fetch("https://api.smartlist.tech/v2/items/update-note/", {
                  method: "POST",
                  body: new URLSearchParams({
                    token: global.session
                      ? global.session.accessToken
                      : undefined,
                    id: id.toString(),
                    date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    content: e.target.value
                  })
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
                  px: 2.5,
                  py: 1.5,
                  borderRadius: "15px"
                }
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
              onClick={() => setDrawerState(true)}
              sx={{ py: 0.1, borderRadius: "10px", transition: "all .03s" }}
            >
              <ListItemText
                primary={title}
                secondary={dayjs(lastUpdated).fromNow()}
              />
            </ListItemButton>
          </Collapse>
        ) : (
          <>
            {!deleted && (
              <Card
                sx={{
                  mb: 1,
                  boxShadow: 0,
                  display: "block",
                  width: "100%",
                  maxWidth: "calc(100vw - 20px)",
                  borderRadius: "28px",
                  background: global.theme === "dark" ? blueGrey[900] : "#eee",
                  transition: "all .03s",
                  ...(star === 1 && {
                    background: orange[700],
                    color: "white"
                  })
                }}
                onClick={() => setDrawerState(true)}
              >
                <CardActionArea>
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        display: "block",
                        mb: 1
                      }}
                    >
                      {title.substring(0, 18) || "(no title)"}
                      {title.length > 18 && "..."}
                    </Typography>
                    <Typography
                      sx={{
                        mb: 1
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
