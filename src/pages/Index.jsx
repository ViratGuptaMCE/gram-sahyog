
import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Footer from '../components/Footer';
import DocumentUpload from '../components/DocumentUpload';
import QASection from '../components/QASection';
import LawyerMatching from '../components/LawyerMatching';
import CorporateManager from '../components/CorporateManager';

const Index = () => {
  return (
    <>
      <main>
        <Hero />
        <Services />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
          <DocumentUpload />
          <QASection />
          <LawyerMatching />
          <CorporateManager />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Index;
