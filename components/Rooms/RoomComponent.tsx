import { Container } from "@mui/material";
import { decode } from "js-base64";
import { useRouter } from "next/router";
import { useApi } from "../../lib/client/useApi";
import { ErrorHandler } from "../Error";
import { LoadingScreen } from "./Loading";
import { RenderRoom } from "./RenderRoom";

/**
 * Room component to load inventory
 * @param {any} {index}
 * @returns {JSX.Element}
 */

export function RoomComponent({ index }: { index: string }): JSX.Element {
  const router = useRouter();
  const { error, url, loading, data } = useApi("property/inventory/room", {
    room: router.query.custom
      ? decode(index).split(",")[0]
      : index.toLowerCase().replaceAll("-", ""),
  });

  return error ? (
    <Container sx={{ mt: 1 }}>
      <ErrorHandler error="An error occured while trying to fetch this room's contents" />
    </Container>
  ) : loading ? (
    <LoadingScreen />
  ) : (
    <RenderRoom data={data} index={index} mutationUrl={url} />
  );
}
