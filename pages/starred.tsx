import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Icon,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { ErrorHandler } from "../components/Error";
import ItemDrawer from "../components/ItemPopup";
import { ItemCard } from "../components/Rooms/ItemCard";
import { useApi } from "../lib/client/useApi";
import Categories from "./items";

export default function Trash() {
  const { data, url, error } = useApi("property/inventory/starred");
  const router = useRouter();

  return (
    <Categories>
      <Box sx={{ p: 3 }}>
        <Button
          onClick={() => router.push("/items")}
          size="small"
          variant="contained"
          sx={{ display: { sm: "none" }, mb: 2 }}
        >
          <Icon>west</Icon>
          Back to items
        </Button>
        <Typography variant="h4" className="font-heading" gutterBottom>
          Starred items
        </Typography>
        {!error && data ? (
          data.map((item) => (
            <ItemDrawer id={item.id} key={item.id} mutationUrl={url}>
              <ItemCard item={item} mutationUrl={url} />
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
              <AlertTitle sx={{ mb: 0 }}>
                You don&apos;t have any starred items
              </AlertTitle>
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
