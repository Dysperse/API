import type { Item } from "@prisma/client";
import dayjs from "dayjs";
import { useFormik } from "formik";
import React from "react";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { colors } from "../../lib/colors";
import { Puller } from "../Puller";

import {
  Autocomplete,
  Box,
  Button,
  DialogContent,
  ListItem,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";

/**
 * Description
 * @param {any} {styles
 * @param {any} item
 * @param {any} setItemData}
 * @returns {any}
 */
export function EditButton({
  styles,
  item,
  setItemData,
}: {
  styles: {
    [key: string]:
      | string
      | number
      | boolean
      | {
          [key: string]: string | number | boolean;
        };
  };
  item: Item;
  setItemData: (item: Item) => void;
}): JSX.Element {
  const [open, setOpen] = React.useState<boolean>(false);

  /**
   * Description
   * @returns {any}
   */
  const handleClickOpen = () => {
    setOpen(true);
  };

  /**
   * Closes the popup
   * @returns void
   */
  const handleClose = () => {
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      category: [...item.category],
      name: item.name,
      quantity: item.quantity,
    },
    onSubmit: (values: {
      category: string[];
      name: string;
      quantity: string;
    }) => {
      fetchApiWithoutHook("property/inventory/edit", {
        id: item.id.toString(),
        lastModified: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        name: values.name,
        quantity: values.quantity,
        category: JSON.stringify(values.category),
      });

      // Update item object
      setItemData({
        ...item,
        name: values.name,
        quantity: values.quantity,
        category: JSON.stringify(values.category),
        lastModified: new Date(dayjs().format("YYYY-MM-DD HH:mm:ss")),
      });
      handleClose();
    },
  });
  React.useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });

  return (
    <div>
      <ListItem button sx={styles} onClick={handleClickOpen}>
        <span className="material-symbols-rounded">edit</span>
        Edit
      </ListItem>
      <SwipeableDrawer
        anchor="bottom"
        swipeAreaWidth={0}
        onOpen={handleClickOpen}
        open={open}
        onClose={handleClose}
        sx={{
          transition: "all .2s",
        }}
        PaperProps={{
          sx: {
            width: {
              sm: "50vw",
            },
            maxWidth: "600px",
            maxHeight: "95vh",
            minHeight: {
              xs: "95vh",
              sm: "unset",
            },
            borderRadius: "20px 20px 0 0",
            mx: "auto",
            ...(global.user.darkMode && {
              background: "hsl(240, 11%, 25%)",
            }),
          },
        }}
      >
        <Puller />
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              margin="dense"
              autoFocus
              label="Title"
              fullWidth
              onChange={formik.handleChange}
              defaultValue={formik.values.name}
              name="title"
              variant="filled"
              autoComplete="off"
            />
            <TextField
              margin="dense"
              label="Quantity"
              fullWidth
              onChange={formik.handleChange}
              autoComplete="off"
              defaultValue={formik.values.quantity}
              name="quantity"
              variant="filled"
            />
            <Autocomplete
              id="categories"
              multiple
              freeSolo
              options={[]}
              defaultValue={formik.values.category}
              onChange={(e, newValue) =>
                formik.setFieldValue("categories", newValue)
              }
              renderInput={(params) => (
                <TextField
                  margin="dense"
                  label="Categories"
                  name="categories"
                  variant="filled"
                  autoComplete="off"
                  {...params}
                />
              )}
            />
            <Typography sx={{ mt: 2 }} variant="body2">
              Hit &ldquo;Enter&rdquo; after each category
            </Typography>

            <Box
              sx={{
                position: {
                  xs: "fixed",
                  sm: "unset",
                },
                bottom: 0,
                left: 0,
                width: "100%",
                p: 1,
                background: colors[themeColor][50],
              }}
            >
              <Button
                variant="contained"
                disableElevation
                size="large"
                type="submit"
                sx={{
                  borderRadius: 99,
                  float: "right",
                  px: 3,
                  py: 1,
                  mt: 1,
                  ml: 1,
                }}
              >
                Done
              </Button>
            </Box>
          </form>
        </DialogContent>
      </SwipeableDrawer>
    </div>
  );
}
