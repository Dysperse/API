import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  const { accessToken } = jwt.verify(
    req.cookies.token,
    process.env.SECRET_COOKIE_PASSWORD
  );
  res.json(accessToken);
};

export default handler;
