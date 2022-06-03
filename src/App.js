import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.less';
import 'devextreme/dist/css/dx.light.css';
import { AuthProvider } from './hooks/useAuth';

//Layout Component
import NoAuth from './layout/NoAuthLayout';
import MainLayout from './layout/MainLayout';

// import UnauthorizeRoute from './routes/unauthorize_route';
import SignInPage from './components/signin.page';
import ResetPasswordPage from './components/reset_password.page';
import ForgotPasswordPage from './components/forgot_password.page';
import ConfirmRegistrationPage from './components/confirm_registration.page';

// import AuthorizeRoute from './routes/authorize_route';
import MainPage from './components/main.page';
import FacilitiesManagementDashboardPage from './apps/facility_management/views/dashboard.page';
import BookingCalendarPage from './apps/facility_management/views/calendar.page';
import BookingListsPage from './apps/facility_management/views/lists.page';
import FacilitiesPage from './apps/facility_management/views/facilities.page';
import OccupationPage from './apps/facility_management/views/occupation.page';
import MemberDashboardPage from './apps/registration/views/RoomDashboard';
import RegistrationPage from './apps/registration/views/Registration.page';
import RoomManagement from './apps/registration/views/ProjectManagement';
import RoomDashboardPage from './apps/registration/views/RoomDashboard';
import Nearby from './apps/nearby/NearbyService';
import Announcement from './apps/announcement/Announcement';
import FixingReports from './apps/fixing_report/view/Fixing_Reports';
import FixingReportsDashboard from './apps/fixing_report/view/Fixing_Report_DashBoard';
import FixingChat from './apps/fixing_chat/screens/ChatRoom';
import LiveChat from './apps/live_chat/screens/ChatRoom';
import PaymentSuccess from './apps/payment/Payment_success';
import PaymentDashbord from './apps/payment/payment_dashbord';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* unauthorize_route */}
        <Route element={<NoAuth />}>
          <Route path="/" element={<SignInPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/confirm-registration"
            element={<ConfirmRegistrationPage />}
          />
        </Route>
        {/* authorize_route */}
        <Route path="/dashboard" element={<MainLayout />}>
          <Route path="summary" element={<MainPage />} />
          <Route
            path="facilities-reservation-dashboard"
            element={<FacilitiesManagementDashboardPage />}
          />
          <Route
            path="facilities-reservation-calendar"
            element={<BookingCalendarPage />}
          />
          <Route
            path="facilities-reservation-list"
            element={<BookingListsPage />}
          />
          <Route path="facilities-management" element={<FacilitiesPage />} />
          <Route path="occupation" element={<OccupationPage />} />
          <Route path="members-dashboard" element={<MemberDashboardPage />} />
          <Route path="members-registration" element={<RegistrationPage />} />
          <Route
            path="rooms-management-dashboard"
            element={<RoomDashboardPage />}
          />
          <Route path="rooms-management" element={<RoomManagement />} />
          <Route path="nearby" element={<Nearby />} />
          <Route path="announcement" element={<Announcement />} />
          <Route path="service-center-reports" element={<FixingReports />} />
          <Route
            path="service-center-dashboard"
            element={<FixingReportsDashboard />}
          />
          <Route path="service-chat" element={<FixingChat />} />
          <Route path="live-chat" element={<LiveChat />} />
          <Route path="payment-billing" element={<PaymentSuccess />} />
          <Route path="payment-dashboard" element={<PaymentDashbord />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
