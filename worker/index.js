self.addEventListener("push", (event) => {
   console.log("--------- push event received ----------");

   const title = (event.data && JSON.parse(event.data.text()).title) || "You have a new notification • Carbon";
   const body = (event.data && JSON.parse(event.data.text()).body) || "Click to open";
   const tag = "carbon-notification";

   event.waitUntil(
      self.registration.showNotification(title, {
         body,
         tag,
         icon: "https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@latest/v3/android/android-launchericon-192-192.png",
         vibrate: [200, 100, 200],
         badge: "https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@latest/notification_updated.png",
         requireInteraction: true,
         actions: (event.data && JSON.parse(event.data.text()).actions) || []
      })
   )
});

self.addEventListener('notificationclick', function (event) {
   event.notification.close()
   event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
         if (clientList.length > 0) {
            let client = clientList[0]
            for (let i = 0; i < clientList.length; i++) {
               if (clientList[i].focused) {
                  client = clientList[i]
               }
            }
            return client.focus()
         }
         return clients.openWindow('/')
      })
   )
})

self.addEventListener('pushsubscriptionchange', function (event) {
   event.waitUntil(
      Promise.all([
         Promise.resolve(event.oldSubscription ? deleteSubscription(event.oldSubscription) : true),
         Promise.resolve(event.newSubscription ? event.newSubscription : subscribePush(registration))
            .then(function (sub) { return saveSubscription(sub) })
      ])
   )
})

const getLists = () => {
   return new Promise((resolve, reject) => {
      fetch("/api/user").then(res => res.json())
         .then(res => {
            const selectedProperty = res.properties.find(property => property.selected) || res.properties[0]
            const propertyId = selectedProperty.propertyId;
            const accessToken = selectedProperty.accessToken;

            fetch("/api/property/lists?" + new URLSearchParams({
               propertyId,
               accessToken
            }))
               .then(result => result.json()).then(result => {
                  console.log(result)
               })
         })
   })
}

self.addEventListener('periodicsync', event => {
   if (event.tag === 'get-lists') {
      event.waitUntil(getLists());
   }
   else if (event.tag === "test-tag-from-devtools") {
      console.log(event);
   }
});