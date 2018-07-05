// STEP 6: Handle Push event and show notification
self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    let data = {};
    if (event.data) {
        data = event.data.json();
    }

    const title = data.title;
    const options = {
        body: data.message,
        icon: 'images/logo.png'
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