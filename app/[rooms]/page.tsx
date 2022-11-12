import Head from "next/head";
import { RoomComponent } from "../../components/Rooms/RoomComponent";

/**
 * Top-level component for the room page
 * @returns {any}
 */
export default function Room({ params }) {
  const index = window.location.pathname.split("/rooms/")[1];

  return (
    <>
      <Head>
        <title>Inventory</title>
      </Head>
      <RoomComponent index={index} key={index} params={params} />
    </>
  );
}
