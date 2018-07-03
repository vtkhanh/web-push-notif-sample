'use strict';

const applicationServerPublicKey = 'BKbEctP-oHIbbz5IyXHTufRb5mAfERX0rDyOvFsnKBEL7saOkdWg9f1ez-DD1L4uL0I3aoisPKP8pQ62OdlIh00';
//const privateKey = 'mmdCLR1eYKs9ofRIOUsiBmvN_390FtFMl8oN0SdTtnU';
let swRegistration;
let isSubscribed = false;
const pushButton = $('#push-btn');

if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');

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
    pushButton.textContent = 'Push Not Supported';
}

function initializeUI() {
    pushButton.off('click').on('click', function () {
        pushButton.disabled = true;
        if (isSubscribed) {
            // TODO: Unsubscribe user
        } else {
            subscribeUser();
        }
    });

    // Set the initial subscription value
    swRegistration.pushManager.getSubscription()
        .then(function (subscription) {
            isSubscribed = !(subscription === null);

            // TODO: updateSubscription(subscription);

            if (isSubscribed) {
                console.log('User IS subscribed.');
            } else {
                console.log('User is NOT subscribed.');
            }

            updateBtn();
        });
}

function updateBtn() {
    if (isSubscribed) {
        pushButton.text('Disable Push Messaging');
    } else {
        pushButton.text('Enable Push Messaging');
    }

    pushButton.disabled = false;
}