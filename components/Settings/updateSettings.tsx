export function updateSettings(
  key: string,
  value: string,
  debug: boolean = false,
  callback?: any
) {
  let d = fetch(
    "/api/account/update?" +
      new URLSearchParams({
        token: global.session && global.session.accessToken,
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
      ).then(callback);
      if (debug) {
        alert(JSON.stringify(res));
      }
    });
  return d;
  // global.session.user[key] = value;
}
