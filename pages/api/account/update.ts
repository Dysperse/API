import executeQuery from "../../../lib/db";
import { ExchangeToken } from "../../../lib/exchange-token";
import type { NextApiResponse } from "next";

const handler = async (req: any, res: NextApiResponse<any>) => {
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
      await executeQuery({
        query: "UPDATE Accounts SET " + setting + " = ? WHERE id = ?",
        values: [JSON.parse(req.query.data)[setting], userId ?? false],
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
