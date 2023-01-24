"use strict";

self.__WB_DISABLE_DEV_LOGS = true;

self.addEventListener("push", (event) => {
  console.log("--------- push event received ----------");

  const title =
    (event.data && JSON.parse(event.data.text()).title) ||
    "You have a new notification • Carbon";
  const body =
    (event.data && JSON.parse(event.data.text()).body) || "Tap to open";
  const tag = `dysperse-notification-${new Date().getTime()}`;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      tag,
      icon: "https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@latest/v5/ios/192.png",
      vibrate: [200, 100, 200],
      badge:
        "https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@latest/v6/20230123_114910_0000.png",
      actions: (event.data && JSON.parse(event.data.text()).actions) || [],
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  let path = "/";

  switch (event.action) {
    case 'startDailyRoutine':
      path = "/coach#daily-routine"
      break;
  }

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        if (clientList.length > 0) {
          let client = clientList[0];
          for (let i = 0; i < clientList.length; i++) {
            if (clientList[i].focused) {
              client = clientList[i];
            }
          }
          return client.focus();
        }
        return clients.openWindow(path);
      })
  );
});

self.addEventListener("pushsubscriptionchange", function (event) {
  event.waitUntil(
    Promise.all([
      Promise.resolve(
        event.oldSubscription ? deleteSubscription(event.oldSubscription) : true
      ),
      Promise.resolve(
        event.newSubscription
          ? event.newSubscription
          : subscribePush(registration)
      ).then(function (sub) {
        return saveSubscription(sub);
      }),
    ])
  );
});
