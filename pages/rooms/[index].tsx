import { decode } from "js-base64";
import Head from "next/head";
import { useRouter } from "next/router";
import { RoomComponent } from "../../components/rooms/RoomComponent";

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
          {global.session.property[
            global.session.currentProperty
          ].houseName.replace(/./, (c) => c.toUpperCase())}{" "}
          &bull; Carbon
        </title>
      </Head>
      <RoomComponent index={index} key={index} />
    </>
  );
}
