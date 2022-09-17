import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import { colors } from "../../lib/colors";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { neutralizeBack, revivalBack } from "../history-control";
import { Puller } from "../Puller";

/**
 * Create list modal
 * @param children Children
 * @param parent Parent
 * @param items Items
 * @param setItems Set items
 */
export function CreateListModal({ children, parent, items, setItems }: any) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [customParent, setCustomParent] = useState(parent);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [pinned, setPinned] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      details: "",
    },
    onSubmit: (values: { name: string; details: string }) => {
      setLoading(true);
      fetch(
        "/api/property/lists/createItem?" +
          new URLSearchParams({
            property: global.property.propertyId,
            accessToken: global.property.accessToken,
            list: customParent,
            name: values.name,
            details: values.details,
            pinned: pinned ? "true" : "false",
          }).toString(),
        {
          method: "POST",
        }
      )
        .then((res) => res.json())
        .then((res) => {
          setItems([...items, res]);
          formik.resetForm();
          setLoading(false);
          setOpen(false);
          toast("Created item!");
          setShowDetails(false);
        })
        .catch((err: any) => alert(JSON.stringify(err)));
    },
  });

  React.useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        swipeAreaWidth={0}
        id="create-list-modal"
        ModalProps={{
          keepMounted: true,
        }}
        disableSwipeToOpen
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
        onClose={() => {
          setOpen(false);
        }}
        onOpen={() => setOpen(true)}
      >
        <Puller />
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              margin="dense"
              required
              fullWidth
              placeholder={customParent === "-1" ? "New task" : "Item name"}
              autoComplete="off"
              name="name"
              id="title"
              onChange={formik.handleChange}
              value={formik.values.name}
              InputProps={{
                disableUnderline: true,
                sx: {
                  borderRadius: "20px",
                  border: "0!important",
                },
              }}
              variant="standard"
            />
            <Collapse in={showDetails}>
              <TextField
                margin="dense"
                fullWidth
                placeholder={"Add details"}
                autoComplete="off"
                name="details"
                id="details"
                onChange={formik.handleChange}
                value={formik.values.details}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    mt: -1,
                    fontSize: "14px",
                    borderRadius: "20px",
                    border: "0!important",
                  },
                }}
                variant="standard"
              />
            </Collapse>
            {customParent === "-1" &&
              (formik.values.name.toLowerCase().includes("get ") ||
                formik.values.name.toLowerCase().includes("buy ") ||
                formik.values.name.toLowerCase().includes("bring ") ||
                formik.values.name.toLowerCase().includes("shop ")) && (
                <Button
                  variant="outlined"
                  sx={{ borderWidth: "2px!important" }}
                  size="small"
                  onClick={() => setCustomParent("-2")}
                >
                  Add this to your shopping list instead?
                </Button>
              )}
            {customParent === "-2" &&
              (formik.values.name.toLowerCase().includes("pay ") ||
                formik.values.name.toLowerCase().includes("fix ") ||
                formik.values.name.toLowerCase().includes("throw ")) && (
                <Button
                  variant="outlined"
                  sx={{ borderWidth: "2px!important" }}
                  size="small"
                  onClick={() => setCustomParent("-1")}
                >
                  Add this to your to do list instead?
                </Button>
              )}
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <Box sx={{ ml: -1 }}>
                <IconButton
                  disableRipple
                  sx={{
                    borderRadius: 4,
                    mr: 0.5,
                    transition: "none",
                    color:
                      global.theme == "dark"
                        ? "#fff"
                        : colors[themeColor]["800"],
                    ...(pinned && {
                      background:
                        colors[themeColor][
                          global.theme == "dark" ? "900" : "200"
                        ] + "!important",
                    }),
                    "&:active": { background: "rgba(0,0,0,0.1)!important" },
                  }}
                  onClick={() => setPinned(!pinned)}
                >
                  <span
                    style={{ transform: "rotate(-45deg)" }}
                    className={
                      "material-symbols-" + (pinned ? "rounded" : "outlined")
                    }
                  >
                    push_pin
                  </span>
                </IconButton>
                <IconButton
                  disableRipple
                  sx={{
                    borderRadius: 4,
                    color:
                      global.theme == "dark"
                        ? "#fff"
                        : colors[themeColor]["800"],
                    transition: "none",
                    ...(showDetails && {
                      background:
                        colors[themeColor][
                          global.theme == "dark" ? "900" : "200"
                        ] + "!important",
                    }),
                    "&:active": { background: "rgba(0,0,0,0.1)!important" },
                  }}
                  onClick={() => {
                    setShowDetails(true);
                    setTimeout(() => {
                      document
                        .getElementById(!showDetails ? "details" : "title")!
                        .focus();
                    }, 0);
                  }}
                >
                  <span className="material-symbols-outlined">notes</span>
                </IconButton>
              </Box>
              <LoadingButton
                size="large"
                disableElevation
                sx={{
                  ml: "auto",
                  borderRadius: 4,
                }}
                color="primary"
                type="submit"
                loading={loading}
              >
                Save
              </LoadingButton>
            </Box>
          </DialogContent>
        </form>
      </SwipeableDrawer>
      <Box
        onClick={() => {
          setOpen(true);
          setCustomParent(parent);
        }}
      >
        {children}
      </Box>
    </>
  );
}
