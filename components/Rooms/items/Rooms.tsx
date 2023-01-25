import { CustomRoom } from "@prisma/client";
import { encode } from "js-base64";
import { Action } from "../../../pages/items";
import { ErrorHandler } from "../../Error";

/**
 * Rooms popup
 */
export function Rooms({ data, error }) {
  return (
    <>
      {data &&
        data.map((room: CustomRoom) => (
          <Action
            href={`/rooms/${encode(
              `${room.id},${room.name}`
            ).toString()}?custom=true`}
            icon="label"
            isPrivate={room.private}
            primary={room.name}
            key={room.id.toString()}
            isCustom={true}
          />
        ))}
      {error && (
        <ErrorHandler error="An error occured while trying to fetch your items" />
      )}
    </>
  );
}
