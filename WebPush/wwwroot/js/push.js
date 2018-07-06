(function ($) {
    'use strict';

    let swRegistration = null;
    let isSubscribed = false;
    const toggleButton = $('#toggle-btn');

    // STEP 1: Check if browsers support service-worker and PushManager APIs
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        console.log('Service Worker and Push is supported');

        // STEP 2: Register the app's service worker
        navigator.serviceWorker.register('/sw.js')
            .then(function (swReg) {
                console.log('Service Worker is registered', swReg);

                swRegistration = swReg;
                initializeUI();
            })
            .catch(function (error) {
                console.error('Service Worker Error', error);
            });
    } else {
        console.warn('Push messaging is not supported');
        toggleButton.text('Push Not Supported');
    }

    function initializeUI() {
        toggleButton.off('click').on('click', function () {
            toggleButton.attr('disabled', true);
            if (isSubscribed) {
                unsubscribeUser();
            } else {
                subscribeUser();
            }
            toggleButton.attr('disabled', false);
        });

        // Set the initial subscription value
        swRegistration.pushManager.getSubscription()
            .then(function (subscription) {
                isSubscribed = !(subscription === null);

                updateSubscriptionOnServer(subscription);

                if (isSubscribed) {
                    console.log('User IS subscribed.');
                } else {
                    console.log('User is NOT subscribed.');
                }

                updateBtn();
            });
    }

    function subscribeUser() {
        fetch('/api/Notification/ServerPublicKey', {
                method: 'GET'
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                const serverPublicKey = urlB64ToUint8Array(data.key);

                // STEP 3: Ask permission and subscribe users with Push Service
                return swRegistration.pushManager.subscribe({
                    userVisibleOnly: true, // REQUIRED!
                    applicationServerKey: serverPublicKey
                });
            })
            .then(function (subscription) {
                console.log('User is subscribed.');

                updateSubscriptionOnServer(subscription);
                isSubscribed = true;
                updateBtn();
            })
            .catch(function (err) {
                console.log('Failed to subscribe the user: ', err);
                updateBtn();
            });
    }

    function unsubscribeUser() {
        swRegistration.pushManager.getSubscription()
            .then(function (subscription) {
                if (subscription) {
                    return subscription.unsubscribe();
                }
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                console.log("User is unsubscribed.");
                isSubscribed = false;
                updateSubscriptionOnServer(null);
                updateBtn();
            });
    }

    function updateBtn() {
        if (Notification.permission === 'denied') {
            toggleButton.text('Push Messaging Blocked.');
            toggleButton.attr('disabled', true);
            updateSubscriptionOnServer(null);
            return;
        }

        if (isSubscribed) {
            toggleButton.text('Disable Push Messaging');
        } else {
            toggleButton.text('Enable Push Messaging');
        }

        toggleButton.attr('disabled', false);
    }

    // STEP 4: Store user's subscription for sending push messages later
    function updateSubscriptionOnServer(subscription) {

        // TODO: Send subscription to application server

        const subscriptionJson = $('.js-subscription-json');
        const subscriptionDetails = $('.js-subscription-details');

        if (subscription) {
            const userSubscription = {
                endpoint: subscription.endpoint,
                keys: {
                    p256dh: base64Encode(subscription.getKey('p256dh')),
                    auth: base64Encode(subscription.getKey('auth'))
                }
            };
            $('#subscription').val(JSON.stringify(userSubscription));

            subscriptionJson.text(JSON.stringify(userSubscription, null, 4));
            subscriptionDetails.removeClass('is-invisible');
        } else {
            subscriptionDetails.addClass('is-invisible');
        }
    }

})(jQuery);

function pushMessage({ url, withActions = false }) {
    const form = $('#push-message-form');
    const payload = {
        title: form.find('#title').val(),
        message: form.find('#message').val(),
        withActions: withActions
    }
    const params = {
        Subscription: JSON.parse(form.find('#subscription').val()),
        Payload: JSON.stringify(payload)
    };
    const option = {
        url: url,
        data: JSON.stringify(params),
        contentType: 'application/json'
    }

    $.post(option)
        .done(function (result) {
            console.log(result);
        })
        .fail(function (error) {
            console.log(error);
        });
}