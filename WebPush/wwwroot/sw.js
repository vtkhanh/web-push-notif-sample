self.addEventListener('push', function (event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    const title = 'Push Notificatiom Demo';
    const options = {
        body: 'Hello world!',
        icon: 'images/icon.png'
    };

    const notifPromise = self.registration.showNotification(title, options);
    event.waitUntil(notifPromise);
});