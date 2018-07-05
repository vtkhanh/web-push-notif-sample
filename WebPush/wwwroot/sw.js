self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    // let data = {};
    // if (event.data) {
    //     data = event.data.json();
    // }

    console.log('[Service Worker] Notification Recieved:');
    // console.log(data);

    const title = "Demo";
    const options = {
        body: "hello world",
        icon: 'images/icon.png'
    };

    const notifPromise = self.registration.showNotification(title, options);
    event.waitUntil(notifPromise);
});

self.addEventListener('notificationclick', function (event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    event.waitUntil(
        clients.openWindow('https://arp.amaris.com/')
    );
});