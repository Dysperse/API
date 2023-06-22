async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
    {
      headers: { Authorization: "Bearer " + process.env.AI_AUTH_TOKEN },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

export default async function handler(req, res) {
  try {
    const response = await query({
      inputs: "Meet with Laura at 12",
      parameters: {
        candidate_labels: new Array(24).fill(0).map((_, i) => `${i}:00`),
      },
    });

    res.json(response);
  } catch (e: any) {
    res.json({ error: e.message });
  }
}
