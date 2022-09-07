import Box from "@mui/material/Box";
import { decode } from "js-base64";
import { useRouter } from "next/router";
import useSWR from "swr";
import { ErrorHandler } from "../ErrorHandler";
import { LoadingScreen } from "./LoadingScreen";
import { RenderRoom } from "./RenderRoom";

export function RoomComponent({ index }: any) {
  const router = useRouter();
  const url =
    "/api/property/inventory/list?" +
    new URLSearchParams({
      property: global.property.propertyId,
      accessToken: global.property.accessToken,
      room: router.query.custom
        ? decode(index).split(",")[0]
        : index.toLowerCase().replaceAll("-", ""),
    });

  const { error, data }: any = useSWR(url, () =>
    fetch(url).then((res) => res.json())
  );

  return error ? (
    <Box sx={{ p: 2 }}>
      <ErrorHandler error="An error occured while trying to fetch this room's contents" />
    </Box>
  ) : data ? (
    <RenderRoom data={data} index={index} />
  ) : (
    <LoadingScreen />
  );
}
