throw new Error("Hi");
import executeQuery from "../../lib/db";
var CryptoJS = require("crypto-js");

const handler = async (req, res) => {
  try {
    const step1 = await executeQuery({
      query: "SELECT * FROM Inventory",
      values: [],
    });

    step1.forEach(async (step1Data: any) => {
      const ciphertext = CryptoJS.AES.encrypt(
        step1Data.note,
        process.env.INVENTORY_ENCRYPTION_KEY
      ).toString();

      await executeQuery({
        query: "UPDATE Inventory SET note = ? WHERE id = ?",
        values: [ciphertext, step1Data.id],
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
