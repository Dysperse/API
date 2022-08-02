import executeQuery from "../../../../lib/db";
import { ExchangeToken } from "../../../../lib/exchange-token";

const handler = async (req, res) => {
  try {
    const userId = await ExchangeToken(req.query.token);

    const allowedValues = ["houseName", "houseType"];

    const specifiedValues = Object.keys(JSON.parse(req.query.data));
    let intersection = specifiedValues.filter((x) => allowedValues.includes(x));
    intersection.forEach(async (setting) => {
      await executeQuery({
        query: "UPDATE SyncTokens SET " + setting + " = ? WHERE login = ?",
        values: [JSON.parse(req.query.data)[setting], userId[0].user ?? false],
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
