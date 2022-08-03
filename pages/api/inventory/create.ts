import executeQuery from "../../../lib/db";

const handler = async (req, res) => {
  try {
    await executeQuery({
      query:
        "INSERT INTO Inventory (name, qty, category, user, star, lastUpdated, room, trash) VALUES (?, ?, ?, ?, 0, ?, ?, 0)",
      values: [
        req.query.name ?? "",
        req.query.qty ?? "",
        req.query.category ?? "[]",
        req.query.token ?? false,
        req.query.lastUpdated ?? "2022-03-05 12:23:31",
        req.query.room ?? "kitchen",
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
