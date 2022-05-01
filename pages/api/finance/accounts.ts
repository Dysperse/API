import dayjs from "dayjs";

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

export default function handler(req, res) {
  fetch("https://sandbox.plaid.com/accounts/balance/get", {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      client_id: process.env.PLAID_CLIENT_TOKEN,
      secret: process.env.PLAID_SECRET,
      access_token: req.query.access_token ?? "false"
    }),
    redirect: "follow"
  })
    .then((response) => response.text())
    .then((result) => res.send(result))
    .catch((error) => console.log("error", error));
}
