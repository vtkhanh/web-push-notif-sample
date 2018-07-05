# Understand Web Push Notification

## Under the hood

- Service worker
- Push service

## How web-push-notification work

1. Step 1: Client side

    ![Client side](https://developers.google.com/web/fundamentals/push-notifications/images/svgs/browser-to-server.svg)

2. Step 2: Send a Push Message

    ![Send push message](https://developers.google.com/web/fundamentals/push-notifications/images/svgs/server-to-push-service.svg)

3. Step 3: Push event the the user device

    ![Push event to device](https://developers.google.com/web/fundamentals/push-notifications/images/svgs/push-service-to-sw-event.svg)

## Step by Step

1. Detect browser support

    ```js
    if (!("serviceWorker" in navigator)) {
      // Service Worker isn't supported on this browser, disable or hide UI.
      return;
    }

    if (!("PushManager" in window)) {
      // Push isn't supported on this browser, disable or hide UI.
      return;
    }
    ```

2. Register a service worker


3. Request permission

    ![Ask permission](https://i.stack.imgur.com/Bazqj.png)

4. Subscribe a user with PushManager

    ![Application server key](https://developers.google.com/web/fundamentals/push-notifications/images/svgs/application-server-key-subscribe.svg)

5. Sending message to Push service

    - Web Push Protocol
    ![Web Push Protocol](https://developers.google.com/web/fundamentals/push-notifications/images/svgs/application-server-key-send.svg)

6. Handling Push event & display Notification

    ```js
    self.addEventListener('push', function(event) {
        const notifPromise = self.registration.showNotification('Hello, World.');

        event.waitUntil(notifPromise);
    });
    ```