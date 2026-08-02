import { useState } from 'react'
import './App.css'
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/custom/Header';
import Footer from './view-trip/[tripId]/components/Footer';

function App() {

  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default App
