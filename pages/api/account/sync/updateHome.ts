import executeQuery from "../../../../lib/db";

const handler = async (req, res) => {
  try {
    const allowedValues = ["houseName", "houseType"];

    const specifiedValues = Object.keys(JSON.parse(req.query.data));
    let intersection = specifiedValues.filter((x) => allowedValues.includes(x));
    intersection.forEach(async (setting) => {
      await executeQuery({
        query:
          "UPDATE SyncTokens SET " + setting + " = ? WHERE accessToken = ?",
        values: [JSON.parse(req.query.data)[setting], req.query.token ?? false],
      });
    });
    res.json({
      data: true,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export default handler;
