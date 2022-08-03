import executeQuery from "../../../lib/db";

const handler = async (req, res) => {
  try {
    await executeQuery({
      query:
        "UPDATE Inventory SET trash = 0, lastUpdated= ?  WHERE user = ?  AND id = ?",
      values: [
        req.query.lastUpdated ?? "2022-03-05 12:23:31",
        req.query.token ?? false,
        req.query.id ?? "false",
      ],
    });
    res.json({
      data: true,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export default handler;
