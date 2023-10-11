export default async function handler(req, res) {
  const data = await fetch("https://ai.dysperse.com", {
    method: "POST",
    body: req.body,
  }).then((res) => res.json());
  console.log(data);
  res.json(data);
}
