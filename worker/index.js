self.addEventListener("push", (event) => {
  console.log("--------- push event received ----------");
  let title =
    (event.data && event.data.text()) ||
    "a default message if nothing was passed to us";
  let body = "We have received a push message";
  let tag = "push-simple-demo-notification-tag";
  // let icon = '/icon.png';

  event.waitUntil(self.registration.showNotification(title, { body, tag }));
});

// self.addEventListener('push', function (event) {
//    console.log("NOTIFICATION RECEIVED")
//    const data = JSON.parse(event.data.text())
//    event.waitUntil(
//       registration.showNotification("Hi there!", {
//          body: data,
//       })
//    )
// })

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
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
        return clients.openWindow("/");
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
