import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Scale, Users, FileText, MessageSquare, ArrowRight } from 'lucide-react';

const Hero = () => {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'hi');

  useEffect(() => {
    const handleLangChange = () => {
      setLanguage(localStorage.getItem('language') || 'hi');
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-slate-50/40">
      {/* visual glowing background spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-indigo-300/30 to-purple-300/30 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-gradient-to-br from-emerald-300/20 to-teal-300/20 blur-[130px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-50/80 border border-indigo-100/50 rounded-full px-4 py-1.5 mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-ping"></span>
            <span className="text-xs font-bold text-indigo-800 tracking-wide uppercase">
              {language === "hi" ? "एआई-संचालित कानूनी पोर्टल" : "AI-Powered Legal Intelligence Portal"}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-6 font-display leading-tight">
            {language === "hi" ? (
              <>
                ग्रामीण क्षेत्रों के लिए <br />
                <span className="text-gradient">सुलभ एवं सरल न्याय</span>
              </>
            ) : (
              <>
                Democratizing Legal Help for <br />
                <span className="text-gradient">Rural Communities</span>
              </>
            )}
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            {language === "hi" 
              ? "दस्तावेज़ों का हिंदी विश्लेषण प्राप्त करें, हमारे एआई सहायक से प्रश्न पूछें, अपनी छोटी कंपनियों के नियमों का अनुपालन करें और सत्यापित वकीलों से तुरंत संपर्क साधें।" 
              : "Analyze land/contract documents in seconds, chat with our multilingual AI legal companion, manage rural business registrations, and connect with certified local advocates."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <a href="#upload">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xl shadow-indigo-600/15 hover:shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 duration-200 px-8 py-6 rounded-2xl flex items-center space-x-2">
                <span>{language === "hi" ? "दस्तावेज़ विश्लेषण शुरू करें" : "Start Document Analysis"}</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </a>
            <a href="#qa">
              <Button size="lg" variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 font-bold bg-white hover:border-slate-400 hover:scale-105 active:scale-95 transition-all duration-200 px-8 py-6 rounded-2xl">
                {language === "hi" ? "सहायक से सवाल पूछें" : "Consult AI Assistant"}
              </Button>
            </a>
          </div>

          {/* Core Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <a href="#upload" className="group flex flex-col items-center p-8 bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-2 transition-all duration-300">
              <div className="p-4 bg-indigo-50 rounded-2xl group-hover:bg-indigo-100 transition-colors mb-5">
                <FileText className="h-8 w-8 text-indigo-600 animate-float" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                {language === "hi" ? "दस्तावेज़ विश्लेषण" : "Document Analysis"}
              </h3>
              <p className="text-sm text-slate-500 text-center leading-relaxed">
                {language === "hi" ? "पट्टा, अनुबंध या कागजात अपलोड कर सरल सारांश पाएं।" : "Upload pattu, contracts, or records for instant summaries."}
              </p>
            </a>

            <a href="#qa" className="group flex flex-col items-center p-8 bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-2 transition-all duration-300">
              <div className="p-4 bg-emerald-50 rounded-2xl group-hover:bg-emerald-100 transition-colors mb-5">
                <MessageSquare className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">
                {language === "hi" ? "कानूनी सलाह (AI)" : "Legal AI Q&A"}
              </h3>
              <p className="text-sm text-slate-500 text-center leading-relaxed">
                {language === "hi" ? "कानून संबंधी कोई भी सवाल पूछें और तुरंत जवाब पाएं।" : "Ask any legal query and get answers formatted in points."}
              </p>
            </a>

            <a href="#lawDynamic" className="group flex flex-col items-center p-8 bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-purple-500/5 hover:-translate-y-2 transition-all duration-300">
              <div className="p-4 bg-purple-50 rounded-2xl group-hover:bg-purple-100 transition-colors mb-5">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">
                {language === "hi" ? "वकील खोजें" : "Match with Lawyers"}
              </h3>
              <p className="text-sm text-slate-500 text-center leading-relaxed">
                {language === "hi" ? "अपने जिले के अनुसार सत्यापित वकीलों से जुड़ें।" : "Connect with verified local lawyers in your district."}
              </p>
            </a>

            <a href="#corporate" className="group flex flex-col items-center p-8 bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-orange-500/5 hover:-translate-y-2 transition-all duration-300">
              <div className="p-4 bg-orange-50 rounded-2xl group-hover:bg-orange-100 transition-colors mb-5">
                <Scale className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-orange-600 transition-colors">
                {language === "hi" ? "कॉर्पोरेट व पेटेंट" : "Corporate & Patents"}
              </h3>
              <p className="text-sm text-slate-500 text-center leading-relaxed">
                {language === "hi" ? "स्टार्टअप नियमों का अनुपालन व पेटेंट फाइलिंग करें।" : "Manage compliance, regulatory filing, and local innovation patents."}
              </p>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
