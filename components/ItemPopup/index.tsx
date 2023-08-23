import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { useAccountStorage } from "@/lib/client/useAccountStorage";
import { fetchRawApi } from "@/lib/client/useApi";
import { useBackButton } from "@/lib/client/useBackButton";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
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
import { ErrorHandler } from "../Error";
import { Puller } from "../Puller";

const AddToListModal = dynamic(() => import("./AddToList"));
const CategoryModal = dynamic(() => import("./CategoryModal"));
const DeleteButton = dynamic(() => import("./DeleteButton"));
const MoveToRoom = dynamic(() => import("./MoveToRoom"));
const StarButton = dynamic(() => import("./StarButton"));

function DrawerData({ handleOpen, mutate, itemData, setItemData }) {
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const styles = {
    borderRadius: 0,
    transition: "none",
    py: 1.5,
    gap: 2,
    color: palette[12],
    background: palette[2],
    "&:hover, &:active, &:focus-within": {
      background: palette[3],
      color: palette[11],
    },
  };

  const inputStyles = {
    "&:hover, &:active, &:focus-within": {
      background: palette[2],
    },
    borderRadius: 2,
    pl: "10px",
    width: "calc(100% + 10px)",
    ml: "-10px",
  };

  const handleItemChange = async (key: string, value: string) => {
    toast.promise(
      fetchRawApi(session, "property/inventory/items/edit", {
        id: itemData.id.toString(),
        [key]: value,
        lastModified: new Date(dayjs().format("YYYY-MM-DD HH:mm:ss")),
      }).then(async () => {
        mutate();
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
    fetchRawApi(session, "property/inventory/trash/item", {
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
              fetchRawApi(session, "property/inventory/restore", {
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
        disabled={
          storage?.isReached === true || session.permission === "read-only"
        }
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
        disabled={
          storage?.isReached === true || session.permission === "read-only"
        }
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
            <Chip label={category} key={category} />
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
        disabled={
          storage?.isReached === true || session.permission === "read-only"
        }
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
          background: palette[2],
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
        sx={{
          my: 2,
          color: palette[11],
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
  mutate,
}: {
  id: number;
  children: JSX.Element;
  mutate?: any;
}): JSX.Element {
  const session = useSession();
  const [open, setOpen] = useState<boolean>(false);
  const [itemData, setItemData] = useState<null | Item>(null);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useBackButton(() => setOpen(false));

  const handleOpen = useCallback(
    async (e) => {
      if (e) e.stopPropagation();
      setOpen(true);
      setError(false);
      try {
        const data = await fetchRawApi(session, "property/inventory/items", {
          id,
        });
        console.log(data);
        setItemData(data);
        setLoading(false);
      } catch (e) {
        setError(true);
      }
    },
    [session, id]
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    mutate();
  }, [mutate]);

  const trigger = cloneElement(children, {
    onClick: handleOpen,
  });

  return (
    <>
      <SwipeableDrawer
        open={open}
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
          <ErrorHandler
            callback={mutate}
            error="An error occured while trying to fetch the item's data. Please try again later"
          />
        )}
        {itemData ? (
          <DrawerData
            itemData={itemData}
            handleOpen={handleOpen}
            setItemData={setItemData}
            mutate={mutate}
          />
        ) : !loading && itemData === null ? (
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
