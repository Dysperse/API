// pages/api/proxy.js

import http from "http";
import https from "https";
import { parse } from "url";

export default function handler(req, res) {
  const { query } = parse(req.url, true);
  const { url } = query;

  if (!url) {
    return res.status(400).json({ error: 'Missing "url" query parameter.' });
  }

  const protocol = url.startsWith("https") ? https : http;

  try {
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        return res
          .status(response.statusCode || 500)
          .json({ error: "Failed to fetch the image." });
      }

      res.setHeader("Content-Type", response.headers["content-type"]);
      response.pipe(res);
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the image." });
  }
}
