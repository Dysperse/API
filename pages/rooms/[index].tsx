import { useRouter } from "next/router";
import { RoomComponent } from "../../components/Rooms/RoomComponent";
import Categories from "../items";
/**
 * Top-level component for the room page
 * @returns {any}
 */
export default function Room() {
  const index = window.location.pathname.split("/rooms/")[1];
  const router = useRouter();

  return (
    <Categories>
      <RoomComponent index={index} key={index} />
    </Categories>
  );
}
