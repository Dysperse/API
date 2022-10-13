import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import type { ListItem as Item } from "@prisma/client";
import { useFormik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import { colors } from "../../lib/colors";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { Puller } from "../Puller";

/**
 * Create list modal
 * @param children Children
 * @param parent Parent
 * @param items Items
 * @param setItems Set items
 */
export function CreateListModal({
  children,
  parent,
  items,
  setItems,
}: {
  children: JSX.Element;
  parent: string | number;
  items: Item[];
  setItems: (items: Item[]) => void;
}) {
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
      fetchApiWithoutHook("property/lists/createItem", {
        list: parent,
        name: values.name,
        details: values.details,
        pinned: pinned ? "true" : "false",
      })
        .then((res) => {
          setItems([...items, res]);
          formik.resetForm();
          setLoading(false);
          setOpen(false);
          toast("Created item!");
          setShowDetails(false);
        })
        .catch(() => setLoading(false));
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
            borderRadius: "20px 20px 0 0",
            mx: "auto",
            ...(global.user.darkMode && {
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
          <DialogContent sx={{ pt: 0, mt: -1 }}>
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
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <Box sx={{ ml: -1 }}>
                <IconButton
                  disableRipple
                  sx={{
                    borderRadius: 4,
                    mr: 0.5,
                    transition: "none",
                    color: global.user.darkMode
                      ? "#fff"
                      : colors[themeColor]["800"],
                    ...(pinned && {
                      background: `${
                        colors[themeColor][global.user.darkMode ? "900" : "200"]
                      }!important`,
                    }),
                    "&:active": { background: "rgba(0,0,0,0.1)!important" },
                  }}
                  onClick={() => setPinned(!pinned)}
                >
                  <span
                    style={{ transform: "rotate(-45deg)" }}
                    className={`material-symbols-${
                      pinned ? "rounded" : "outlined"
                    }`}
                  >
                    push_pin
                  </span>
                </IconButton>
                <IconButton
                  disableRipple
                  sx={{
                    borderRadius: 4,
                    color: global.user.darkMode
                      ? "#fff"
                      : colors[themeColor]["800"],
                    transition: "none",
                    ...(showDetails && {
                      background: `${
                        colors[themeColor][global.user.darkMode ? "900" : "200"]
                      }!important`,
                    }),
                    "&:active": { background: "rgba(0,0,0,0.1)!important" },
                  }}
                  onClick={() => {
                    setShowDetails(true);
                    setTimeout(
                      () =>
                        document
                          .getElementById(!showDetails ? "details" : "title")
                          ?.focus(),
                      0
                    );
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
                Create
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
