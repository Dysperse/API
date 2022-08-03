import executeQuery from "../../../lib/db";

const handler = async (req, res) => {
  try {
    const result = await executeQuery({
      query: "SELECT * FROM ListNames WHERE user = ? ORDER BY ID ASC",
      values: [req.query.token ?? false],
    });
    res.json({
      data: result.map((item) => {
        return {
          id: item.id,
          title: item.title,
          description: item.description,
          star: item.star,
          count: 100,
        };
      }),
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export default handler;
