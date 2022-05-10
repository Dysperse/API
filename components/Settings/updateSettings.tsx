export function updateSettings(
  key: string,
  value: string,
  debug: boolean = false
) {
  fetch("https://api.smartlist.tech/v2/account/update/", {
    method: "POST",
    body: new URLSearchParams({
      token: global.session && global.session.accessToken,
      data: JSON.stringify({
        [key]: value
      })
    })
  })
    .then((res) => res.json())
    .then((res) => {
      fetch(
        "/api/login/?" +
          new URLSearchParams({
            token: global.session && global.session.accessToken
          })
      );
      if (debug) {
        alert(JSON.stringify(res));
      }
    });
  global.session.user[key] = value;
}
