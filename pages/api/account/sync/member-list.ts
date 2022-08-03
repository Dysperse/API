import executeQuery from "../../../../lib/db";

const handler = async (req, res) => {
  try {
    const result = await executeQuery({
      query: "SELECT * FROM SyncTokens WHERE accessToken = ?",
      values: [req.query.token ?? false],
    });
    res.json({
      data: result,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export default handler;
