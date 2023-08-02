import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useBackButton } from "@/lib/client/useBackButton";
import { useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  CircularProgress,
  Icon,
  IconButton,
  ListItemButton,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { Item } from "@prisma/client";
import { memo, useState } from "react";
import { toast } from "react-hot-toast";
import { ItemCard } from "../ItemCard";

interface CategoryModalProps {
  mutationUrl: string;
  category: string;
}

/**
 * Category modal
 * @param {string} category - The category name
 */
const CategoryModal = memo(function CategoryModal({
  mutationUrl,
  category,
}: CategoryModalProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState([]);

  useBackButton(() => setOpen(false));

  const session = useSession();
  const isDark = useDarkMode(session.darkMode);

  const handleFetch = () => {
    setLoading(true);
    fetchRawApi(session, "property/inventory/categories/items", {
      category,
    })
      .then((res) => {
        setData(res);
        setOpen(true);
        setLoading(false);
      })
      .catch(() => {
        toast.error(
          "An error occured while trying to get items with this category"
        );
        setLoading(false);
      });
  };

  return (
    <>
      <SwipeableDrawer
        onClose={() => setOpen(false)}
        open={open}
        anchor="right"
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "600px",
            maxHeight: "100dvh",
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
                <ItemCard item={item} mutationUrl={mutationUrl} />
              </Box>
            ))}
          {data.length === 0 && <>No items</>}
        </Box>
      </SwipeableDrawer>
      <ListItemButton
        onClick={handleFetch}
        sx={{
          gap: 2,
          borderRadius: 4,
          transition: "none!important",

          ...(isDark && {
            "&:hover .MuiAvatar-root": {
              background: "hsl(240,11%,27%)",
            },
          }),
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {category}
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
      </ListItemButton>
    </>
  );
});
export default CategoryModal;
