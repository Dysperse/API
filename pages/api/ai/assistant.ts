export default async function handler(req, res) {
  console.log(req.body);
  const data = await fetch("https://ai.dysperse.com", {
    method: "POST",
    body: req.body,
  }).then((res) => res.json());

  res.json(data);
}
