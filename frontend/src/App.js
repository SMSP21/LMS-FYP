import React from 'react';
import { useHistory, BrowserRouter, Routes, Route } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Login from './Pages/LoginPage';
import Registration from './Pages/RegistrationForm';
import HomePage from './Pages/HomePage';
import StaffDashboard from './Pages/StaffDashboard';
import MemberDashboard from './Pages/MemberDashboard';
import BookSearch from './Pages/BookSearch';
import MemberLogin from './Pages/MemberLogin';

import BookController from './Pages/Addbooks.jsx';
import BookSearchS from './Pages/BookSearchStaff.jsx';
import ViewReservation from './Pages/ViewReservation';
import { UserProvider } from './Pages/usercontext.js';
import RegistrationStaff from './Pages/RegistrationFormStaff';
import ViewDataInfo from './Pages/ViewDataInfo';
import ReturnBook from './Pages/ReturnBook';
import SuccessPage from './Pages/success.jsx';
import CancelPage from './Pages/cancel.jsx';
import UserProfile from './Pages/UserProfile.jsx';
import ShelfController from './Pages/AddShelfs.jsx';
import UserDetail from './Pages/UserDetail.jsx';
import ChangePassword from './Pages/ChangePassword.jsx';
const stripePromise = loadStripe('pk_test_51P25nf2KndXIGYlta6GiqoG83lgOkfW7QO8KBbtoHnDEDhk2U6J5pgNxhHd5qt9f4EgkQVw6HoFaI2tC9vDzbyCJ00jvTvHSsV');

function App() {
  return (
    <div>
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="/staff" element={<Login />} />
            <Route path="/member" element={<MemberLogin />} />
            <Route path="/Registration" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/staff-dashboard" element={<StaffDashboard />} />
            <Route path="/Signout" element={<HomePage />} />
            <Route path="/MemberDashboard" element={<MemberDashboard />} />
            <Route path="/book-search" element={<BookSearch />} />
            <Route path="/add-books" element={<BookController />} />
            <Route path="/book-searchs" element={<BookSearchS />} />
            <Route path="/RegistrationStaff" element={<RegistrationStaff />} />
            <Route path="/view-reservations" element={<ViewReservation />} />
            <Route path="/View-Data-Info" element={<ViewDataInfo />} />
            <Route path="/Return-book" element={<ReturnBook />} />
            <Route path="/view-profile" element={<UserProfile />} />
            <Route path="/add-shelfs" element={<ShelfController />} />
            <Route path="/user-detail" element={<UserDetail />} />
            <Route path="/change-password" element={<ChangePassword />} />
            
            
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
