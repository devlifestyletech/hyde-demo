import {signInAnonymously} from 'firebase/auth';
import React, {useEffect} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import './App.less';
import Announcement from './apps/announcement/Announcement';
import FacilitiesManagementDashboardPage
  from './apps/facility_management/views/FacilitiesManagementDashboardPage';
import FacilitiesManage
  from './apps/facility_management/views/FacilitiesManagePage';

import BookingListsPage from './apps/facility_management/views/ListsPage';
import Occupation from './apps/facility_management/views/OccupationPage';
import FixingChat from './apps/fixing_chat/screens/ChatRoom';
import FixingReportsDashboard
  from './apps/fixing_report/view/Fixing_Report_DashBoard';
import FixingReports from './apps/fixing_report/view/Fixing_Reports';
import LiveChat from './apps/live_chat/screens/ChatRoom';
import Nearby from './apps/nearby/NearbyService';
import PaymentDashboard from './apps/payment/payment_dashbord';
import PaymentSuccess from './apps/payment/Payment_success';
import MemberDashboardPage from './apps/registration/views/MemberDashboard';
import RoomManagement from './apps/registration/views/ProjectManagement';
import Registration from './apps/registration/views/Registration';
import AdminManagementPage from './apps/settings/views/AdminManagementPage';
import ChangePasswordPage from './apps/settings/views/ChangePasswordPage';
import ProfilePage from './apps/settings/views/ProfilePage';
import ConfirmRegistrationPage from './components/ConfirmRegistrationPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
//Authorized routes
import MainDashboard from './components/MainDashboardPage';
import NoContent from './components/NoContentPage';
import ResetPasswordPage from './components/ResetPasswordPage';
//Unauthorized routes
import Signin from './components/SignInPage';
import {AuthProvider} from './hooks/useAuth';

//Layout Component
import MainLayout from './layout/MainLayout';
import NoAuthLayout from './layout/NoAuthLayout';
import {auth, messaging, onMessage} from './utils/firebaseConfig';

const App = () => {
  useEffect(() => {
    signInAnonymously(auth).then(() => {
      // Signed in..
      console.debug('Firebase signed in succcessfully');
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('error: ', errorCode, errorMessage);
    });
    onMessage(messaging, (payload) => {
      // (payload);
    });
  }, []);

  return (
      <AuthProvider>
        <Routes>
          {/* unauthorized_route */}
          <Route element={<NoAuthLayout />}>
            <Route index element={<Signin />} />
            <Route path='/signin' element={<Signin />} />
            <Route path='/forgot-password' element={<ForgotPasswordPage />} />
            <Route path='/reset-password' element={<ResetPasswordPage />} />
            <Route
                path='/confirm-registration'
                element={<ConfirmRegistrationPage />}
            />
          </Route>
          {/* authorized_route */}
          <Route path='dashboard' element={<MainLayout />}>
            <Route path='summary' element={<MainDashboard />} />
            <Route
                path='facilities/reservation-dashboard'
                element={<FacilitiesManagementDashboardPage />}
            />

            <Route
                path='facilities/reservation-list'
                element={<BookingListsPage />}
            />
            <Route path='facilities/management'
                   element={<FacilitiesManage />} />
            <Route path='facilities/occupation' element={<Occupation />} />
            <Route path='members/dashboard' element={<MemberDashboardPage />} />
            <Route path='members/registration' element={<Registration />} />
            <Route path='members/rooms-management'
                   element={<RoomManagement />} />
            <Route path='nearby' element={<Nearby />} />
            <Route path='announcement' element={<Announcement />} />
            <Route path='services/reports' element={<FixingReports />} />
            <Route
                path='services/dashboard'
                element={<FixingReportsDashboard />}
            />
            <Route path='services/chat' element={<FixingChat />} />
            <Route path='live-chat' element={<LiveChat />} />
            <Route path='payment/billing' element={<PaymentSuccess />} />
            <Route path='payment/dashboard' element={<PaymentDashboard />} />
            <Route path='settings/profile' element={<ProfilePage />} />
            <Route
                path='settings/change-password'
                element={<ChangePasswordPage />}
            />
            <Route
                path='settings/admin-management'
                element={<AdminManagementPage />}
            />
            <Route path='*' element={<NoContent />} />
          </Route>
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </AuthProvider>
  );
};

export default App;
