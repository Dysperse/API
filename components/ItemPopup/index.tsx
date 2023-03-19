import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  List,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import { Item } from "@prisma/client";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { cloneElement, useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../lib/client/useApi";
import { toastStyles } from "../../lib/client/useTheme";
import { colors } from "../../lib/colors";
import { useAccountStorage, useSession } from "../../pages/_app";
import { ErrorHandler } from "../Error";
import { Puller } from "../Puller";

const AddToListModal = dynamic(() => import("./AddToList"));
const CategoryModal = dynamic(() => import("./CategoryModal"));
const DeleteButton = dynamic(() => import("./DeleteButton"));
const MoveToRoom = dynamic(() => import("./MoveToRoom"));
const StarButton = dynamic(() => import("./StarButton"));

export const capitalizeFirstLetter = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

function DrawerData({ handleOpen, mutationUrl, itemData, setItemData }) {
  const session = useSession();

  const styles = {
    borderRadius: 0,
    transition: "none",
    py: 1.5,
    cursor: "unset!important",
    gap: 2,
    color: session.user.darkMode
      ? "hsl(240, 11%, 90%)"
      : colors[session?.themeColor || "grey"]["800"],
    background: session.user.darkMode
      ? "hsl(240, 11%, 20%)"
      : colors[session?.themeColor || "grey"][50],
    "&:hover, &:active, &:focus-within": {
      background: session.user.darkMode
        ? "hsl(240, 11%, 25%)"
        : colors[session?.themeColor || "grey"][100],
      color: session.user.darkMode
        ? "hsl(240, 11%, 95%)"
        : colors[session?.themeColor || "grey"][900],
    },
  };

  const inputStyles = {
    "&:hover, &:active, &:focus-within": {
      background: session.user.darkMode
        ? "hsl(240, 11%, 20%)"
        : colors[session?.themeColor || "grey"][100],
    },
    borderRadius: 2,
    pl: "10px",
    width: "calc(100% + 10px)",
    ml: "-10px",
  };

  const handleItemChange = async (key: string, value: string) => {
    toast.promise(
      fetchApiWithoutHook("property/inventory/items/edit", {
        id: itemData.id.toString(),
        [key]: value,
        lastModified: new Date(dayjs().format("YYYY-MM-DD HH:mm:ss")),
      }).then(async () => {
        mutationUrl && mutate(mutationUrl);
        handleOpen();
      }),
      {
        loading: "Updating...",
        success: "Updated!",
        error:
          "Yikes! An error occured while trying to update this item. Please try again later",
      },
      toastStyles
    );
  };
  /**
   * Callback for clicking on the star button
   * @returns {void}
   */
  const handleItemStar = (): void => {
    setItemData({
      ...itemData,
      lastModified: new Date(dayjs().format("YYYY-MM-DD HH:mm:ss")),
      starred: !itemData.starred,
    });
    handleItemChange("starred", itemData.starred ? "true" : "false");
  };

  const handleItemDelete = () => {
    fetchApiWithoutHook("property/inventory/trash/item", {
      id: itemData.id.toString(),
      lastModified: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    });
    handleOpen();

    toast.success(
      (t) => (
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
                id: itemData.id.toString(),
                lastModified: dayjs().format("YYYY-MM-DD HH:mm:ss"),
              });
            }}
          >
            Undo
          </Button>
        </span>
      ),
      toastStyles
    );
  };

  const preventLineBreaks = (e) => {
    e.target.value = e.target.value.replace(/\n/g, "");
    if (e.key === "Enter" && !e.shiftKey) {
      e.target.blur();
    }
  };

  const categories = JSON.parse(itemData.category);
  const storage = useAccountStorage();

  return (
    <Box sx={{ px: 4, pt: 1 }}>
      <TextField
        disabled={storage?.isReached === true}
        placeholder="Item title"
        multiline
        defaultValue={capitalizeFirstLetter(itemData.name)}
        onBlur={(e) => handleItemChange("name", e.target.value)}
        onKeyDown={preventLineBreaks}
        onChange={preventLineBreaks}
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: {
            ...inputStyles,
            fontSize: "45px",
          },
          className: "font-heading",
        }}
      />
      <TextField
        multiline
        disabled={storage?.isReached === true}
        placeholder="Add a quantity"
        onChange={preventLineBreaks}
        onKeyDown={preventLineBreaks}
        onBlur={(e) => handleItemChange("quantity", e.target.value)}
        defaultValue={capitalizeFirstLetter(itemData.quantity)}
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: {
            ...inputStyles,
            fontSize: "20px",
          },
        }}
      />
      <Box
        sx={{
          overflowX: "scroll",
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "center",
          gap: 1,
          my: 2,
        }}
      >
        {[capitalizeFirstLetter(itemData.room), ...categories].map(
          (category) => (
            <Chip
              label={category}
              key={category}
              sx={{
                background:
                  (session.user.darkMode
                    ? "hsl(240,11%,25%)"
                    : colors[session?.themeColor || "grey"][100]) +
                  "!important",
              }}
            />
          )
        )}
        <CategoryModal
          setItemData={setItemData}
          item={itemData}
          handleItemChange={handleItemChange}
        />
      </Box>
      <TextField
        multiline
        variant="standard"
        disabled={storage?.isReached === true}
        InputProps={{
          disableUnderline: true,
          sx: { ...styles, borderRadius: 5, mb: 2, p: 3 },
        }}
        defaultValue={itemData.note}
        onBlur={(e: any) => handleItemChange("note", e.target.value)}
        placeholder="Add a description"
        rows={3}
      />
      <List
        sx={{
          py: 0,
          borderRadius: 5,
          overflow: "hidden",
          background: session.user.darkMode
            ? "hsl(240, 11%, 20%)"
            : colors[session?.themeColor || "grey"][200],
        }}
      >
        <AddToListModal item={itemData} styles={styles} />
        <MoveToRoom item={itemData} styles={styles} />
        <DeleteButton styles={styles} handleItemDelete={handleItemDelete} />
        <StarButton
          item={itemData}
          styles={styles}
          handleItemStar={handleItemStar}
        />
      </List>

      <Typography
        className="body2"
        sx={{
          my: 2,
          color: session.user.darkMode ? "#aaa" : "hsl(240,11%,50%)",
        }}
      >
        <i>Last edit was {dayjs(itemData.lastModified).fromNow()}</i>
      </Typography>
    </Box>
  );
}

export default function ItemDrawer({
  id,
  children,
  mutationUrl,
}: {
  id: number;
  children: JSX.Element;
  mutationUrl?: string;
}): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [itemData, setItemData] = useState<null | Item>(null);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const handleOpen = useCallback(
    async (e) => {
      if (e) e.stopPropagation();
      setOpen(true);
      setError(false);
      try {
        const data = await fetchApiWithoutHook("property/inventory/items", {
          id,
        });
        setItemData(data);
        setLoading(false);
      } catch (e) {
        setError(true);
      }
    },
    [id]
  );

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const trigger = cloneElement(children, {
    //onTouchStart: handleOpen,
    onClick: handleOpen,
  });

  return (
    <>
      <SwipeableDrawer
        open={open}
        disableSwipeToOpen
        disableBackdropTransition
        onOpen={handleOpen}
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        anchor="bottom"
        onClose={handleClose}
      >
        <Puller />
        {error && (
          <ErrorHandler error="An error occured while trying to fetch the item's data. Please try again later" />
        )}
        {itemData ? (
          <DrawerData
            itemData={itemData}
            handleOpen={handleOpen}
            setItemData={setItemData}
            mutationUrl={mutationUrl}
          />
        ) : !loading && itemData == null ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">Item does not exist</Alert>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
              py: 10,
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </SwipeableDrawer>

      {trigger}
    </>
  );
}
