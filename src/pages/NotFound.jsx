import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-slate-50 to-emerald-50/30 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-[20%] left-[10%] w-[35%] h-[35%] rounded-full bg-indigo-300/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[35%] h-[35%] rounded-full bg-emerald-300/10 blur-[130px] pointer-events-none"></div>

      <div className="max-w-md w-full text-center bg-white/70 backdrop-blur-md border border-slate-100 p-8 rounded-3xl shadow-2xl shadow-slate-100/40 relative z-10">
        <div className="mb-8">
          <h1 className="text-8xl font-black text-indigo-100 select-none tracking-widest animate-pulse">404</h1>
          <h2 className="text-xl font-extrabold text-slate-800 mt-4 mb-2">
            {language === "hi" ? "पेज नहीं मिला" : "Page Not Found"}
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            {language === "hi"
              ? "क्षमा करें, जिस पेज को आप ढूंढ रहे हैं वह मौजूद नहीं है या हटा दिया गया है।"
              : "Sorry, the page you are looking for does not exist or has been relocated."}
          </p>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl py-6 shadow-xl shadow-indigo-600/10 hover:scale-[1.01] active:scale-95 transition-all"
            size="lg"
          >
            <Home className="h-4 w-4 mr-2" />
            {language === "hi" ? "मुख्य पृष्ठ पर जाएं" : "Go to Home"}
          </Button>
          
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-2xl py-6 hover:scale-[1.01]"
            size="lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {language === "hi" ? "वापस जाएं" : "Go Back"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
