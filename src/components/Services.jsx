import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, MessageSquare, Users, Scale, ArrowRight } from 'lucide-react';

const Services = () => {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'hi');

  useEffect(() => {
    const handleLangChange = () => {
      setLanguage(localStorage.getItem('language') || 'hi');
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const services = [
    {
      icon: FileText,
      title: "दस्तावेज़ विश्लेषण",
      titleEn: "Document Analysis",
      description: "भू-अभिलेख और पट्टों जैसे दस्तावेज़ों को मिनटों में सरल कानूनी भाषा और अनुभागों में अनुवादित और वर्गीकृत करें।",
      descriptionEn: "Upload deeds or records to generate immediate plain-language reports, classifying critical legal sections and guidelines."
    },
    {
      icon: MessageSquare,
      title: "प्रश्न-उत्तर सेवा (AI)",
      titleEn: "Legal AI Companion", 
      description: "नागरिक अधिकारों, रोजगार शर्तों और भूमि नियमों से जुड़े सवालों के जवाब सरल बिंदुओं में तुरंत प्राप्त करें।",
      descriptionEn: "Ask compliance-oriented questions on general state laws and receive point-by-point summaries instantly."
    },
    {
      icon: Users,
      title: "स्मार्ट वकील मैचिंग",
      titleEn: "Advocate Directory Finder",
      description: "अनुभव, अभ्यास क्षेत्रों और जिला स्तर पर सत्यापित कानूनी पेशेवरों की सूचियों में से अपना उपयुक्त वकील चुनें।",
      descriptionEn: "Filter and discover vetted local attorneys, selecting professionals specialized in civil, land, or business disputes."
    },
    {
      icon: Scale,
      title: "कॉर्पोरेट व पेटेंट अनुपालन",
      titleEn: "Innovations & Enterprise Compliance",
      description: "स्थानीय व्यापार पंजीकरण नियमों, श्रम नियमों की आवश्यकताओं और नवप्रवर्तकों के लिए पेटेंट फाइलिंग टिकट प्रणाली।",
      descriptionEn: "Track state labor compliance checklists and submit patent filings for regional inventions with live ticketing systems."
    }
  ];

  return (
    <section id="services" className="py-24 bg-[#F0F4F8] relative">
      {/* Fine divider line */}
      <div className="absolute left-0 right-0 top-0 h-[1px] bg-[#111827]/15"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Why We Are / About Section */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left sticky top-28">
            <div className="inline-flex items-center space-x-3 mb-4">
              <span className="h-[1px] w-8 bg-[#0B2545]/50"></span>
              <span className="text-xs font-bold text-[#0B2545] tracking-[4px] uppercase font-sans">
                {language === "hi" ? "हमारा परिचय" : "WHY WE ARE"}
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-sans font-black text-[#111827] leading-tight mb-6">
              {language === "hi" ? (
                <>
                  ग्रामीण समाज के लिए <br />
                  <span className="text-[#0B2545]">सरल कानूनी मार्ग</span>
                </>
              ) : (
                <>
                  Authoritative Guidance <br />
                  <span className="text-[#0B2545]">Built For Trust</span>
                </>
              )}
            </h2>
            
            <p className="text-sm text-[#111827]/60 leading-relaxed font-sans font-light tracking-wide mb-8 max-w-sm">
              {language === "hi"
                ? "हमारी परामर्श सेवाएं और एआई इंजन ग्रामीण क्षेत्रों के लोगों और उद्यमियों के अधिकारों की रक्षा करने और जटिल कानूनी प्रक्रियाओं को समझने में मदद करते हैं।"
                : "Our platform bridges the gap between state-level regulations and local operations, offering simplified document translation, AI queries, and verified legal representation."}
            </p>

            <a href="#qa" className="self-start">
              <Button variant="outline" className="border-[#111827] hover:bg-[#0B2545]/5 hover:text-[#0B2545] hover:border-[#0B2545] text-[#111827] font-sans font-bold uppercase text-xs tracking-widest rounded-none py-6 px-8 flex items-center space-x-2 group transition-all duration-300">
                <span>{language === "hi" ? "और जानें" : "Learn More"}</span>
                <span className="transform group-hover:translate-x-1 transition-transform font-sans">→</span>
              </Button>
            </a>
          </div>

          {/* Right Column: Clean List Format for Services */}
          <div className="lg:col-span-7 border-t lg:border-t-0 lg:border-l border-[#111827]/15 lg:pl-12 pt-10 lg:pt-0">
            <div className="divide-y divide-[#111827]/10">
              {services.map((service, idx) => (
                <div key={idx} className="flex items-start space-x-6 py-8 first:pt-0 last:pb-0 group">
                  {/* Clean Modern Line-Art Icon Container */}
                  <div className="p-3 bg-[#0B2545]/5 text-[#0B2545] rounded-none group-hover:bg-[#0B2545]/15 group-hover:text-[#0B2545] transition-all duration-300 shrink-0 border border-[#0B2545]/15">
                    <service.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-sans font-bold text-[#111827] uppercase tracking-wider mb-2 group-hover:text-[#0B2545] transition-colors">
                      {language === "hi" ? service.title : service.titleEn}
                    </h3>
                    <p className="text-xs text-[#111827]/60 leading-relaxed font-sans font-light tracking-wide max-w-2xl">
                      {language === "hi" ? service.description : service.descriptionEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Services;
