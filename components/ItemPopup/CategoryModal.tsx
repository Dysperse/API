import { Item as ItemType } from "@prisma/client";
import BoringAvatar from "boring-avatars";
import { useRef, useState } from "react";
import { fetchApiWithoutHook, useApi } from "../../hooks/useApi";
import { colors } from "../../lib/colors";
import { ErrorHandler } from "../Error";
import { Puller } from "../Puller";

import {
  Box,
  Button,
  Chip,
  Icon,
  ListItem,
  ListItemText,
  SwipeableDrawer,
  TextField,
} from "@mui/material";
import { mutate } from "swr";

function CreateCategoryModal({ setItemData, item, mutationUrl }) {
  const ref: any = useRef();
  const [open, setOpen] = useState(false);
  const handleSubmit = () => {
    const category = ref.current.value;
    if (JSON.parse(item.category).includes(category)) {
      setItemData({
        ...item,
        category: JSON.stringify(
          JSON.parse(item.category).filter((c: string) => c !== category)
        ),
      });
    } else {
      setItemData({
        ...item,
        category: JSON.stringify([...JSON.parse(item.category), category]),
      });
    }
    setTimeout(() => {
      fetchApiWithoutHook("property/inventory/edit", {
        category: item.category,
        id: item.id,
      });
      mutate(mutationUrl);
      ref.current.value = "";
    }, 100);
  };

  return (
    <>
      <Button
        size="large"
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
            autoComplete="off"
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
export function CategoryModal({
  setItemData,
  item,
}: {
  setItemData: any;
  item: ItemType;
}) {
  const [open, setOpen] = useState(false);
  const { data, url, error } = useApi("property/inventory/categories");

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
              <ListItem
                button
                key={category}
                sx={{ gap: 2, borderRadius: 999 }}
                onClick={() => {
                  if (JSON.parse(item.category).includes(category)) {
                    setItemData({
                      ...item,
                      category: JSON.stringify(
                        JSON.parse(item.category).filter(
                          (c: string) => c !== category
                        )
                      ),
                    });
                  } else {
                    setItemData({
                      ...item,
                      category: JSON.stringify([
                        ...JSON.parse(item.category),
                        category,
                      ]),
                    });
                  }
                  setTimeout(() => {
                    fetchApiWithoutHook("property/inventory/edit", {
                      category: item.category,
                      id: item.id,
                    });
                  }, 100);
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
                  <BoringAvatar
                    name={category}
                    size={30}
                    colors={[
                      "#264653",
                      "#2a9d8f",
                      "#e9c46a",
                      "#f4a261",
                      "#e76f51",
                    ]}
                  />
                </Box>
                <ListItemText
                  primary={category}
                  sx={{
                    "& *": { fontWeight: "600" },
                  }}
                />
              </ListItem>
            ))}
          <CreateCategoryModal
            setItemData={setItemData}
            item={item}
            mutationUrl={url}
          />
        </Box>
      </SwipeableDrawer>
      <Chip
        key={Math.random().toString()}
        disabled={global.permission === "read-only"}
        label={item.category === "[]" ? <>+ &nbsp;&nbsp;Add a category</> : "+"}
        onClick={() => {
          setOpen(true);
        }}
        sx={{
          px: 1.5,
          mr: 1,
          mb: 2.5,
          background: global.user.darkMode
            ? "hsl(240,11%,20%)"
            : `${colors[themeColor][200]}!important`,
          "&:hover": {
            background: global.user.darkMode
              ? "hsl(240,11%,25%)"
              : `${colors[themeColor][300]}!important`,
          },
          transition: "none",
        }}
      />
    </>
  );
}
