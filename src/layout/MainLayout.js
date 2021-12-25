import React from "react";
import { Layout } from "antd";
import SideMenu from "../components/SideMenu";
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";

import MemberDashboardPage from "../apps/registration/views/MemberDashboard.page";
import RegistrationPage from "../apps/registration/views/Registration.page";
import MainPage from "../apps/main.page";

//NearbyService
import Nearby from "../apps/nearby/NearbyService";

//Announcement
import Announcement from "../apps/announcement/Announcement";

//Fixing

import FixingReports from "../apps/fixing_report/view/Fixing_Reports";
import FixingReportDashBoard from "../apps/fixing_report/view/Fixing_Report_DashBoard";
import FacilitiesManagementDashboardPage from "../apps/facility_management/views/dashboard.page";
import BookingCalendarPage from "../apps/facility_management/views/calendar.page";
import BookingListsPage from "../apps/facility_management/views/lists.page";
import OccupationPage from "../apps/facility_management/views/occupation.page";
import FacilitiesPage from "../apps/facility_management/views/facilities.page";

const { Sider, Content } = Layout;
function MainLayout() {
	return (
		<BrowserRouter>
			<Layout>
				<Sider width={300} style={{ backgroundColor: "white", height: "100vh", position: "fixed", left: 0, overflow: "auto", paddingBottom: 55 }}>
					<SideMenu />
				</Sider>
				<Content style={{ backgroundColor: "white", padding: 35, marginLeft: 300 }}>
					<Routes>
						<Route index element={<MainPage />} />
						<Route path='/facility-reservation' element={<FacilitiesManagementDashboardPage />} />
						<Route path='/facility-reservation/calendar' element={<BookingCalendarPage />} />
						<Route path='/facility-reservation/list' element={<BookingListsPage />} />
						<Route path='/facility-reservation/facilities' element={<FacilitiesPage />} />
						<Route path='/facility-reservation/occupation' element={<OccupationPage />} />
						<Route path='/members' element={<MemberDashboardPage />} />
						<Route path='/members/registration' element={<RegistrationPage />} />
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
