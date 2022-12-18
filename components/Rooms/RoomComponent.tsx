import { decode } from "js-base64";
import { useRouter } from "next/router";
import { useApi } from "../../hooks/useApi";
import type { ApiResponse } from "../../types/client";
import { ErrorHandler } from "../error";
import { LoadingScreen } from "./LoadingScreen";
import { RenderRoom } from "./RenderRoom";
import { Container } from '@mui/material';

/**
 * Room component to load inventory
 * @param {any} {index}
 * @returns {JSX.Element}
 */

export function RoomComponent({ index }: { index: string }): JSX.Element {
  const router = useRouter();
  const { error, loading, data }: ApiResponse = useApi(
    "property/inventory/list",
    {
      room: router.query.custom
        ? decode(index).split(",")[0]
        : index.toLowerCase().replaceAll("-", ""),
    }
  );

  return error ? (
    <Container sx={{ mt: 1 }}>
      <ErrorHandler error="An error occured while trying to fetch this room's contents" />
    </Container>
  ) : loading ? (
    <LoadingScreen />
  ) : (
    <RenderRoom data={data} index={index} />
  );
}
