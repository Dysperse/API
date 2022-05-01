var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

export default function handler(req, res) {
  fetch("https://sandbox.plaid.com/link/token/create", {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      client_id: process.env.PLAID_CLIENT_TOKEN,
      secret: process.env.PLAID_SECRET,
      client_name: "Smartlist",
      country_codes: ["US"],
      language: "en",
      user: {
        client_user_id: "unique_user_id"
      },
      products: ["auth"]
    }),
    redirect: "follow"
  })
    .then((response) => response.json())
    .then((result) => res.json(result))
    .catch((error) => console.log("error", error));
}
