import { prisma } from "../../../../lib/server/prisma";
import { validatePermissions } from "../../../../lib/server/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "member",
    credentials: [req.query.property, req.query.accessToken],
  });

  const data = await prisma.integration.create({
    data: {
      name: req.query.name,
      inputParams: req.query.inputParams,
      outputType: req.query.outputType,
      property: { connect: { id: req.query.property } },
      user: { connect: { identifier: req.query.userIdentifier } },
      ...(req.query.boardId && {
        board: { connect: { id: req.query.boardId } },
      }),
    },
  });
  console.log(data);
  res.json(data);
};
export default handler;
