// import { Blob } from "buffer";
import { Formidable } from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    const formData: any = await new Promise((resolve, reject) => {
      const form = new Formidable();

      form.parse(req, (err, fields, files) => {
        if (err) reject({ err });
        resolve({ err, fields, files });
      });
    });

    let buffer = fs.readFileSync(formData.files.image[0].filepath);
    let blob = new Blob([buffer]);

    const form = new FormData();
    const url = `https://imgcdn.dev/api/1/upload/?name=image&key=${process.env.IMAGE_API_KEY}`;
    form.append("source", blob);

    const data = await fetch(url, { method: "POST", body: form }).then((res) =>
      res.json()
    );
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Couldn't upload image" });
  }
}
