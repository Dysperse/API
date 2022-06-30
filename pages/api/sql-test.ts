// Require and initialize outside of your main handler
const mysql = require("serverless-mysql")({
  config: {
    host: "172.99.249.137",
    user: "smartlist_data",
    password: process.env.DB_PASSWORD,
    database: "smartlist_data",
  },
});

// Main handler function
const handler = async (req, res) => {
  let results = await mysql.query("SELECT * FROM Accounts WHERE id = ?", [1]);

  await mysql.end();

  res.status(200).send(results);
};

export default handler;
