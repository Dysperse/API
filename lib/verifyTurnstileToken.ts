export async function verifyTurnstileToken(token: string) {
  const data = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: process.env.CAPTCHA_KEY as string,
        response: token,
      }),
    }
  ).then((res) => res.json());

  console.log(data);

  if (!data.success) throw new Error("Invalid captcha. Please try again.");
  return true;
}
