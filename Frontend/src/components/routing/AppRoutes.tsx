import { Routes, Route } from 'react-router-dom';
import Onboarding from '@/pages/Onboarding';
import Home from '@/pages/Home';
import Signup from '../authentication/Signup';
import Login from '../authentication/Login';
import ForgotPassword from '../authentication/ForgotPassword';
import ResetPassword from '../authentication/ResetPassword';
import OAuthCallback from '@/pages/OAuthCallback'; // ✅ Add this
import TeamInfo from '@/pages/TeamInfo';
import DashboardLayout from '@/layouts/DashboardLayout';
import DashboardHome from '@/pages/dashboard/Home';
import Profile from '@/pages/dashboard/Profile';
import Listing from '@/pages/dashboard/Listing';
import Trade from '@/pages/dashboard/Trade';
import Messages from '@/pages/dashboard/Messages';
import Notifications from '@/pages/dashboard/Notifications';
import Settings from '@/pages/dashboard/Settings';
import Preferences from '@/pages/dashboard/Preferences';
import TradeDetails from '@/pages/dashboard/TradeDetails';
import ProposeTrade from '@/pages/dashboard/ProposeTrade';
import Filters from '@/pages/dashboard/Filters';
import PaymentMethods from '@/pages/dashboard/PaymentMethods';
import BlockedUsers from '@/pages/dashboard/BlockedUsers';
import UpdatePassword from '@/pages/dashboard/UpdatePassword';
import Privacy from '@/pages/dashboard/Privacy';
import HelpCenter from '@/pages/dashboard/HelpCenter';
import About from '@/pages/dashboard/About';
import NotFound from '@/pages/dashboard/404';
import EditProfile from '@/pages/EditProfile';
import CreateListing from '@/pages/CreateListing';
import DeleteAccount from '@/pages/DeleteAccount';
import ProtectedRoute from './ProtectedRoute';
import OtherUserProfile from '@/pages/dashboard/OtherUserProfile';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/info" element={<TeamInfo />} />

      {/* Authentication Pages */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ✅ OAuth Callback Routes - Must match Django redirect URLs */}
      <Route path="/oauth/callback" element={<OAuthCallback />} />
      <Route path="/dashboard" element={<OAuthCallback />} />
      <Route path="/onboarding" element={<OAuthCallback />} />

      {/* <Route path="/oauth/callback" element={<OAuthCallback />} /> */}

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Actual Dashboard Routes (after auth) */}
        <Route path="/app/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="trade" element={<Trade />} />
          <Route path="create-listing" element={<CreateListing />} />
          <Route path="listing" element={<Listing />} />
          <Route path="filter-listing" element={<Filters />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:listingId" element={<OtherUserProfile />} />
          <Route path="trade-details" element={<TradeDetails />} />
          <Route path="propose-trade" element={<ProposeTrade />} />
          <Route path="settings" element={<Settings />} />
          <Route path="settings/update-password" element={<UpdatePassword />} />
          <Route path="settings/privacy" element={<Privacy />} />
          <Route path="settings/preferences" element={<Preferences />} />
          <Route path="settings/payment" element={<PaymentMethods />} />
          <Route path="settings/blocked" element={<BlockedUsers />} />
          <Route path="settings/help" element={<HelpCenter />} />
          <Route path="settings/about" element={<About />} />
        </Route>

        <Route path="/app/onboarding" element={<Onboarding />} />
        <Route path="/app/dashboard/notification" element={<Notifications />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
