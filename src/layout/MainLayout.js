import React from "react";
import { Layout } from "antd";
import SideMenu from "../components/SideMenu";
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";

import Dashboard from "../apps/registration/views/Dashboard";
import Registration from "../apps/registration/views/Registration";
import MainPage from "../apps/main.page";

//NearbyService
import Nearby from "../apps/nearby/NearbyService";

//Announcement
import Announcement from "../apps/announcement/Announcement";

//Fixing

import FixingReports from "../apps/fixing_report/view/Fixing_Reports"
import FixingReportDashBoard from "../apps/fixing_report/view/Fixing_Report_DashBoard"

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
						<Route index element={<MainPage />} />
						<Route path='/members' element={<Dashboard />} />
						<Route path='/members/registration' element={<Registration />} />
						<Route path='/nearby' element={<Nearby />} />
						<Route path='/announcement' element={<Announcement />} />
						<Route path='/service-center-reports' element={<FixingReports />} />
						<Route path='/service-center-dashBoard' element={<FixingReportDashBoard />} />
					</Routes>
				</Content>
			</Layout>
		</BrowserRouter>
	);
}

export default MainLayout;
