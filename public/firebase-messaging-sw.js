// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
	apiKey: 'AIzaSyAhhRKA1XyYtnyd8dQYJndqjSqGldlJJzU',
	authDomain: 'hyde-heritage-9df6e.firebaseapp.com',
	projectId: 'hyde-heritage-9df6e',
	storageBucket: 'hyde-heritage-9df6e.appspot.com',
	messagingSenderId: '716906153647',
	appId: '1:716906153647:web:2190cbd7399d7644ed765a',
};


firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  // const notificationTitle = payload.notification.title;
  // const notificationOptions = {body: payload.notification.body,
  //   icon: "/android-chrome-512x512.png",
  // };
    // self.registration.showNotification(notificationTitle,
    // notificationOptions);
});

