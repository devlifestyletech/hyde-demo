import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
	apiKey: 'AIzaSyAhhRKA1XyYtnyd8dQYJndqjSqGldlJJzU',
	authDomain: 'hyde-heritage-9df6e.firebaseapp.com',
	projectId: 'hyde-heritage-9df6e',
	storageBucket: 'hyde-heritage-9df6e.appspot.com',
	messagingSenderId: '716906153647',
	appId: '1:716906153647:web:2190cbd7399d7644ed765a',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore()

export { app, db }
