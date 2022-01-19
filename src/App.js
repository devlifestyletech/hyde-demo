import React, { useState, useEffect } from "react";
import MainLayout from "./layout/MainLayout";
import SignInPage from "./apps/signin.page";
import Loading from "./layout/Loading";
import "./App.less";
import { encryptStorage } from "./utils/encryptStorage";
import "devextreme/dist/css/dx.light.css";
import { app } from "./utils/firebaseConfig";
import { getAuth, signInAnonymously } from "firebase/auth";
require("dotenv").config();

function App() {
	const [session, setSession] = useState(false);
	const [loading, setLoading] = useState(true);

	const auth = getAuth();

	useEffect(() => {
		signInAnonymously(auth)
			.then(() => {
				console.log("Sign in with anonymously");
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
			});
		const session = encryptStorage.getItem("user_session");
		if (session) {
			setSession(session);
		}
		setLoading(false);
	}, []);

	if (loading) {
		return <Loading />;
	}
	if (session) {
		return <MainLayout />;
	}
	return <SignInPage />;
}

export default App;
