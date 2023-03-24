import { Item as ItemType } from "@prisma/client";
import { useRef, useState } from "react";
import { fetchRawApi, useApi } from "../../lib/client/useApi";
import { colors } from "../../lib/colors";
import { ErrorHandler } from "../Error";
import { Puller } from "../Puller";

import {
  Box,
  Button,
  Chip,
  Icon,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
  TextField,
} from "@mui/material";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import { toastStyles } from "../../lib/client/useTheme";
import { useAccountStorage, useSession } from "../../pages/_app";

function CreateCategoryModal({ setItemData, item, mutationUrl }) {
  const ref: any = useRef();
  const [open, setOpen] = useState<boolean>(false);
  const handleSubmit = () => {
    const category = ref.current.value;
    if (JSON.parse(item.category).includes(category)) {
      toast("Category already exists", toastStyles);
      ref.current.value = "";
      return;
    } else {
      setItemData({
        ...item,
        category: JSON.stringify([...JSON.parse(item.category), category]),
      });
    }
    setTimeout(() => {
      fetchRawApi("property/inventory/items/edit", {
        category: item.category,
        id: item.id,
      });
      mutate(mutationUrl);
      ref.current.value = "";
    }, 100);
  };

  const storage = useAccountStorage();

  return (
    <>
      <Button
        size="large"
        disabled={storage?.isReached === true}
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{
          mt: 2,
          width: "100%",
          borderRadius: 999,
        }}
      >
        Create
      </Button>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen
      >
        <Puller />
        <Box sx={{ p: 2, pt: 0 }}>
          <TextField
            label="Category name"
            margin="dense"
            inputRef={ref}
            autoFocus
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                handleSubmit();
              }
            }}
          />
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            fullWidth
            onClick={handleSubmit}
            disabled={storage?.isReached === true}
          >
            <Icon>add</Icon>
            Create
          </Button>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

/**
 * Category modal
 */
export default function CategoryModal({
  handleItemChange,
  setItemData,
  item,
}: {
  handleItemChange: any;
  setItemData: any;
  item: ItemType;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const storage = useAccountStorage();
  const { data, url, error } = useApi("property/inventory/categories");
  const session = useSession();

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen
      >
        <Puller />
        <Box sx={{ p: 2, mt: 2, maxHeight: "60vh", overflowY: "auto" }}>
          {data && data.length === 0 && (
            <Box
              sx={{
                p: 2,
                background: "rgba(200,200,200,.3)",
                borderRadius: 5,
              }}
            >
              You don&apos;t have any categories yet.
            </Box>
          )}
          {error && (
            <ErrorHandler error="An error occured while trying to fetch your categories" />
          )}
          {data &&
            [...new Set(data)].map((category: any) => (
              <ListItemButton
                disabled={storage?.isReached === true}
                key={category}
                sx={{ gap: 2, borderRadius: 999 }}
                onClick={() => {
                  if (JSON.parse(item.category).includes(category)) {
                    setItemData(() => {
                      const c = JSON.stringify(
                        JSON.parse(item.category).filter(
                          (c: string) => c !== category
                        )
                      );
                      handleItemChange("category", c);
                      return {
                        ...item,
                        category: c,
                      };
                    });
                  } else {
                    setItemData(() => {
                      const c = JSON.stringify([
                        ...JSON.parse(item.category),
                        category,
                      ]);
                      handleItemChange("category", c);
                      return {
                        ...item,
                        category: c,
                      };
                    });
                  }
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    position: "relative",
                  }}
                >
                  {JSON.parse(item.category).includes(category) && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        mt: 0.5,
                        color: "#fff",
                        transform: "translate(-50%,-50%)",
                        zIndex: 9999,
                      }}
                    >
                      <Icon>check</Icon>
                    </Box>
                  )}
                </Box>
                <ListItemText
                  primary={category}
                  sx={{
                    "& *": { fontWeight: "600" },
                  }}
                />
              </ListItemButton>
            ))}
          <CreateCategoryModal
            setItemData={setItemData}
            item={item}
            mutationUrl={url}
          />
        </Box>
      </SwipeableDrawer>
      <Chip
        disabled={session?.permission === "read-only"}
        label={item.category === "[]" ? <>+ &nbsp;&nbsp;Add a category</> : "+"}
        onClick={() => setOpen(true)}
        sx={{
          px: 1.5,
          mr: 1,
          background: session.user.darkMode
            ? "hsl(240,11%,20%)"
            : `${colors[session?.themeColor || "grey"][200]}!important`,
          "&:hover": {
            background: session.user.darkMode
              ? "hsl(240,11%,25%)"
              : `${colors[session?.themeColor || "grey"][300]}!important`,
          },
          transition: "none",
        }}
      />
    </>
  );
}
