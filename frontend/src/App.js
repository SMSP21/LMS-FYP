import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Login from './Pages/LoginPage';
import Registration from './Pages/RegistrationForm';
import HomePage from './Pages/HomePage';
import StaffDashboard from './Pages/StaffDashboard';
import MemberDashboard from './Pages/MemberDashboard';
import BookSearch from './Pages/BookSearch';
import MemberLogin from './Pages/MemberLogin';

import Payement from './Pages/Payement';
import BookController from './Pages/Addbooks.jsx';
import BookSearchS from './Pages/BookSearchStaff.jsx';
import ViewReservation from './Pages/ViewReservation';
import { UserProvider } from './Pages/usercontext.js';
import RegistrationStaff from './Pages/RegistrationFormStaff';
import ViewDataInfo from './Pages/ViewDataInfo';
import ReturnBook from './Pages/ReturnBook';
const stripePromise = loadStripe('your_stripe_publishable_key');

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
          <Route path="/staff-dashboard"  element={<StaffDashboard />} />
        
          <Route path="/Signout" element={<HomePage />} />
          <Route path="/MemberDashboard" element={<MemberDashboard />} />
          <Route path="/book-search" element={<BookSearch />} />
          
          <Route path="/add-books" element={< BookController/>} /> 
          <Route path="/book-searchs" element={<BookSearchS />} />
          
          <Route path="/RegistrationStaff" element={<RegistrationStaff />} />
          <Route path="/view-reservations" element={<ViewReservation />} />
          <Route path="/View-Data-Info" element={<ViewDataInfo />} />
          <Route path="/Return-book" element={<ReturnBook />} />
          <Route
            path="/Payement"
            element={
              <Elements stripe={stripePromise}>
                <Payement />
              </Elements>
            }
          />
        </Routes>
        </UserProvider> 
      </BrowserRouter>
    </div>
  );
}

export default App;
