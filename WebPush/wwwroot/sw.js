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
        icon: 'images/logo.png',
        requireInteraction: true
    };

    if (data.withActions) {
        options.actions = [
            {
                action: 'facebook',
                title: "Let's facebook",
                icon: 'images/fb.png'
            },
            {
                action: 'twitter',
                title: "Let's twitter",
                icon: 'images/twitter.png'
            }
        ];
    }


    const notifPromise = self.registration.showNotification(title, options);
    event.waitUntil(notifPromise);
});

self.addEventListener('notificationclick', function (event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    let url = null;
    switch (event.action) {
        case 'facebook':
            url = 'https://www.facebook.com';
            break;
        case 'twitter':
            url = 'https://www.twitter.com';
            break;
        default:
            url = 'https://arp.amaris.com/';
            break;
    }

    event.waitUntil(
        clients.openWindow(url)
    );
});