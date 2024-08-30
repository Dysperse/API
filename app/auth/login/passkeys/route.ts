import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { Notification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { server } from "@passwordless-id/webauthn";
import { NextRequest } from "next/server";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: {
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "POST,  PATCH, OPTIONS",
    },
  });
};

function parseClientDataJSON(clientDataJSON) {
  // Decode base64url to base64
  let base64 = clientDataJSON.replace(/-/g, "+").replace(/_/g, "/");

  // Decode base64 to a string
  let decodedString = atob(base64);

  // Parse the JSON string
  let clientData = JSON.parse(decodedString);

  return clientData;
}

export function utf8StringToBuffer(value: string): ArrayBuffer {
  return new TextEncoder().encode(value);
}

// Generate challenge
export async function GET(req: NextRequest) {
  try {
    const challenge = await server.randomChallenge();
    await prisma.passkeyChallenge.create({ data: { challenge } });

    return Response.json({ challenge });
  } catch (e) {
    return handleApiError(e);
  }
}

// Verify challenge for passkey REGISTRATION
export async function POST(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    const params = await getApiParams(
      req,
      [
        { name: "challenge", required: true },
        { name: "response", required: true },
        { name: "publicKey", required: true },
      ],
      { type: "BODY" }
    );

    const registrationParsed = await server.verifyRegistration(
      {
        id: params.response.id,
        rawId: params.response.rawId,
        type: params.response.type,
        authenticatorAttachment: "platform",
        user: parseClientDataJSON(params.response.response.clientDataJSON),
        clientExtensionResults: params.response.clientExtensionResults,
        response: {
          clientDataJSON: params.response.response.clientDataJSON,
          attestationObject: params.response.response.attestationObject,
          publicKey: params.publicKey,
          authenticatorData: params.response.response.authenticatorData,
          publicKeyAlgorithm: -257,
          transports: ["usb", "nfc", "ble"],
        },
      },
      {
        challenge: params.challenge,
        origin:
          process.env.NODE_ENV === "production"
            ? "https://api.dysperse.com"
            : "http://localhost:8081",
      }
    );

    console.log(registrationParsed);

    const store = await prisma.passkey.create({
      data: {
        user: { connect: { id: userId } },
        credential: registrationParsed.credential as any,
      },
    });

    return Response.json({
      success: true,
      store,
      registration: registrationParsed,
    });
  } catch (e) {
    return handleApiError(e);
  }
}

// Verify challenge for passkey LOGIN
export async function PATCH(req: NextRequest) {
  try {
    const params = await getApiParams(
      req,
      [
        { name: "challenge", required: true },
        { name: "response", required: true },
        // { name: "publicKey", required: true },
      ],
      { type: "BODY" }
    );

    // First lookup the challenge
    await prisma.passkeyChallenge.findFirstOrThrow({
      where: { challenge: params.challenge },
    });

    const credentialKey = await prisma.passkey.findFirstOrThrow({
      where: {
        credential: {
          path: ["id"],
          equals: params.response.id,
        },
      },
    });

    const authenticationParsed = await server.verifyAuthentication(
      {
        clientExtensionResults: {},
        id: params.response.id,
        rawId: params.response.rawId,
        type: "public-key",
        authenticatorAttachment: "platform",
        response: {
          authenticatorData: params.response.response.authenticatorData,
          clientDataJSON: params.response.response.clientDataJSON,
          signature: params.response.response.signature,
          userHandle: params.response.response.userHandle,
        },
      },
      {
        id: credentialKey.credential.id,
        publicKey: credentialKey.credential.publicKey,
        algorithm: "ES256",
        transports: ["internal"],
      },
      {
        challenge: params.challenge,
        origin:
          process.env.NODE_ENV === "production"
            ? "https://api.dysperse.com"
            : "http://localhost:8081",
        userVerified: true,
      }
    );

    if (!authenticationParsed) throw new Error("Authentication failed");

    const s = await prisma.session.create({
      data: {
        userId: credentialKey.userId,
      },
    });

    new Notification("FORCE", {
      title: "New login detected! 🚨🫵",
      body: "If this wasn't you, please remove this device from your account settings immediately!",
      data: {},
    }).dispatch(credentialKey.userId);

    return Response.json({
      success: authenticationParsed,
      session: s.id,
    });
  } catch (e) {
    return handleApiError(e);
  }
}
