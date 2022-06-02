/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import { Layout } from 'antd';
import SideMenu from '../components/SideMenu';
import { Navigate, useOutlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// import MainPage from '../apps/main.page';

// //Members
// import MemberDashboardPage from '../apps/registration/views/MemberDashboard.page';
// import RegistrationPage from '../apps/registration/views/Registration.page';
// import RoomManagement from '../apps/registration/views/ProjectManagement';
// import RoomDashboardPage from '../apps/registration/views/RoomDashboard';

// //NearbyService
// import Nearby from '../apps/nearby/NearbyService';

// //Announcement
// import Announcement from '../apps/announcement/Announcement';

// //Fixing
// import FixingReports from '../apps/fixing_report/view/Fixing_Reports';
// import FixingReportDashBoard from '../apps/fixing_report/view/Fixing_Report_DashBoard';
// import FixingChat from '../apps/fixing_chat/screens/ChatRoom';

// //Chat
// import LiveChat from '../apps/live_chat/screens/ChatRoom';

// //Facilities
// import FacilitiesManagementDashboardPage from '../apps/facility_management/views/dashboard.page';
// import BookingCalendarPage from '../apps/facility_management/views/calendar.page';
// import BookingListsPage from '../apps/facility_management/views/lists.page';
// import OccupationPage from '../apps/facility_management/views/occupation.page';
// import FacilitiesPage from '../apps/facility_management/views/facilities.page';

// //payment
// import Payment_success from '../apps/payment/Payment_success';
// import Payment_dashbord from '../apps/payment/payment_dashbord';
// //Account confirm

const { Sider, Content } = Layout;
function MainLayout() {
  const location = useLocation(); // <-- get current location being accessed
  const { isSignIn } = useAuth();
  const outlet = useOutlet();
  if (!isSignIn) return <Navigate to="/signin" state={{ from: location }} />;

  return (
    <Layout>
      <Sider
        width={300}
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
      <Content
        style={{ backgroundColor: 'white', padding: 35, marginLeft: 300 }}
      >
        {outlet}
      </Content>
    </Layout>
  );
}

export default MainLayout;
