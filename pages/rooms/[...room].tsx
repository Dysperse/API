import { ErrorHandler } from "@/components/Error";
import { RenderRoom } from "@/components/Rooms/RenderRoom";
import { useApi } from "@/lib/client/useApi";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { mutate } from "swr";
import Categories from "../items";

/**
 * Top-level component for the room page
 * @returns {any}
 */
export default function Room() {
  const router = useRouter();
  const { room } = router.query;

  const { data, url, error } = useApi("property/inventory/room", {
    room: room?.[0] ?? "",
  });

  return (
    <Categories>
      {data ? (
        <RenderRoom room={room} items={data} mutationUrl={url} />
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100vh",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {error && (
        <ErrorHandler
          error="Oh no! We couldn't load the items in this room. Please try again later"
          callback={() => mutate(url)}
        />
      )}
    </Categories>
  );
}
