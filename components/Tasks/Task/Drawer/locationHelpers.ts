export function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

export const videoChatPlatforms = [
  "zoom.us",
  "meet.google.com",
  "teams.microsoft.com",
  "skype.com",
  "appear.in",
  "gotomeeting.com",
  "webex.com",
  "hangouts.google.com",
  "jitsi.org",
  "whereby.com",
  "discord.com",
  "vsee.com",
  "bluejeans.com",
  "join.me",
  "appear.in",
  "tokbox.com",
  "wire.com",
  "talky.io",
  "ooVoo.com",
  "fuze.com",
  "amazonchime.com",
  "viber.com",
  "slack.com",
];

export function isAddress(str) {
  if (!str) return false;

  const mapUrls = ["maps.google.com"];
  if (mapUrls.find((url) => str.includes(url))) return true;

  if (
    /^[\w\s.,#-]+$/.test(str) ||
    str.includes(" - ") ||
    str.includes(" high school") ||
    str.includes(" elementary school") ||
    str.includes(" middle school") ||
    str.includes(" university") ||
    str.includes(", ") ||
    /\d+\s+[^,]+,\s+[^,]+,\s+\w{2}\s+\d{5}/.test(str) ||
    /^(\d+\s[A-Za-z]+\s[A-Za-z]+(?:,\s[A-Za-z]+)?)$/.test(str)
  ) {
    return true;
  }

  return false;
}
