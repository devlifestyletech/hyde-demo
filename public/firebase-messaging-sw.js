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

messaging.onBackgroundMessage(async function(payload) {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = payload.notification.body
  //   icon: "/android-chrome-512x512.png",
  // };
    // self.registration.showNotification(notificationTitle,
    // notificationOptions);
     // Add
     const db = await openDatabase();
  const userReadWriteTransaction = db.transaction("fcm", "readwrite");
  const newObjectStore = userReadWriteTransaction.objectStore("fcm");

  newObjectStore.add({
      fcmid: new Date().getTime(),
      title: notificationTitle,
      body: notificationOptions,
      // status:true ,
      // mobilePhone:"0963292414"
  });

  userReadWriteTransaction.onsuccess = function(e) {
      console.log("Data Added");
  }
});

async function openDatabase() {
  return new Promise((resolve, reject) => {
      const request = indexedDB.open("fcm_notication");
      request.onsuccess = function(event) {
          resolve(event.target.result);
      }
      request.onupgradeneeded = function(event) {
          const db = event.target.result;
          const userObjectStore = db.createObjectStore("fcm", {keyPath: "fcmid"});
          userObjectStore.createIndex("title", "title", { unique: false });
          userObjectStore.createIndex("body", "body", { unique: true });
      }       
  }) 
}