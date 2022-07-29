import { decode } from "js-base64";
import { useRouter } from "next/router";
import useFetch from "react-fetch-hook";
import { LoadingScreen } from "./LoadingScreen";
import { RenderRoom } from "./RenderRoom";

export function RoomComponent({ index }: any) {
  const router = useRouter();
  const { isLoading, data }: any = useFetch(
    "/api/inventory?" +
      new URLSearchParams({
        token:
          global.session &&
          (global.session.user.SyncToken || global.session.accessToken),
        room: router.query.custom
          ? decode(index).split(",")[0]
          : index.toLowerCase().replaceAll("-", ""),
      }),
    {
      method: "POST",
    }
  );

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <RenderRoom data={data} index={index} />
  );
}
