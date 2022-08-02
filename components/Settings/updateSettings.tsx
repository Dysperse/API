import toast from "react-hot-toast";

export function updateSettings(
  key: string,
  value: string,
  debug: boolean = false,
  callback: any = () => {},
  useSyncToken: boolean = false
) {
  let d = fetch(
    "/api/account/update?" +
      new URLSearchParams({
        token: useSyncToken
          ? global.session.user.SyncToken
          : global.session.accessToken,
        data: JSON.stringify({
          [key]: value,
        }),
      }),
    {
      method: "POST",
    }
  )
    .then((res) => res.json())
    .then((res) => {
      fetch(
        "/api/login/?" +
          new URLSearchParams({
            token: global.session && global.session.accessToken,
          })
      )
        .then(() => {
          callback && callback();
          toast.success("Saved!");
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
  // global.session.user[key] = value;
}
