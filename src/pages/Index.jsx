
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header />
      <main>
        <Hero />
        <Services />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
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
