import React, { useState } from "react";
import MainLayout from "./layout/MainLayout";
import SignInPage from "./apps/signin.page";
import Loading from "./layout/Loading";
import "./App.less";

function App() {
	
	const [session, setSession] = useState(false);
	const [loading, setLoading] = useState(false);

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
