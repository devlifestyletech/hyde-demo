import React, { useLayoutEffect, useState, useEffect } from 'react'
import MainLayout from './layout/MainLayout'
import SignInPage from './apps/signin.page'
import Loading from './layout/Loading'
import './App.less'
import 'devextreme/dist/css/dx.light.css'
import { encryptStorage } from './utils/encryptStorage'
import { getAuth, signInAnonymously } from 'firebase/auth'

require('dotenv').config()
const auth = getAuth()

function App() {
	const [session, setSession] = useState(false)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const session = encryptStorage.getItem('user_session')
		signInAnonymously(auth)
			.then(() => {
				// Signed in..
				console.log('Signed in successfully')
			})
			.catch((error) => {
				const errorCode = error.code
				const errorMessage = error.message
				console.log(errorCode, errorMessage)
			})
		if (session) {
			setSession(session)
		}
		setLoading(false)
	}, [])

	function useWindowSize() {
		const [size, setSize] = useState([0, 0])
		useLayoutEffect(() => {
			function updateSize() {
				setSize([window.innerWidth, window.innerHeight])
			}
			window.addEventListener('resize', updateSize)
			updateSize()
			return () => window.removeEventListener('resize', updateSize)
		}, [])
		return size
	}

	const [width] = useWindowSize()

	if (width <= 520) {
		return <div>Please use desktop</div>
	} else {
		if (loading) {
			return <Loading />
		}
		if (session) {
			return <MainLayout />
		}
		return <SignInPage />
	}
}

export default App
