import LoadingButton from "@mui/lab/LoadingButton";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import * as colors from "@mui/material/colors";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
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
              sm: "50vw",
            },
            maxWidth: "600px",
            maxHeight: "80vh",
            borderRadius: "30px 30px 0 0",
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
        <Puller />
        <DialogTitle
          sx={{
            mt: 2,
            textAlign: "center",
            fontWeight: "600",
            textTransform: "capitalize",
          }}
        >
          {alias ?? room}
        </DialogTitle>
        <DialogContent
          sx={{
            height: { xs: "400px", sm: "auto" },
            pb: { xs: 10, sm: 0 },
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              label="Item name"
              fullWidth
              autoComplete={"off"}
              onChange={formik.handleChange}
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
                overflow: "scroll",
                my: 2,
              }}
            >
              {[
                {
                  name: "Microwave",
                  icon: "microwave_gen",
                },
                {
                  name: "Oven",
                  icon: "oven_gen",
                },
                {
                  name: "Diswasher",
                  icon: "dishwasher_gen",
                },
                {
                  name: "Fridge",
                  icon: "kitchen",
                },
                {
                  name: "Kettle",
                  icon: "kettle",
                },
                {
                  name: "Blender",
                  icon: "blender",
                },
                {
                  name: "Sink",
                  icon: "faucet",
                },
                {
                  name: "Range hood",
                  icon: "range_hood",
                },
              ].map((item, i) => (
                <Box
                  key={i}
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
                formik.setFieldValue(
                  "categories",
                  newValue.filter((e) => e !== "Kitchen")
                )
              }
              value={["Kitchen", ...formik.values.categories]}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option: any, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    disabled={option === "Kitchen"}
                    sx={{
                      opacity: "1!important",
                      "&.Mui-disabled": {
                        fontWeight: "700!important",
                      },
                      "&.Mui-disabled *:not(.MuiChip-label)": {
                        display: "none!important",
                      },
                    }}
                  />
                ))
              }
              sx={{
                "& *": {
                  border: "0!important",
                },
                "& input": {
                  background: "rgba(200,200,200,.4)",
                  borderRadius: 4,
                  px: "15px!important",
                  fontSize: "15px!important",
                },
              }}
              renderInput={(params) => (
                <TextField
                  margin="dense"
                  placeholder="+ Add up to 5 tags"
                  name="categories"
                  variant="standard"
                  sx={{
                    outline: "none",
                    border: "none!important",
                  }}
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
                width: "100%",
                background: colors[themeColor][50],
                zIndex: 99,
              }}
            >
              <LoadingButton
                disableElevation
                sx={{
                  ml: 1,
                  mt: 2,
                  float: "right",
                  borderRadius: 100,
                }}
                size="large"
                variant="contained"
                color="primary"
                type="submit"
                loading={loading}
                onClick={() => setTimeout(setClickLoading, 10)}
              >
                Create
              </LoadingButton>
            </DialogActions>
          </form>
        </DialogContent>
      </SwipeableDrawer>
    </div>
  );
}
