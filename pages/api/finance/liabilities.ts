var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

export default function handler(req, res) {
  fetch("https://sandbox.plaid.com/liabilities/get", {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      client_id: process.env.PLAID_CLIENT_TOKEN,
      secret: process.env.PLAID_SECRET,
      access_token: req.query.access_token ?? "false",
    }),
    redirect: "follow",
  })
    .then((result) => result.json())
    .then((result) => res.json(result))
    .catch((error) => console.log("error", error));
}
