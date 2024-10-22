import { NextRequest } from "next/server";

export function DELETE(req: NextRequest) {
  // Delete the user's account
  return new Response("Account deleted", { status: 200 });
}
