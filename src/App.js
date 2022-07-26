import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.less';
import 'devextreme/dist/css/dx.light.css';
import { AuthProvider } from './hooks/useAuth';
import { auth } from './utils/firebaseConfig';

//Layout Component
import MainLayout from './layout/MainLayout';
import NoAuthLayout from './layout/NoAuthLayout';
//Unauthorized routes
import Signin from './components/SignInPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ConfirmRegistrationPage from './components/ConfirmRegistrationPage';
//Authorized routes
import MainDashboard from './components/MainDashboardPage';
import FacilitiesManagementDashboardPage from './apps/facility_management/views/FacilitiesManagementDashboardPage';
import BookingCalendarPage from './apps/facility_management/views/CalendarPage';
import BookingListsPage from './apps/facility_management/views/ListsPage';
import FacilitiesManage from './apps/facility_management/views/FacilitiesManagePage';
import Occupation from './apps/facility_management/views/OccupationPage';
import MemberDashboardPage from './apps/registration/views/MemberDashboard';
import Registration from './apps/registration/views/Registration';
import RoomManagement from './apps/registration/views/ProjectManagement';
import Nearby from './apps/nearby/NearbyService';
import Announcement from './apps/announcement/Announcement';
import FixingReports from './apps/fixing_report/view/Fixing_Reports';
import FixingReportsDashboard from './apps/fixing_report/view/Fixing_Report_DashBoard';
import FixingChat from './apps/fixing_chat/screens/ChatRoom';
import LiveChat from './apps/live_chat/screens/ChatRoom';
import PaymentSuccess from './apps/payment/Payment_success';
import PaymentDashboard from './apps/payment/payment_dashbord';

import { signInAnonymously } from 'firebase/auth';
import NoContent from './components/NoContentPage';
import ProfilePage from './apps/settings/views/ProfilePage';
import ChangePasswordPage from './apps/settings/views/ChangePasswordPage';
import AdminManagementPage from './apps/settings/views/AdminManagementPage';

const App = () => {
  useEffect(() => {
    signInAnonymously(auth)
      .then(() => {
        // Signed in..
        console.debug('Firebase signed in succcessfully');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('error: ', errorCode, errorMessage);
      });
  }, []);

  return (
    <AuthProvider>
      <Routes>
        {/* unauthorized_route */}
        <Route element={<NoAuthLayout />}>
          <Route index element={<Signin />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/confirm-registration"
            element={<ConfirmRegistrationPage />}
          />
        </Route>
        {/* authorized_route */}
        <Route path="dashboard" element={<MainLayout />}>
          <Route path="summary" element={<MainDashboard />} />
          <Route
            path="facilities/reservation-dashboard"
            element={<FacilitiesManagementDashboardPage />}
          />
          <Route
            path="facilities/reservation-calendar"
            element={<BookingCalendarPage />}
          />
          <Route
            path="facilities/reservation-list"
            element={<BookingListsPage />}
          />
          <Route path="facilities/management" element={<FacilitiesManage />} />
          <Route path="facilities/occupation" element={<Occupation />} />
          <Route path="members/dashboard" element={<MemberDashboardPage />} />
          <Route path="members/registration" element={<Registration />} />
          <Route path="members/rooms-management" element={<RoomManagement />} />
          <Route path="nearby" element={<Nearby />} />
          <Route path="announcement" element={<Announcement />} />
          <Route path="services/reports" element={<FixingReports />} />
          <Route
            path="services/dashboard"
            element={<FixingReportsDashboard />}
          />
          <Route path="services/chat" element={<FixingChat />} />
          <Route path="live-chat" element={<LiveChat />} />
          <Route path="payment/billing" element={<PaymentSuccess />} />
          <Route path="payment/dashboard" element={<PaymentDashboard />} />
          <Route path="settings/profile" element={<ProfilePage />} />
          <Route
            path="settings/change-password"
            element={<ChangePasswordPage />}
          />
          <Route
            path="settings/admin-management"
            element={<AdminManagementPage />}
          />
          <Route path="*" element={<NoContent />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
