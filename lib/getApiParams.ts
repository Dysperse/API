import { NextRequest } from "next/server";

export async function getApiParams<T = any>(
  req: NextRequest,
  params: { name: string; required: boolean }[],
  config: { type: "BODY" | "QUERY" } = { type: "QUERY" }
): Promise<T> {
  if (config.type === "BODY") {
    const body = await req.json();

    const missingParams = params.filter((p) => !(p.name in body) && p.required);
    if (missingParams.length > 0) {
      throw new Error(
        `Missing required params: ${missingParams
          .map((p) => p.name)
          .join(", ")}`
      );
    }
    return body;
  } else if (config.type === "QUERY") {
    const query = req.nextUrl.searchParams;
    let _params = {};
    for (const param of params) {
      _params[param.name] = query.get(param.name);
      if (!query.get(param.name) && param.required) {
        throw new Error(`Missing required param: ${param.name}`);
      }
    }
    return _params as any;
  } else {
    throw new Error("Invalid config type");
  }
}
