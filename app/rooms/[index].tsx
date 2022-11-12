import { decode } from "js-base64";
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
        <title>
          {(params.custom ? decode(index).split(",")[1] : index).replace(
            /./,
            (c) => c.toUpperCase()
          )}{" "}
          &bull;{" "}
          {global.property.profile.name.replace(/./, (c) => c.toUpperCase())}{" "}
          &bull; Carbon
        </title>
      </Head>
      <RoomComponent index={index} key={index} params={params} />
    </>
  );
}
