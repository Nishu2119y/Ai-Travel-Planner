import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';
import Home from './pages/Home.jsx';
import CreateTrip from './Create-trip/index.jsx';
import ViewTrip from './view-trip/[tripId]/index.jsx';
import ContactUsPage from './pages/ContactUs.jsx';
import MyTrips from './pages/MyTrips.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SearchResults from './pages/SearchResults.jsx';
import DestinationDetail from './pages/DestinationDetail.jsx';
import ItineraryBuilder from './pages/ItineraryBuilder.jsx';
import BookingConfirmation from './pages/BookingConfirmation.jsx';
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/',                       element: <Home /> },
      { path: '/create-trip',            element: <CreateTrip /> },
      { path: '/view-trip/:tripId',      element: <ViewTrip /> },
      { path: '/contact-us',            element: <ContactUsPage /> },
      { path: '/my-trips',              element: <MyTrips /> },
      { path: '/dashboard',             element: <Dashboard /> },
      { path: '/search-results',        element: <SearchResults /> },
      { path: '/destination/:id',       element: <DestinationDetail /> },
      { path: '/itinerary-builder',     element: <ItineraryBuilder /> },
      { path: '/booking-confirmation',  element: <BookingConfirmation /> },
    ],
  },
]);

import { CurrencyProvider } from './context/CurrencyContext.jsx';
import { BudgetProvider } from './context/BudgetContext.jsx';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <CurrencyProvider>
        <BudgetProvider>
          <Toaster />
          <RouterProvider router={router} />
        </BudgetProvider>
      </CurrencyProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
