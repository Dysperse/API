"use client";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";
import { Item } from "@prisma/client";
import BoringAvatar from "boring-avatars";
import React from "react";
import { Puller } from "../../components/Puller";
import { ItemCard } from "../../components/Rooms/ItemCard";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { colors } from "../../lib/colors";

/**
 * Category modal
 * @param {string} category - The category name
 */
export function CategoryModal({ category }: { category: string }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });

  return (
    <>
      <SwipeableDrawer
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen
        open={open}
        anchor="bottom"
        PaperProps={{
          elevation: 0,
          sx: {
            background: colors[themeColor][50],
            width: {
              sm: "50vw",
            },
            maxWidth: "600px",
            maxHeight: "95vh",
            borderRadius: "20px 20px 0 0",
            mx: "auto",
            ...(global.user.darkMode && {
              background: "hsl(240, 11%, 25%)",
            }),
          },
        }}
      >
        <Puller />
        <Box sx={{ p: 3, pt: 0, overflow: "scroll" }}>
          <Typography
            sx={{
              textAlign: "center",
              my: 4,
              textTransform: "capitalize",
              fontWeight: "600",
            }}
            variant="h5"
          >
            {category}
          </Typography>
          {data
            .filter((item) => item)
            .map((item: Item) => (
              <Box sx={{ mb: 1 }} key={item.id.toString()}>
                <ItemCard item={item} displayRoom={false} />
              </Box>
            ))}
          {data.length === 0 && <>No items</>}
        </Box>
      </SwipeableDrawer>
      <ListItem
        button
        onClick={() => {
          setLoading(true);
          fetchApiWithoutHook("property/inventory/categoryList", {
            category: category,
          })
            .then((res) => {
              setData(res);
              setOpen(true);
              setLoading(false);
            })
            .catch(() => {
              setLoading(false);
            });
        }}
        sx={{
          mb: 1,
          transition: "transform .2s !important",
          gap: 2,
          borderRadius: 4,
          "&:active": {
            transition: "none!important",
            transform: "scale(.97)",
            background: global.user.darkMode
              ? "hsl(240, 11%, 20%)"
              : "rgba(200,200,200,.4)",
          },
          ...(theme === "dark" && {
            "&:hover .MuiAvatar-root": {
              background: "hsl(240,11%,27%)",
            },
          }),
        }}
      >
        <BoringAvatar
          name={category}
          size={30}
          colors={["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"]}
        />
        <ListItemText
          primary={
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {category}{" "}
              {loading && <CircularProgress size={20} sx={{ ml: "auto" }} />}
            </Box>
          }
        />
      </ListItem>
    </>
  );
}
