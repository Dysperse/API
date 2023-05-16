import { CustomRoom } from "@prisma/client";
import React from "react";
import { ErrorHandler } from "../../Error";
import Action from "../Action";

/**
 * Rooms popup
 */
export const Rooms: any = React.memo(function Rooms({
  data,
  mutationUrl,
  error,
}: any) {
  return (
    <>
      {data &&
        data.map((room: CustomRoom) => (
          <Action
            mutationUrl={mutationUrl}
            href={`/rooms/${room.id}/${room.name}`}
            icon="label"
            id={room.id.toString()}
            isPrivate={room.private}
            primary={room.name}
            key={room.id.toString()}
            isCustom
          />
        ))}
      {error && (
        <ErrorHandler error="An error occured while trying to fetch your items" />
      )}
    </>
  );
});
