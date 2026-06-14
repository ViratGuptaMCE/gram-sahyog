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
    <div className="min-h-screen bg-slate-50/20 relative overflow-hidden selection:bg-indigo-500/20 selection:text-indigo-900">
      {/* Premium ambient light spheres */}
      <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-indigo-300/10 to-purple-300/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute top-[40%] right-[-10%] w-[35%] h-[35%] rounded-full bg-gradient-to-br from-emerald-300/10 to-teal-300/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-5%] w-[38%] h-[38%] rounded-full bg-gradient-to-tr from-indigo-300/10 to-blue-300/10 blur-[140px] pointer-events-none"></div>

      <Header />
      
      <main className="relative z-10">
        <Hero />
        
        <div className="relative">
          <Services />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          <DocumentUploadV2 />
          <QASection />
          <LawyerMatching />
          <CorporateManager />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
