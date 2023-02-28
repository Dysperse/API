import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Icon,
  Typography,
} from "@mui/material";
import { ErrorHandler } from "../components/Error";
import ItemDrawer from "../components/ItemPopup";
import { ItemCard } from "../components/Rooms/ItemCard";
import { useApi } from "../hooks/useApi";
import Categories from "./items";

export default function Trash() {
  const { data, url, error } = useApi("property/inventory/starred");

  return (
    <Categories>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" className="font-heading" gutterBottom>
          Starred items
        </Typography>
        {!error && data ? (
          data.map((item) => (
            <ItemDrawer id={item.id} key={item.id} mutationUrl={url}>
              <ItemCard item={item} mutationUrl={url} displayRoom={false} />
            </ItemDrawer>
          ))
        ) : (
          <Box>
            <CircularProgress />
          </Box>
        )}
        {data && data.length === 0 && (
          <Box>
            <Alert severity="info">
              <AlertTitle>You don&apos;t have any starred items</AlertTitle>
              PRO TIP: You can star an item by opening it and hitting the{" "}
              <Icon sx={{ verticalAlign: "middle", mx: 0.5, mt: -0.5 }}>
                star
              </Icon>{" "}
              icon
            </Alert>
          </Box>
        )}
        {error && (
          <ErrorHandler error="Oh no! An error occured while trying to get your starred items! Please try again later" />
        )}
      </Box>
    </Categories>
  );
}
