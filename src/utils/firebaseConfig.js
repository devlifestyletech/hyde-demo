import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
require("dotenv").config();
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
const messaging = getMessaging(app);

const fcmWeb = async () => {
return	await getToken(messaging, {vapidKey: `${process.env.REACT_APP_VAPID_KEY}`}).then((currentToken) => {
	  if (currentToken) {
		console.log('current token for client: ', currentToken);
		 return{
			status:true,
			fcm_token:currentToken !== null && currentToken !==undefined ?currentToken:null
		 }
		// Track the token -> client mapping, by sending to backend server
		// show on the UI that permission is secured
	  } else {
		console.log('No registration token available. Request permission to generate one.');
		return{
			status:false,
			message:"borsewer not permission noticaton"
		 }
		// shows on the UI that permission is required 
	  }
	}).catch((err) => {
	  console.log('An error occurred while retrieving token. ', err);
	  return{
		status:false,
		message:"create fcm token faild"
	 }
	  // catch error while creating client token
	});
  }
  


export { app, db,auth,messaging,onMessage,fcmWeb };