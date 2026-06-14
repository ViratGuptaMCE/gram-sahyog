import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

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
    <section className="relative py-20 md:py-32 overflow-hidden bg-[#F0F4F8] min-h-screen flex items-center">
      {/* Background Subtle Branding Accent */}
      <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden">
        <div className="text-[26vw] font-sans font-black text-[#0B2545]/[0.02] leading-none tracking-widest uppercase select-none">
          {language === 'hi' ? 'न्याय' : 'NYAY'}
        </div>
      </div>

      {/* Grid Lines */}
      <div className="absolute left-[8%] top-0 bottom-0 w-[1px] bg-[#111827]/[0.03] hidden md:block"></div>
      <div className="absolute right-[8%] top-0 bottom-0 w-[1px] bg-[#111827]/[0.03] hidden md:block"></div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Bold Typography & Outlined Buttons */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <div className="inline-flex items-center space-x-3 mb-6">
              <span className="h-[1px] w-8 bg-[#0B2545]/40"></span>
              <span className="text-xs md:text-xs font-bold text-[#0B2545] tracking-[4px] uppercase font-sans">
                {language === "hi" ? "विधिक एआई सहायक" : "BILINGUAL AI ASSISTANT"}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-sans font-black text-[#111827] leading-[1.1] tracking-tight mb-8">
              {language === "hi" ? (
                <>
                  सरल और सुलभ <br />
                  <span className="text-[#0B2545]">द्विभाषी विधिक साथी</span>
                </>
              ) : (
                <>
                  Bilingual AI <br />
                  <span className="text-[#0B2545]">Legal Companion</span>
                </>
              )}
            </h1>

            {/* Asymmetric annotation block with clean left border */}
            <div className="mt-2 mb-10 max-w-lg border-l-2 border-[#00B4D8] pl-6 py-2">
              <p className="text-sm md:text-base text-[#111827]/70 font-sans font-light leading-relaxed tracking-wide">
                {language === "hi" 
                  ? "न्याय सहयोग मंच के माध्यम से एआई-संचालित दस्तावेज़ विश्लेषण प्राप्त करें, अपनी भाषा में कानूनी प्रश्न पूछें और विधिक सलाह प्राप्त करें।" 
                  : "Analyze contracts and deeds in seconds, query our bilingual legal companion, evaluate business compliance codes, and access verified regulatory guidelines."}
              </p>
            </div>

            {/* Outlined/Ghost Buttons with Sharp Corners & Arrow */}
            <div className="flex flex-col sm:flex-row gap-4 justify-start items-stretch sm:items-center">
              <a href="#upload">
                <Button size="lg" variant="outline" className="border-[#111827] hover:bg-[#0B2545]/5 hover:text-[#0B2545] hover:border-[#0B2545] text-[#111827] font-sans font-bold uppercase text-xs tracking-widest rounded-none py-6 px-8 flex items-center justify-center space-x-2 group transition-all duration-300">
                  <span>{language === "hi" ? "विश्लेषण शुरू करें" : "Analyze Document"}</span>
                  <span className="transform group-hover:translate-x-1 transition-transform font-sans">→</span>
                </Button>
              </a>
              <a href="#qa">
                <Button size="lg" variant="outline" className="border-[#111827]/30 hover:bg-[#0B2545]/5 hover:text-[#0B2545] hover:border-[#0B2545] text-[#111827]/75 font-sans font-bold uppercase text-xs tracking-widest rounded-none py-6 px-8 transition-all duration-300">
                  {language === "hi" ? "एआई सहायक से पूछें" : "Consult AI Companion"}
                </Button>
              </a>
            </div>
          </div>

          {/* Right Column: Framed Portrait & Testimonial Overlay */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center mt-8 lg:mt-0">
            
            {/* Custom geometric masked portrait container */}
            <div className="relative w-full max-w-[340px] md:max-w-[370px]">
              
              {/* Geometric Frame Border Accent (Diagonal cross-lines & double borders) */}
              <div className="absolute inset-0 border border-[#0B2545] translate-x-3 translate-y-3 pointer-events-none z-0"></div>
              
              {/* Main Photo Masked in Leaf/Geometric shape */}
              <div className="relative overflow-hidden aspect-[4/5] bg-[#EFEAE2] border border-[#111827] rounded-[130px_16px_130px_16px] z-10 group shadow-lg">
                <img 
                  src="/lawyers_portrait.jpg" 
                  alt="Diverse Pair of Confident Attorneys" 
                  className="w-full h-full object-cover object-center grayscale contrast-[1.03] group-hover:grayscale-0 transition-all duration-750"
                />
                
                {/* Thin line grid overlay */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none stroke-[#0B2545]/20 fill-none stroke-[0.5]" preserveAspectRatio="none">
                  <path d="M 0 0 L 100 100 M 100 0 L 0 100" />
                </svg>

                <div className="absolute inset-0 bg-[#0B2545]/5 mix-blend-color-burn pointer-events-none"></div>
              </div>

              {/* Floating Trust Testimonial Card */}
              <div className="absolute bottom-[-40px] left-[-30px] md:left-[-50px] bg-[#F0F4F8] border border-[#111827] p-4 max-w-[210px] z-20 shadow-xl flex flex-col items-start text-left animate-float">
                <div className="flex items-center space-x-3 mb-2">
                  {/* Circular client avatar */}
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-[#111827] shrink-0">
                    <img 
                      src="/client_portrait.jpg" 
                      alt="Satisfied Client Portrait" 
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-sans font-bold text-[#111827] truncate uppercase">
                      {language === "hi" ? "राधा शर्मा" : "Radha Sharma"}
                    </h4>
                    <span className="text-[11px] font-sans text-[#111827]/60 tracking-wider block">
                      {language === "hi" ? "सहकारी अध्यक्ष" : "Co-op President"}
                    </span>
                  </div>
                </div>
                
                <p className="text-xs text-[#111827]/80 font-sans tracking-wide leading-relaxed mb-1.5 italic">
                  {language === "hi" 
                    ? "“एटीएस क्लब की सलाह ने हमारी कृषि समिति की कानूनी सुरक्षा पक्की कर दी।”" 
                    : "“The prompt audit and legal matching gave our local co-op total security.”"}
                </p>

                {/* Star Rating below */}
                <div className="flex items-center space-x-0.5 text-[#00B4D8]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 fill-current" />
                  ))}
                </div>
              </div>

            </div>

            {/* Sub-label */}
            <div className="mt-16 text-left max-w-[280px] self-start lg:self-end pr-4">
              <span className="text-xs text-[#0B2545] font-sans font-bold block mb-1">
                {language === "hi" ? "• न्याय सहयोग पहल" : "• NYAY SAHYOG INITIATIVE"}
              </span>
              <p className="text-[11px] text-[#111827]/60 font-sans leading-relaxed tracking-wide">
                {language === "hi"
                  ? "सभी संसाधन और संपर्क सत्यापित विनियामक मानकों पर आधारित हैं।"
                  : "All legal resources and listings are structured on verified regulatory foundations and customized for local user assistance."}
              </p>
            </div>

          </div>
        </div>

        {/* Dynamic Navigational Grid Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-t border-[#111827]/15 mt-20 pt-8">
          
          <a href="#upload" className="group flex flex-col p-6 border-b md:border-b-0 md:border-r border-[#111827]/10 hover:bg-[#0B2545]/5 transition-all duration-300">
            <span className="text-xs font-bold text-[#0B2545] tracking-widest uppercase mb-4">01 / ANALYZER</span>
            <h3 className="text-lg font-sans font-bold text-[#111827] mb-2 group-hover:text-[#0B2545] transition-colors">
              {language === "hi" ? "दस्तावेज़ विश्लेषण" : "Document Analysis"}
            </h3>
            <p className="text-xs text-[#111827]/60 leading-relaxed font-sans font-light">
              {language === "hi" ? "पट्टा या अन्य कागजात अपलोड कर हिंदी सारांश पाएं।" : "Upload deeds or records for instant simplified reports."}
            </p>
          </a>

          <a href="#qa" className="group flex flex-col p-6 border-b md:border-b-0 md:border-r border-[#111827]/10 hover:bg-[#0B2545]/5 transition-all duration-300">
            <span className="text-xs font-bold text-[#0B2545] tracking-widest uppercase mb-4">02 / AI COUNSEL</span>
            <h3 className="text-lg font-sans font-bold text-[#111827] mb-2 group-hover:text-[#0B2545] transition-colors">
              {language === "hi" ? "कानूनी सलाह (AI)" : "Legal AI Assistant"}
            </h3>
            <p className="text-xs text-[#111827]/60 leading-relaxed font-sans font-light">
              {language === "hi" ? "कानून संबंधी कोई भी सवाल पूछें और तुरंत जवाब पाएं।" : "Consult our interactive AI legal expert on general laws."}
            </p>
          </a>

          <a href="#lawDynamic" className="group flex flex-col p-6 border-b md:border-b-0 md:border-r border-[#111827]/10 hover:bg-[#0B2545]/5 transition-all duration-300">
            <span className="text-xs font-bold text-[#0B2545] tracking-widest uppercase mb-4">03 / DIRECTORY</span>
            <h3 className="text-lg font-sans font-bold text-[#111827] mb-2 group-hover:text-[#0B2545] transition-colors">
              {language === "hi" ? "वकील निर्देशिका" : "Advocate Directory"}
            </h3>
            <p className="text-xs text-[#111827]/60 leading-relaxed font-sans font-light">
              {language === "hi" ? "अपने जिले में उपलब्ध सत्यापित कानूनी विशेषज्ञों की सूची देखें।" : "Browse specialty profiles of vetted legal specialists in your district."}
            </p>
          </a>

          <a href="#corporate" className="group flex flex-col p-6 hover:bg-[#0B2545]/5 transition-all duration-300">
            <span className="text-xs font-bold text-[#0B2545] tracking-widest uppercase mb-4">04 / COMPLIANCE</span>
            <h3 className="text-lg font-sans font-bold text-[#111827] mb-2 group-hover:text-[#0B2545] transition-colors">
              {language === "hi" ? "कॉर्पोरेट व पेटेंट" : "Corporate & Patents"}
            </h3>
            <p className="text-xs text-[#111827]/60 leading-relaxed font-sans font-light">
              {language === "hi" ? "स्टार्टअप नियमों का अनुपालन व पेटेंट फाइलिंग करें।" : "Filing guides and compliance managers for local businesses."}
            </p>
          </a>

        </div>

      </div>
    </section>
  );
};

export default Hero;
