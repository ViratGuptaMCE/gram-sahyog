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
    <footer className="bg-[#111827] text-[#F0F4F8] py-16 mt-20 border-t border-[#0B2545]/25">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Scale className="h-5 w-5 text-[#00B4D8]" />
              <h3 className="text-lg font-sans font-bold tracking-wide text-[#F0F4F8]">
                {language === "hi" ? "न्याय सहयोग" : "Nyay Sahyog"}
              </h3>
            </div>
            <p className="text-[#F0F4F8]/60 text-xs leading-relaxed font-sans font-light tracking-wide">
              {language === "hi" 
                ? "ग्रामीण एवं लघु व्यापारी समुदायों को सुलभ कानूनी सशक्तिकरण प्रदान करने का डिजिटल मंच।" 
                : "Democratized legal guidance portal providing transparency and confidence for rural communities."}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[2.5px] text-[#00B4D8] mb-6 font-sans">
              {language === "hi" ? "सेवाएं" : "Services"}
            </h4>
            <ul className="space-y-3 text-[#F0F4F8]/70 text-xs font-sans font-light tracking-wide">
              <li>
                <a href="#upload" className="hover:text-[#00B4D8] transition-colors">
                  {language === "hi" ? "दस्तावेज़ विश्लेषण" : "Document Analysis"}
                </a>
              </li>
              <li>
                <a href="#qa" className="hover:text-[#00B4D8] transition-colors">
                  {language === "hi" ? "कानूनी सलाह" : "Legal AI Advice"}
                </a>
              </li>
              <li>
                <a href="#lawDynamic" className="hover:text-[#00B4D8] transition-colors">
                  {language === "hi" ? "वकील खोज" : "Lawyer Matching"}
                </a>
              </li>
              <li>
                <a href="#corporate" className="hover:text-[#00B4D8] transition-colors">
                  {language === "hi" ? "कॉर्पोरेट अनुपालन" : "Corporate Compliance"}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[2.5px] text-[#00B4D8] mb-6 font-sans">
              {language === "hi" ? "कानूनी क्षेत्र" : "Legal Domains"}
            </h4>
            <ul className="space-y-3 text-[#F0F4F8]/70 text-xs font-sans font-light tracking-wide">
              <li>{language === "hi" ? "संपत्ति व भूमि विवाद" : "Property & Deeds"}</li>
              <li>{language === "hi" ? "पारिवारिक कानून" : "Family Disputes"}</li>
              <li>{language === "hi" ? "श्रम व रोजगार अधिकार" : "Labor & Employment"}</li>
              <li>{language === "hi" ? "नागरिक संरक्षण" : "Civil Safety"}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[2.5px] text-[#00B4D8] mb-6 font-sans">
              {language === "hi" ? "संपर्क" : "Contact"}
            </h4>
            <ul className="space-y-4 text-[#F0F4F8]/70 text-xs font-sans font-light tracking-wide">
              <li className="flex items-center space-x-2.5">
                <Phone className="h-3.5 w-3.5 text-[#00B4D8]" />
                <span>+91-1800-123-4567</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="h-3.5 w-3.5 text-[#00B4D8]" />
                <span>madewith.love@in</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <MapPin className="h-3.5 w-3.5 text-[#00B4D8]" />
                <span>{language === "hi" ? "दिल्ली, भारत" : "Delhi, India"}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#0B2545]/15 mt-12 pt-8 text-center space-y-4">
          <p className="text-[#F0F4F8]/45 text-xs font-sans font-light tracking-widest uppercase">
            © 2026 {language === "hi" ? "न्याय सहयोग" : "Nyay Sahyog"}. {language === "hi" ? "सभी अधिकार सुरक्षित।" : "All rights reserved."}
          </p>
          <p className="text-[#F0F4F8]/40 text-xs italic max-w-2xl mx-auto leading-relaxed">
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
