import cacheData from "memory-cache";

const handler = async (req, res) => {
  cacheData.clear();
  res.status(200).json({ success: true });
};

export default handler;
