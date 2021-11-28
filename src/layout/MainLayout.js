import React from "react";
import { Layout } from "antd";
import SideMenu from "../components/SideMenu";
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";

import Dashboard from "../apps/registration/page/Dashboard";
import Registration from "../apps/registration/page/Registration";
import MainPage from "../apps/main.page";
const { Sider, Content } = Layout;
function MainLayout() {
	return (
		<BrowserRouter>
			<Layout>
				<Sider width={300} style={{ backgroundColor: "white" }}>
					<SideMenu />
				</Sider>
				<Content style={{ backgroundColor: "white", padding: 35 }}>
					<Routes>
						<Route index element={<Dashboard />} />
						<Route path='/members' element={<Dashboard />} />
						<Route path='/members/registration' element={<Registration />} />
					</Routes>
				</Content>
			</Layout>
		</BrowserRouter>
	);
}

export default MainLayout;
