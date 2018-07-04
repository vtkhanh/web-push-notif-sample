(function ($) {
    'use strict';

    const applicationServerPublicKey = 'BKbEctP-oHIbbz5IyXHTufRb5mAfERX0rDyOvFsnKBEL7saOkdWg9f1ez-DD1L4uL0I3aoisPKP8pQ62OdlIh00';
    //const privateKey = 'mmdCLR1eYKs9ofRIOUsiBmvN_390FtFMl8oN0SdTtnU';
    let swRegistration = null;
    let userSubscription = null;
    let isSubscribed = false;
    const pushButton = $('#push-btn');

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
        pushButton.text('Push Not Supported');
    }

    function initializeUI() {
        pushButton.off('click').on('click', function () {
            pushButton.attr('disabled', true);
            if (isSubscribed) {
                if (userSubscription) {
                    userSubscription.unsubscribe()
                        .then(function (successfull) {
                            console.log(`Your unsubscribe result: ${successfull}`);

                            if (successfull) {
                                isSubscribed = false;
                                updateSubscriptionOnServer(null);
                                updateBtn();
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        })
                } else {
                    console.log("Cannot unsubscribe user. Subscription is null!!!");
                }
            } else {
                subscribeUser();
            }
            pushButton.attr('disabled', false);
        });

        // Set the initial subscription value
        swRegistration.pushManager.getSubscription()
            .then(function (subscription) {
                isSubscribed = !(subscription === null);

                updateSubscriptionOnServer(subscription);

                if (isSubscribed) {
                    userSubscription = subscription;
                    console.log('User IS subscribed.');
                } else {
                    userSubscription = null;
                    console.log('User is NOT subscribed.');
                }

                updateBtn();
            });
    }

    function subscribeUser() {
        const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);

        // STEP 3: Ask permission and subcribe users with Push Service
        swRegistration.pushManager.subscribe({
                userVisibleOnly: true, // REQUIRED!
                applicationServerKey: applicationServerKey
            })
            .then(function (subscription) {
                console.log('User is subscribed.');

                userSubscription = subscription;

                updateSubscriptionOnServer(subscription);

                isSubscribed = true;

                updateBtn();
            })
            .catch(function (err) {
                console.log('Failed to subscribe the user: ', err);
                updateBtn();
            });
    }

    function updateBtn() {
        if (Notification.permission === 'denied') {
            pushButton.text('Push Messaging Blocked.');
            pushButton.attr('disabled', true);
            updateSubscriptionOnServer(null);
            return;
        }

        if (isSubscribed) {
            pushButton.text('Disable Push Messaging');
        } else {
            pushButton.text('Enable Push Messaging');
        }

        pushButton.attr('disabled', false);
    }

    function urlB64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // STEP 4: Store user's subscription for sending push messages later
    function updateSubscriptionOnServer(subscription) {
        // TODO: Send subscription to application server

        const subscriptionJson = $('.js-subscription-json');
        const subscriptionDetails = $('.js-subscription-details');

        if (subscription) {
            subscriptionJson.text(JSON.stringify(subscription));
            subscriptionDetails.removeClass('is-invisible');
        } else {
            subscriptionDetails.addClass('is-invisible');
        }
    }
})(jQuery);