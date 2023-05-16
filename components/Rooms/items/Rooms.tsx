import { CustomRoom } from "@prisma/client";
import { ErrorHandler } from "../../Error";
import Action from "../Action";

/**
 * Rooms popup
 */
export const Rooms = ({count, data, error }: any) => {
  return (
    <>
      {data &&
        data.map((room: CustomRoom) => (
          <Action
            key={room.id.toString()}
            count={count}
            room={room}
            icon="label"
          />
        ))}
      {error && (
        <ErrorHandler error="An error occured while trying to fetch your items" />
      )}
    </>
  );
};
