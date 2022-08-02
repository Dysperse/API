import LoadingButton from "@mui/lab/LoadingButton";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import * as colors from "@mui/material/colors";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DialogTitle from "@mui/material/DialogTitle";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { useFormik } from "formik";
import React from "react";
import toast from "react-hot-toast";
import { AutocompleteData } from "../AutocompleteData";
import { neutralizeBack, revivalBack } from "../history-control";
import { Puller } from "../Puller";
import { cards } from "./cards";

function shuffle(array: Array<any>) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export function CreateItemModal({
  alias,
  toggleDrawer,
  room,
  children,
}: {
  alias?: string;
  toggleDrawer: Function;
  room: string;
  children: any;
}) {
  const [open, setOpen] = React.useState<boolean>(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  React.useEffect(() => {
    const timer = setTimeout(() => {
      open && document.getElementById("nameInput")!.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, [open]);

  React.useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });
  React.useEffect(() => {
    document.documentElement.classList[open ? "add" : "remove"](
      "prevent-scroll"
    );
    document
      .querySelector(`meta[name="theme-color"]`)!
      .setAttribute(
        "content",
        open
          ? global.theme === "dark"
            ? "hsl(240, 11%, 5%)"
            : colors[themeColor][50]
          : global.theme === "dark"
          ? "hsl(240, 11%, 10%)"
          : "#fff"
      );
  }, [open]);
  const [loading, setLoading] = React.useState<boolean>(false);

  function setClickLoading() {
    setLoading(true);
  }

  const formik = useFormik({
    initialValues: {
      categories: [],
      title: "",
      quantity: "",
    },
    onSubmit: async (values: {
      categories: Array<string>;
      title: string;
      quantity: string;
    }) => {
      fetch(
        "/api/inventory/create?" +
          new URLSearchParams({
            token:
              global.session &&
              (global.session.user.SyncToken || global.session.accessToken),
            room: room.toString().toLowerCase(),
            name: values.title,
            qty: values.quantity,
            category: JSON.stringify(values.categories),
            lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          }),
        {
          method: "POST",
        }
      )
        .then((res) => res.json())
        .then(() => {
          toast("Created item!");
          setLoading(false);
          setOpen(false);
          formik.resetForm();
          if (global.setUpdateBanner) {
            global.setUpdateBanner(room.toString().toLowerCase());
          }
        });
    },
  });

  const handleChipClick = (e) => {
    formik.setFieldValue(
      "quantity",
      formik.values.quantity + " " + e.target.innerText
    );
  };
  const originalCards = shuffle(cards);
  const [filteredCards, setFilteredCards] =
    React.useState<Array<any>>(originalCards);

  return (
    <div>
      <div onClick={handleClickOpen}>{children}</div>
      <SwipeableDrawer
        anchor="bottom"
        swipeAreaWidth={0}
        disableSwipeToOpen={true}
        PaperProps={{
          elevation: 0,
          sx: {
            background: colors[themeColor][50],
            width: {
              sm: "90vw",
              md: "50vw",
            },
            maxWidth: "600px",
            maxHeight: "100vh",
            borderRadius: { sm: "30px 30px 0 0" },
            mx: "auto",
            ...(global.theme === "dark" && {
              background: "hsl(240, 11%, 25%)",
            }),
          },
        }}
        open={open}
        onClose={handleClose}
        onOpen={() => setOpen(true)}
      >
        <Box
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
          }}
        >
          <Puller />
        </Box>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle
            sx={{
              display: "flex",
              textAlign: "center",
              fontWeight: "600",
              alignItems: "center",
              textTransform: "capitalize",
            }}
          >
            <IconButton
              size="large"
              onClick={handleClose}
              sx={{
                mr: "auto",
                opacity: { sm: "0" },
                pointerEvents: { sm: "none" },
                color: "#000",
                transition: "none",
                "&:active": {
                  background: colors[themeColor][100] + "!important",
                },
              }}
              disableRipple
            >
              <span className="material-symbols-rounded">close</span>
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: "600" }}>
              {alias ?? room}
            </Typography>
            <IconButton
              size="large"
              onClick={() => document.getElementById("submitItem")!.click()}
              sx={{
                ml: "auto",
                opacity: { sm: "0" },
                pointerEvents: { sm: "none" },
                color: "#000",
                transition: "none",
                "&:active": {
                  background: colors[themeColor][100] + "!important",
                },
              }}
              disableRipple
            >
              <span className="material-symbols-rounded">check</span>
            </IconButton>
          </DialogTitle>
          <DialogContent
            sx={{
              height: { xs: "100vh", sm: "auto" },
              pb: { xs: 20, sm: 0 },
            }}
          >
            <TextField
              autoFocus
              margin="dense"
              label="Item name"
              fullWidth
              autoComplete={"off"}
              onChange={(e) => {
                formik.setFieldValue("title", e.target.value);
                setFilteredCards(
                  originalCards.filter((card) =>
                    card.name
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase())
                  )
                );
              }}
              value={formik.values.title}
              disabled={loading}
              name="title"
              id="nameInput"
              variant="filled"
            />
            <Box
              sx={{
                width: "100%",
                whiteSpace: "nowrap",
                "& *": {
                  overscrollBehavior: "auto!important",
                },
                overscrollBehavior: "auto!important",
                overflowX: "scroll",
                overflowY: "visible",
                my: 2,
              }}
            >
              {filteredCards.map((item, i) => (
                <Box
                  key={i}
                  onClick={() => {
                    formik.setFieldValue("title", item.name);
                    formik.setFieldValue("categories", item.tags);
                    formik.setFieldValue("quantity", 1);
                  }}
                  sx={{
                    userSelect: "none",
                    display: "inline-block",
                    width: "175px",
                    overflow: "hidden",
                    height: "150px",
                    background: "rgba(0,0,0,0.1)",
                    transition: "transform .2s",
                    "&:active": {
                      transform: "scale(.95)",
                      transition: "none",
                      background: "rgba(0,0,0,0.15)",
                    },
                    cursor: "pointer",
                    mr: 2,
                    borderRadius: 6,
                  }}
                >
                  <Box
                    sx={{
                      height: "80px",
                      background: "rgba(0,0,0,0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{ fontSize: "30px" }}
                      className="material-symbols-rounded"
                    >
                      {item.icon}
                    </span>
                  </Box>
                  <Box
                    sx={{
                      height: "70px",
                      display: "flex",
                      alignItems: "center",
                      px: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="body2">Add</Typography>
                      <Typography sx={{ fontWeight: "700" }}>
                        {item.name}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
            <Autocomplete
              id="categories"
              multiple
              freeSolo
              disabled={loading}
              options={AutocompleteData}
              onChange={(e, newValue) =>
                formik.setFieldValue("categories", newValue)
              }
              value={formik.values.categories}
              renderInput={(params) => (
                <TextField
                  margin="dense"
                  label="Tags"
                  name="categories"
                  variant="filled"
                  {...params}
                />
              )}
            />
            <TextField
              margin="dense"
              label="Quantity"
              autoComplete={"off"}
              fullWidth
              onChange={formik.handleChange}
              value={formik.values.quantity}
              disabled={loading}
              name="quantity"
              variant="filled"
            />
            <DialogActions
              sx={{
                position: { xs: "fixed", sm: "unset" },
                bottom: 0,
                left: 0,
                p: 1,
                width: "100%",
                background: colors[themeColor][50],
                zIndex: 99,
                display: {
                  xs: "none",
                  sm: "unset",
                },
              }}
            >
              <LoadingButton
                disableElevation
                sx={{
                  float: "right",
                  borderRadius: 100,
                  m: 1,
                  mr: 0,
                }}
                size="large"
                variant="contained"
                color="primary"
                type="submit"
                id="submitItem"
                loading={loading}
                onClick={() => setTimeout(setClickLoading, 10)}
              >
                Create
              </LoadingButton>
            </DialogActions>
          </DialogContent>
        </form>
      </SwipeableDrawer>
    </div>
  );
}
