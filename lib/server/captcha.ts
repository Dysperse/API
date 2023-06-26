export async function validateCaptcha(token: string) {
  const endpoint = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const secret: any = process.env.CAPTCHA_KEY;

  const body = `secret=${encodeURIComponent(
    secret
  )}&response=${encodeURIComponent(token)}`;

  const captchaRequest = await fetch(endpoint, {
    method: "POST",
    body,
    headers: { "content-type": "application/x-www-form-urlencoded" },
  });

  const data = await captchaRequest.json();
  return data;
}
