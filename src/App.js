import React, { useState, useEffect } from "react";
import MainLayout from "./layout/MainLayout";
import SignInPage from "./apps/signin.page";
import Loading from "./layout/Loading";
import "./App.less";
import { encryptStorage } from "./utils/encryptStorage";

function App() {
	const [session, setSession] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
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
	return (
		<SignInPage
			fakeAuth={() => {
				setLoading(true);
				setTimeout(() => {
					setSession(true);
					setLoading(false);
				}, 500);
			}}
		/>
	);
}

export default App;
