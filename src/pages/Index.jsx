import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Footer from '../components/Footer';
import DocumentUploadV2 from '../components/DocumentUploadV2';
import QASection from '../components/QASection';
import LawyerMatching from '../components/LawyerMatching';
import CorporateManager from '../components/CorporateManager';

const Index = () => {
  return (
    <div className="min-h-screen bg-[#F0F4F8] relative overflow-hidden selection:bg-[#0B2545]/20 selection:text-[#111827]">
      <div className="absolute left-[8%] top-0 bottom-0 w-[1px] bg-[#0B2545]/[0.03] pointer-events-none"></div>
      <div className="absolute right-[8%] top-0 bottom-0 w-[1px] bg-[#0B2545]/[0.03] pointer-events-none"></div>

      <Header />
      
      <main className="relative z-10">
        <Hero />
        <Services />
        <DocumentUploadV2 />
        <QASection />
        <LawyerMatching />
        <CorporateManager />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
