import executeQuery from "../../../lib/db";

const handler = async (req, res) => {
  try {
    await executeQuery({
      query:
        "UPDATE Inventory SET note = ?, lastUpdated = ? WHERE id = ? AND user = ?",
      values: [
        req.query.note ?? "",
        req.query.lastUpdated ?? "2022-03-05 12:23:31",
        req.query.id ?? "false",
        req.query.token ?? false,
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
