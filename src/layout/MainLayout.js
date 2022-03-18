import React from 'react'
import { Layout } from 'antd'
import SideMenu from '../components/SideMenu'
import { Routes, Route } from 'react-router-dom'

import MainPage from '../apps/main.page'

//Members
import MemberDashboardPage from '../apps/registration/views/MemberDashboard.page'
import RegistrationPage from '../apps/registration/views/Registration.page'
import RoomManagement from '../apps/registration/views/ProjectManagement'
import RoomDashboardPage from '../apps/registration/views/RoomDashboard'

//NearbyService
import Nearby from '../apps/nearby/NearbyService'

//Announcement
import Announcement from '../apps/announcement/Announcement'

//Fixing
import FixingReports from '../apps/fixing_report/view/Fixing_Reports'
import FixingReportDashBoard from '../apps/fixing_report/view/Fixing_Report_DashBoard'

//Chat
import JoinRoom from '../apps/chat/screens/JoinRoom'

//Facilities
import FacilitiesManagementDashboardPage from '../apps/facility_management/views/dashboard.page'
import BookingCalendarPage from '../apps/facility_management/views/calendar.page'
import BookingListsPage from '../apps/facility_management/views/lists.page'
import OccupationPage from '../apps/facility_management/views/occupation.page'
import FacilitiesPage from '../apps/facility_management/views/facilities.page'

//payment
import Payment_success from '../apps/payment/Payment_success'
import Payment_dashbord from '../apps/payment/payment_dashbord'
//Account confirm

const { Sider, Content } = Layout
function MainLayout() {
	return (
		<Layout>
			<Sider
				width={275}
				style={{
					backgroundColor: 'white',
					height: '100vh',
					position: 'fixed',
					left: 0,
					overflow: 'auto',
					paddingBottom: 55,
				}}
			>
				<SideMenu />
			</Sider>
			<Content style={{ backgroundColor: 'white', padding: 35, marginLeft: 275 }}>
				<Routes>
					<Route index element={<MainPage />} />
					{/* Facilities */}
					<Route path='/facility-reservation' element={<FacilitiesManagementDashboardPage />} />
					<Route path='/facility-reservation/calendar' element={<BookingCalendarPage />} />
					<Route path='/facility-reservation/list' element={<BookingListsPage />} />
					<Route path='/facility-reservation/facilities' element={<FacilitiesPage />} />
					<Route path='/facility-reservation/occupation' element={<OccupationPage />} />
					{/* Members */}
					<Route path='/members' element={<MemberDashboardPage />} />
					<Route path='/members/registration' element={<RegistrationPage />} />
					<Route path='/members/roomManagement' element={<RoomManagement />} />
					<Route path='/members/roomDashboard' element={<RoomDashboardPage />} />

					{/* Nearby */}
					<Route path='/nearby' element={<Nearby />} />
					<Route path='/announcement' element={<Announcement />} />

					{/* Fixing */}
					<Route path='/service-center-reports' element={<FixingReports />} />
					<Route path='/service-center-dashBoard' element={<FixingReportDashBoard />} />

					{/* Chat */}
					<Route path='/join-room' element={<JoinRoom />} />

					{/* Payment */}
					<Route path='/payment/bill-payment' element={<Payment_success />} />
					<Route path='/payment/Paymentdashbord' element={<Payment_dashbord />} />
				</Routes>
			</Content>
		</Layout>
	)
}

export default MainLayout
