import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LegalLoader from '../components/LegalLoader';

const NotFound = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "hi");

  useEffect(() => {
    const handleLangChange = () => {
      setLanguage(localStorage.getItem("language") || "hi");
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F4F8] relative overflow-hidden flex items-center justify-center px-6 selection:bg-[#0B2545]/20 selection:text-[#111827]">
      {/* Neoclassical architectural grid lines */}
      <div className="absolute left-[8%] top-0 bottom-0 w-[1px] bg-[#0B2545]/[0.03] pointer-events-none"></div>
      <div className="absolute right-[8%] top-0 bottom-0 w-[1px] bg-[#0B2545]/[0.03] pointer-events-none"></div>

      <div className="max-w-md w-full text-center relative z-10 py-12">
        {/* Animated Gavel and Scales Visual Anchor */}
        <LegalLoader className="py-0 mb-2" />

        <div className="inline-flex items-center space-x-3 mb-6">
          <span className="h-[1px] w-8 bg-[#0B2545]/60"></span>
          <span className="text-xs font-bold text-[#0B2545] tracking-[4px] uppercase font-sans">
            {language === "hi" ? "त्रुटि ४०४" : "ERROR 404"}
          </span>
          <span className="h-[1px] w-8 bg-[#0B2545]/60"></span>
        </div>

        <div className="mb-10">
          <h1 className="text-6xl md:text-7xl font-sans text-[#111827] font-bold leading-none tracking-tight mb-6">
            {language === "hi" ? (
              <>
                पृष्ठ <span className="text-[#0B2545]">अप्राप्त</span>
              </>
            ) : (
              <>
                Page <span className="text-[#0B2545]">Lost</span>
              </>
            )}
          </h1>
          <p className="text-sm text-[#111827]/70 leading-relaxed font-sans font-light tracking-wide max-w-sm mx-auto">
            {language === "hi"
              ? "क्षमा करें, जिस पृष्ठ को आप खोज रहे हैं वह उपलब्ध नहीं है या उसका स्थान बदल दिया गया है।"
              : "The page you are looking for does not exist or has been relocated within our archives."}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={() => navigate('/')}
            className="w-full sm:w-auto bg-transparent border border-[#0B2545] text-[#0B2545] hover:bg-[#0B2545] hover:text-[#F0F4F8] font-semibold tracking-wider font-sans uppercase text-xs rounded-none py-6 px-8 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Home className="h-3.5 w-3.5" />
            <span>{language === "hi" ? "मुख्य पृष्ठ" : "Home Portal"} →</span>
          </Button>
          
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full sm:w-auto border-[#0B2545]/20 text-[#111827] hover:bg-[#0B2545]/10 bg-transparent rounded-none transition-all duration-300 uppercase font-sans text-xs tracking-wider font-bold py-6 px-8 flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{language === "hi" ? "वापस जाएं" : "Return Back"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
