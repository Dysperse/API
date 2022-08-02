import executeQuery from "../../../lib/db";
import { ExchangeToken } from "../../../lib/exchange-token";

const handler = async (req, res) => {
  try {
    const userId = await ExchangeToken(req.query.token);

    const allowedValues = [
      "name",
      "image",
      "houseName",
      "familyCount",
      "houseType",
      "houseType",
      "theme",
      "financeToken",
      "financePlan",
      "darkMode",
      "budgetDaily",
      "budgetMonthly",
      "budgetWeekly",
      "SyncToken",
    ];

    const specifiedValues = Object.keys(JSON.parse(req.query.data));
    let intersection = specifiedValues.filter((x) => allowedValues.includes(x));

    intersection.forEach(async (setting) => {
      const result = await executeQuery({
        query: "UPDATE Accounts SET " + setting + " = ? WHERE id = ?",
        values: [JSON.parse(req.query.data)[setting], userId[0].user ?? false],
      });
      console.log(result);
    });
    res.json({
      data: true,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export default handler;
