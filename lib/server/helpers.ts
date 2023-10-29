import { headers } from "next/headers";

export function handleApiError(error: any) {
  console.error(error);
  return Response.json({
    error: error?.message,
    status: 500,
  });
}

export function getSessionToken() {
  const token = headers().get("Authorization")?.replace("Bearer ", "");
  if (!token) throw new Error("Missing `Authorization` header");
  return token;
}
