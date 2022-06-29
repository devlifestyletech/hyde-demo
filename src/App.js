import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.less';
import 'devextreme/dist/css/dx.light.css';
import { AuthProvider } from './hooks/useAuth';

//Layout Component
import MainLayout from './layout/MainLayout';
import NoAuthLayout from './layout/NoAuthLayout';
//Unauthorized routes
import Signin from './components/signin';
import ResetPasswordPage from './components/reset_password';
import ForgotPasswordPage from './components/forgot_password';
import ConfirmRegistrationPage from './components/confirm_registration';
//Authorized routes
import MainDashboard from './components/main_dashboard';
import FacilitiesManagementDashboardPage from './apps/facility_management/views/dashboard.page';
import BookingCalendarPage from './apps/facility_management/views/calendar.page';
import BookingListsPage from './apps/facility_management/views/lists.page';
import FacilitiesPage from './apps/facility_management/views/facilities.page';
import OccupationPage from './apps/facility_management/views/occupation.page';
import MemberDashboardPage from './apps/registration/views/RoomDashboard';
import RoomDashboardPage from './apps/registration/views/RoomDashboard';
import RegistrationPage from './apps/registration/views/Registration.page';
import RoomManagement from './apps/registration/views/ProjectManagement';
import Nearby from './apps/nearby/NearbyService';
import Announcement from './apps/announcement/Announcement';
import FixingReports from './apps/fixing_report/view/Fixing_Reports';
import FixingReportsDashboard from './apps/fixing_report/view/Fixing_Report_DashBoard';
import FixingChat from './apps/fixing_chat/screens/ChatRoom';
import LiveChat from './apps/live_chat/screens/ChatRoom';
import PaymentSuccess from './apps/payment/Payment_success';
import PaymentDashboard from './apps/payment/payment_dashbord';

import { getAuth, signInAnonymously } from 'firebase/auth';
import NoContent from './components/no_content';

const App = () => {
  useEffect(() => {
    const auth = getAuth();
    signInAnonymously(auth)
      .then(() => {
        // Signed in..
        console.log('Firebase signed in succcessfully');
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
          <Route path="facilities/management" element={<FacilitiesPage />} />
          <Route path="facilities/occupation" element={<OccupationPage />} />
          <Route path="members/dashboard" element={<MemberDashboardPage />} />
          <Route path="members/registration" element={<RegistrationPage />} />
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
          <Route path="*" element={<NoContent />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
  // return (
  //   <>
  //     <h1>React Router</h1>
  //     <Navigation />
  //     <button onClick={() => authService.logout()}>Logout</button>
  //     <Routes>
  //       <Route element={<PublicRoute isSignIn={isSignIn} location={location} />}>
  //         <Route index element={<Signin />} />
  //         <Route path='/landing' element={<Signin />} />
  //       </Route>
  //       <Route element={<ProtectedRoute isSignIn={isSignIn} />}>
  //         <Route path='/home' element={<Home />} />
  //         <Route path='/dashboard' element={<Dashboard />} />
  //         <Route path='/analytics' element={<Analytics />} />
  //         <Route path='/admin' element={<Admin />} />
  //       </Route>
  //       <Route path='*' element={<p>There's nothing here: 404!</p>} />
  //     </Routes>
  //   </>
  // );
};

export default App;

//
// const ProtectedRoute = ({
//                           isSignIn,
//                         }) => {
//   if (!isSignIn) {
//     return <Navigate to={'/landing'} />;
//   }
//   return <Outlet />;
// };
//
//
// const PublicRoute = ({
//                        isSignIn,
//                      }) => {
//   if (!!isSignIn) {
//     return <Navigate to={from !== "/" ? from : '/home'}/>;
//     // return navigate(from);
//   }
//   return <Outlet />;
// };
// const Navigation = () => (
//   <nav style={{ background: '#000' }}>
//     <NavLink to='/landing'>Landing</NavLink>
//     <NavLink to='/home'>Home</NavLink>
//     <NavLink to='/dashboard'>Dashboard</NavLink>
//     <NavLink to='/analytics'>Analytics</NavLink>
//     <NavLink to='/admin'>Admin</NavLink>
//   </nav>
// );
//
//
// const Landing = () => {
//   return <h2>Landing (Public: anyone can access this page)</h2>;
// };
//
// const Home = () => {
//   return <h2>Home (Protected: authenticated user required)</h2>;
// };
//
// const Dashboard = () => {
//   return <h2>Dashboard (Protected: authenticated user required)</h2>;
// };
//
// const Analytics = () => {
//   return (
//     <h2>
//       Analytics (Protected: authenticated user with permission
//       'analyze' required)
//     </h2>
//   );
// };
//
// const Admin = () => {
//   return (
//     <h2>
//       Admin (Protected: authenticated user with role 'admin' required)
//     </h2>
//   );
// };
