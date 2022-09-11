import toast from "react-hot-toast";

export function updateSettings(
  key: string,
  value: string,
  debug: boolean = false,
  callback: any = () => {},
  useSyncToken: boolean = false,
  showSeparateSyncToastMessage: boolean = true
) {
  alert(global.user.token);
  let url =
    "/api/user/update?" +
    new URLSearchParams({
      token: global.user.token,
      [key]: value,
    });
  if (useSyncToken) {
    url =
      "/api/account/sync/updateHome?" +
      new URLSearchParams({
        accessToken: global.property.accessToken,
        property: global.property.propertyId,
        data: JSON.stringify({
          [key]: value,
        }),
      });
  }
  let d = fetch(url, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((res) => {
      callback && callback();
      toast.success(
        useSyncToken && showSeparateSyncToastMessage
          ? "Saved! Changes might take some time to appear for other members in your home"
          : "Saved!"
      );
      if (debug) {
        alert(JSON.stringify(res));
      }
    });
  return d;
  // global.user[key] = value;
}
