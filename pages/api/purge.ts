import cacheData from "memory-cache";

const handler = async (req, res) => {
  cacheData.del(req.cookies.token);
  res.status(200).json({ success: true });
};

export default handler;
