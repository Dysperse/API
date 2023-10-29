import { headers } from "next/headers";
import { NextRequest } from "next/server";

export const handleApiError = (error: any) => {
  console.error(error);
  return Response.json({
    error: error?.message,
    status: 500,
  });
};

export const getSessionToken = () => {
  const token = headers().get("Authorization")?.replace("Bearer ", "");
  if (!token) throw new Error("Missing `Authorization` header");
  return token;
};

export const getApiParam = (req: NextRequest, key, required = false): any => {
  const value = req.nextUrl.searchParams.get(key);
  if (required && !value) throw new Error(`Missing value: \`${key}\``);
  return value ? decodeURIComponent(value) : null;
};
