import {
  Box,
  CircularProgress,
  Drawer,
  Icon,
  IconButton,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Item } from "@prisma/client";
import React from "react";
import { fetchApiWithoutHook } from "../../../hooks/useApi";
import { neutralizeBack, revivalBack } from "../../../hooks/useBackButton";
import { useSession } from "../../../pages/_app";
import { ItemCard } from "../ItemCard";

/**
 * Category modal
 * @param {string} category - The category name
 */
const CategoryModal = React.memo(function CategoryModal({
  mutationUrl,
  category,
}: {
  mutationUrl: string;
  category: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });
  const session = useSession();

  return (
    <>
      <Drawer
        onClose={() => setOpen(false)}
        open={open}
        anchor="right"
        ModalProps={{
          keepMounted: false,
        }}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "600px",
            maxHeight: "100vh",
          },
        }}
      >
        <Box sx={{ p: 3, pt: 0 }}>
          <Box
            sx={{
              my: 4,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                textAlign: "center",
                textTransform: "capitalize",
              }}
              variant="h5"
            >
              {category}
            </Typography>
            <IconButton
              onClick={() => setOpen(false)}
              sx={{
                ml: "auto",
              }}
            >
              <Icon>close</Icon>
            </IconButton>
          </Box>
          {data
            .filter((item) => item)
            .map((item: Item) => (
              <Box sx={{ mb: 1 }} key={item.id.toString()}>
                <ItemCard
                  item={item}
                  displayRoom={false}
                  mutationUrl={mutationUrl}
                />
              </Box>
            ))}
          {data.length === 0 && <>No items</>}
        </Box>
      </Drawer>
      <ListItemButton
        onClick={() => {
          setLoading(true);
          fetchApiWithoutHook("property/inventory/categories/items", {
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
          gap: 2,
          borderRadius: 4,
          transition: "none!important",
          cursor: "unset!important",
          ...(session?.user?.darkMode && {
            "&:hover .MuiAvatar-root": {
              background: "hsl(240,11%,27%)",
            },
          }),
        }}
      >
        <ListItemText
          primary={
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {category}{" "}
              {loading && (
                <CircularProgress
                  size={15}
                  sx={{
                    ml: "auto",
                    animationDuration: ".4s",
                    transitionDuration: ".4s",
                  }}
                  disableShrink
                />
              )}
            </Box>
          }
        />
      </ListItemButton>
    </>
  );
});
export default CategoryModal;
