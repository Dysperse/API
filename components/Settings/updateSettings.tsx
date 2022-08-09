import toast from "react-hot-toast";

export function updateSettings(
  key: string,
  value: string,
  debug: boolean = false,
  callback: any = () => {},
  useSyncToken: boolean = false,
  showSeparateSyncToastMessage: boolean = true
) {
  let url =
    "/api/account/update?" +
    new URLSearchParams({
      token: global.session.account.accessToken,
      data: JSON.stringify({
        [key]: value,
      }),
    });
  if (useSyncToken) {
    url =
      "/api/account/sync/updateHome?" +
      new URLSearchParams({
        accessToken: global.session.property.accessToken,
        propertyToken: global.session.property.propertyToken,
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
      fetch(
        "/api/login/?" +
          new URLSearchParams({
            token: global.session && global.session.account.accessToken,
          })
      )
        .then(() => {
          callback && callback();
          toast.success(
            useSyncToken && showSeparateSyncToastMessage
              ? "Saved! Changes might take some time to appear for other members in your home"
              : "Saved!"
          );
        })
        .catch((err) => {
          console.log(err);
          toast.error("An error occurred while trying to save your settings");
        });
      if (debug) {
        alert(JSON.stringify(res));
      }
    });
  return d;
  // global.session.account[key] = value;
}
