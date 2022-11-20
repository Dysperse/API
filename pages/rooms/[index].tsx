import { decode } from "js-base64";
import Head from "next/head";
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
    <>
      <Head>
        <title>
          {(router.query.custom ? decode(index).split(",")[1] : index).replace(
            /./,
            (c) => c.toUpperCase()
          )}{" "}
          &bull;{" "}
          {global.property.profile.name.replace(/./, (c) => c.toUpperCase())}{" "}
          &bull; Carbon
        </title>
      </Head>
      <Categories>
        <RoomComponent index={index} key={index} />
      </Categories>
    </>
  );
}
