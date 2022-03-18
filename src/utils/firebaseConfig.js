import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
	apiKey: 'AIzaSyCcIAd_romoJndTub4Rzn91oeuoES8aAeU',
	authDomain: 'artani-one-application.firebaseapp.com',
	projectId: 'artani-one-application',
	storageBucket: 'artani-one-application.appspot.com',
	messagingSenderId: '926671911042',
	appId: '1:926671911042:web:3600ab5485bf74ae5f1c9b',
	measurementId: 'G-8EW9WW8H4R',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore()

export { app, db }
