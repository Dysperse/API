import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "read-only",
      credentials: [req.query.property, req.query.accessToken],
    });
    const query = JSON.parse(req.query.query);
    console.log(query);

    res.json({});
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
