import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B1020] text-[#F8FAFC]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;

