import firebase from "firebase";

const firebaseConfig = {
	apiKey: "AIzaSyDWMxIEloPi0bJsVkvGZaI-koAXzl1Jjw4",
	authDomain: "hyde-heritage.firebaseapp.com",
	projectId: "hyde-heritage",
	storageBucket: "hyde-heritage.appspot.com",
	messagingSenderId: "576054511765",
	appId: "1:576054511765:web:0c58b34f4b6afe3832339c",
	measurementId: "G-KQYG3WBZVT"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
