import React from 'react';
import { Film, Code, Database, Zap, ShieldCheck, Ticket, Users, Layers, Award } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#7C3AED]/20 text-[#A855F7] border border-[#7C3AED]/30">
          <span>Capstone Project Showcase</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          IMovies – Movie Ticket Booking Made Simple
        </h1>
        <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
          A modern, full-stack MERN cinema ticketing web application built with a premium Midnight Cinema dark purple design system, real-time seat locking with Socket.IO, and comprehensive role-based dashboards.
        </p>
      </div>

      {/* Tech Stack Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-[#171D33] border border-[#27324A] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/20 text-[#A855F7] flex items-center justify-center">
            <Code className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Frontend</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            React.js, Vite, React Router DOM 7, Tailwind CSS, Lucide React, Recharts, and Canvas Confetti.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#171D33] border border-[#27324A] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#22C55E]/20 text-[#22C55E] flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Backend</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Node.js, Express.js, JWT Authentication, bcryptjs, Express Validator, Morgan, and Rate Limiting.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#171D33] border border-[#27324A] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Database</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Local MongoDB Community Edition, Mongoose ODM with schemas, relationships, indexing, and aggregations.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#171D33] border border-[#27324A] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Realtime & Security</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Socket.IO real-time synchronized seat locks, role-based access control (Admin, Manager, Customer), and simulated payments.
          </p>
        </div>
      </div>

      {/* Architecture Highlights */}
      <div className="p-8 rounded-3xl bg-[#171D33] border border-[#27324A] space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Layers className="w-5 h-5 text-[#A855F7]" />
          <span>Core Capabilities Implemented</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[#94A3B8]">
          <div className="space-y-2 p-4 rounded-xl bg-[#11182B] border border-[#27324A]">
            <h4 className="font-bold text-white flex items-center space-x-2">
              <Ticket className="w-4 h-4 text-[#A855F7]" />
              <span>Interactive Cinema Seat Grid</span>
            </h4>
            <p className="text-xs leading-relaxed">
              Curved screen visualization, multi-tier pricing (VIP, Premium, Regular), dynamic color states (Available, Selected, Booked, Locked), and multi-client synchronization.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-[#11182B] border border-[#27324A]">
            <h4 className="font-bold text-white flex items-center space-x-2">
              <Users className="w-4 h-4 text-[#A855F7]" />
              <span>3-Tier Role-Based Authorization</span>
            </h4>
            <p className="text-xs leading-relaxed">
              Super Admin has full CRUD and Recharts analytics; Theatre Managers have scoped controls for their assigned screens & shows; Customers browse, book, review, and cancel.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-[#11182B] border border-[#27324A]">
            <h4 className="font-bold text-white flex items-center space-x-2">
              <Film className="w-4 h-4 text-[#A855F7]" />
              <span>Instant QR & PDF Ticket Stubs</span>
            </h4>
            <p className="text-xs leading-relaxed">
              Client-side PDF generation via html2canvas and jsPDF, authentic cinema ticket perforation aesthetics, barcode pattern, and real QR code verification.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-[#11182B] border border-[#27324A]">
            <h4 className="font-bold text-white flex items-center space-x-2">
              <Award className="w-4 h-4 text-[#A855F7]" />
              <span>Midnight Cinema UI/UX</span>
            </h4>
            <p className="text-xs leading-relaxed">
              Strict adherence to the requested #0B1020, #11182B, #171D33, #7C3AED, and #A855F7 color palette with responsive layouts, glassmorphism, and loading states.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutPage;

