import jwt from "jsonwebtoken";
import { setCookie } from "cookies-next";

function ClientSideJS({ e }) {
  document.cookie = "token=" + e;
  return <></>;
}
export default function Test({ token }) {
  return (
    <>
      {token}
      <ClientSideJS e={token} />
    </>
  );
}

export const getServerSideProps = async ({ req, res }) => {
  const encoded = jwt.sign(
    req.cookies.token,
    process.env.SECRET_COOKIE_PASSWORD
  );

  // const decoded = jwt.verify(
  //   "eyJhbGciOiJIUzI1NiJ9.NmJkNDYyNzktNmI3OC00ZTQ2LWI4MmYtNjIwZTAwMTM1MmE2.M7c1cLANy0HEbLQ2vX412tcmbIY2V7Cn8PhftuRvHDA",
  //   "secret"
  // );

  return {
    props: { token: encoded },
  };
};
