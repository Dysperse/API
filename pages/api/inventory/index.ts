import executeQuery from "../../../lib/db";

const handler = async (req, res) => {
  try {
    const result = await executeQuery({
      query: req.query.limit
        ? "SELECT * FROM Inventory WHERE user = ? AND trash = 0 ORDER BY lastUpdated DESC LIMIT ?"
        : "SELECT * FROM Inventory WHERE user = ? AND trash = 0 AND room = ? ORDER BY lastUpdated DESC LIMIT 150",
      values: req.query.limit
        ? [req.query.token ?? false, parseInt(req.query.limit)]
        : [req.query.token ?? false, req.query.room ?? "kitchen"],
    });
    res.json({
      data: result.map((item: any) => {
        return {
          id: item.id,
          lastUpdated: item.lastUpdated,
          amount: item.qty,
          title: item.name,
          categories: [],
          note: item.note,
          star: item.star,
          room: item.room,
        };
      }),
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export default handler;
