import CryptoJS from "crypto-js";

export default function handler(req, res) {
  const decryptedAmount = CryptoJS.AES.decrypt(
    "U2FsdGVkX19ywHDXomuPm5X+lSfgKJmJZHPrqqROGOQ=",
    process.env.INVENTORY_ENCRYPTION_KEY
  ).toString(CryptoJS.enc.Utf8);
  res.json(decryptedAmount);
}
