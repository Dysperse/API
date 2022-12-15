import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Item as ItemType } from "@prisma/client";
import BoringAvatar from "boring-avatars";
import React, { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { colors } from "../../lib/colors";
import { Puller } from "../Puller";

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
  const { data, error } = useApi("property/inventory/categories");

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: "20px 20px 0 0",
            mx: "auto",
            maxWidth: "500px",
          },
        }}
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
                      <span className="material-symbols-rounded">check</span>
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
          <Button
            disableElevation
            size="large"
            variant="contained"
            sx={{
              background: colors[themeColor][600] + "!important",
              mt: 2,
              width: "100%",
              borderRadius: 999,
            }}
          >
            Create
          </Button>
        </Box>
      </SwipeableDrawer>
      <Chip
        key={Math.random().toString()}
        label={item.category === "[]" ? <>+ &nbsp;&nbsp;Add category</> : "+"}
        onClick={() => {
          setOpen(true);
        }}
        sx={{
          px: 1.5,
          mr: 1,
          mb: 2.5,
          background: `${colors[themeColor][200]}!important`,
          "&:hover": {
            background: `${colors[themeColor][300]}!important`,
          },
          transition: "none",
        }}
      />
    </>
  );
}
