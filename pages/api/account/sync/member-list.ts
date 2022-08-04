import executeQuery from "../../../../lib/db";
import type { NextApiResponse } from "next";

const handler = async (req: any, res: NextApiResponse<any>) => {
  try {
    const result = await executeQuery({
      query: "SELECT * FROM SyncTokens WHERE propertyToken = ?",
      values: [req.query.propertyToken ?? false],
    });
    res.json({
      data: result,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export default handler;
