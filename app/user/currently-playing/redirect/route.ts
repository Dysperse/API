import { getApiParams } from "@/lib/getApiParams";
import { handleApiError } from "@/lib/handleApiError";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  let sessionToken = "";
  try {
    const params = await getApiParams(req, [{ name: "token", required: true }]);
    cookies().set("sessionToken", params.token);
    sessionToken = params.token;
  } catch (e) {
    return handleApiError(e);
  }

  const spotifyParams = new URLSearchParams({
    response_type: "code",
    client_id: "27b1c11438204ca6acc88ca514c22665",
    scope: "user-read-currently-playing",
    redirect_uri: `${
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://api.dysperse.com"
    }/user/currently-playing/finish`,
    state: sessionToken,
  });

  const url = `https://accounts.spotify.com/authorize?${spotifyParams.toString()}`;
  redirect(url);
}
