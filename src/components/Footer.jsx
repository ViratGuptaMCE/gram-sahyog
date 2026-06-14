import React, { useState, useEffect } from 'react';
import { Scale, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "hi");

  useEffect(() => {
    const handleLangChange = () => {
      setLanguage(localStorage.getItem("language") || "hi");
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  return (
    <footer className="bg-slate-900 text-white py-16 rounded-t-[40px] mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Scale className="h-7 w-7 text-indigo-400" />
              <h3 className="text-lg font-black tracking-tight">
                {language === "hi" ? "ग्राम सहयोग नीति मार्ग" : "Gram Sahyog"}
              </h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {language === "hi" 
                ? "ग्रामीण एवं लघु व्यापारी समुदायों को सुलभ कानूनी सशक्तिकरण प्रदान करने का डिजिटल मंच।" 
                : "Democratized legal guidance portal providing transparency and confidence for rural communities."}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-widest text-indigo-400 mb-6">
              {language === "hi" ? "सेवाएं" : "Services"}
            </h4>
            <ul className="space-y-3 text-slate-350 text-sm">
              <li>
                <a href="#upload" className="hover:text-white transition-colors">
                  {language === "hi" ? "दस्तावेज़ विश्लेषण" : "Document Analysis"}
                </a>
              </li>
              <li>
                <a href="#qa" className="hover:text-white transition-colors">
                  {language === "hi" ? "कानूनी सलाह" : "Legal AI Advice"}
                </a>
              </li>
              <li>
                <a href="#lawDynamic" className="hover:text-white transition-colors">
                  {language === "hi" ? "वकील खोज" : "Lawyer Matching"}
                </a>
              </li>
              <li>
                <a href="#corporate" className="hover:text-white transition-colors">
                  {language === "hi" ? "कॉर्पोरेट अनुपालन" : "Corporate Compliance"}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-widest text-indigo-400 mb-6">
              {language === "hi" ? "कानूनी क्षेत्र" : "Legal Domains"}
            </h4>
            <ul className="space-y-3 text-slate-350 text-sm">
              <li>{language === "hi" ? "संपत्ति व भूमि विवाद" : "Property & Deeds"}</li>
              <li>{language === "hi" ? "पारिवारिक कानून" : "Family Disputes"}</li>
              <li>{language === "hi" ? "श्रम व रोजगार अधिकार" : "Labor & Employment"}</li>
              <li>{language === "hi" ? "नागरिक संरक्षण" : "Civil Safety"}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-widest text-indigo-400 mb-6">
              {language === "hi" ? "संपर्क" : "Contact"}
            </h4>
            <ul className="space-y-4 text-slate-350 text-sm">
              <li className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4 text-indigo-400" />
                <span>+91-1800-123-4567</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="h-4 w-4 text-indigo-400" />
                <span>help@gramsahyog.gov.in</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <MapPin className="h-4 w-4 text-indigo-400" />
                <span>{language === "hi" ? "नई दिल्ली, भारत" : "New Delhi, India"}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center space-y-4">
          <p className="text-slate-500 text-xs">
            © 2026 {language === "hi" ? "ग्राम सहयोग नीति मार्ग" : "Gram Sahyog Niti Marg"}. {language === "hi" ? "सभी अधिकार सुरक्षित।" : "All rights reserved."}
          </p>
          <p className="text-slate-600 text-xs italic max-w-2xl mx-auto leading-relaxed">
            {language === "hi" 
              ? "अस्वीकरण: यह पोर्टल केवल सामान्य सूचनात्मक कानूनी सहायता प्रदान करता है। किसी भी गंभीर विधिक कार्रवाई से पूर्व अधिवक्ता की प्रत्यक्ष सलाह लें।" 
              : "Disclaimer: This platform provides automated informational legal help. Please consult a professional lawyer for binding legal actions."}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
