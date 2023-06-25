import { ErrorHandler } from "@/components/Error";
import ItemDrawer from "@/components/ItemPopup";
import { ItemCard } from "@/components/Rooms/ItemCard";
import { useApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { Box, Button, CircularProgress, Icon, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { mutate } from "swr";
import Categories from "./items";
import { useDarkMode } from "@/lib/client/useColor";

export default function Trash() {
  const { data, url, error } = useApi("property/inventory/starred");
  const router = useRouter();
  const session = useSession();
  const isDark = useDarkMode(session.darkMode);

  return (
    <Categories>
      {data?.length === 0 && (
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            width: "500px",
            mx: "auto",
            textAlign: "center",
            maxWidth: "100vw",
          }}
        >
          <Image
            src="/images/noStarredItems.png"
            alt="No starred items"
            width={256}
            height={171}
            style={{
              ...(isDark && { filter: "invert(1)" }),
            }}
          />
          <Typography variant="h6" gutterBottom>
            No starred items
          </Typography>
          <Typography>
            You haven&apos;t starred any items yet. You can do so by tapping on
            any item and clicking on the{" "}
            <Icon
              sx={{
                verticalAlign: "middle",
                mt: -0.7,
              }}
              className="outlined"
            >
              star
            </Icon>{" "}
            icon
          </Typography>
        </Box>
      )}
      {data && data.length !== 0 && (
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
          {error && (
            <ErrorHandler
              callback={() => mutate(url)}
              error="Oh no! An error occured while trying to get your starred items! Please try again later"
            />
          )}
        </Box>
      )}
    </Categories>
  );
}
