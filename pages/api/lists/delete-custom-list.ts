import executeQuery from "../../../lib/db";

const handler = async (req, res) => {
  try {
    await executeQuery({
      query: "DELETE FROM ListNames WHERE id = ? AND login = ?",
      values: [req.query.id ?? "false", req.query.token ?? false],
    });
    await executeQuery({
      query: "DELETE FROM ListItems WHERE parent = ? AND login = ?",
      values: [req.query.id ?? "false", req.query.token ?? false],
    });
    res.json({
      data: true,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export default handler;
