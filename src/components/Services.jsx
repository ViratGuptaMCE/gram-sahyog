import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, MessageSquare, Users, Scale } from 'lucide-react';

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
      description: "अपने कानूनी दस्तावेज़ या भू-अभिलेख अपलोड करें और हिंदी में सरल सारांश और जटिल शर्तों का विश्लेषण प्राप्त करें।",
      descriptionEn: "Upload your legal documents or land deeds to get a structured summary and plain-language explanation of complex terms.",
      bgClass: "bg-blue-50 group-hover:bg-blue-100",
      iconColor: "text-blue-600",
      shadowClass: "hover:shadow-blue-600/10"
    },
    {
      icon: MessageSquare,
      title: "प्रश्न-उत्तर सेवा (AI)",
      titleEn: "Legal AI Companion", 
      description: "श्रम नियमों, संपत्ति अधिकारों या नागरिक मामलों पर प्रश्न पूछें और तत्काल उचित बिंदुओं में उत्तर पाएं।",
      descriptionEn: "Ask AI legal assistant questions regarding labor, property, or civil rights and receive instant point-wise guides.",
      bgClass: "bg-emerald-50 group-hover:bg-emerald-100",
      iconColor: "text-emerald-600",
      shadowClass: "hover:shadow-emerald-600/10"
    },
    {
      icon: Users,
      title: "स्मार्ट वकील मैचिंग",
      titleEn: "Advocate Matcher",
      description: "दस्तावेज़ अपलोड के आधार पर या सीधे शहर और विशेषता द्वारा अनुभवी और विश्वसनीय स्थानीय वकीलों से संपर्क साधें।",
      descriptionEn: "Connect with verified local advocates sorted by specialization, ratings, and experience based on your case file details.",
      bgClass: "bg-purple-50 group-hover:bg-purple-100",
      iconColor: "text-purple-600",
      shadowClass: "hover:shadow-purple-600/10"
    },
    {
      icon: Scale,
      title: "कॉर्पोरेट व पेटेंट सहायता",
      titleEn: "Innovation & Enterprise",
      description: "ग्रामीण उद्यमियों के लिए व्यापार लाइसेंस अनुपालन, रोजगार कानूनों के नियम और पेटेंट आवेदन का पूरा मार्गदर्शन।",
      descriptionEn: "Ensure corporate compliance, state regulatory approvals, and file patents for local innovations with tracking tickets.",
      bgClass: "bg-orange-50 group-hover:bg-orange-100",
      iconColor: "text-orange-600",
      shadowClass: "hover:shadow-orange-600/10"
    }
  ];

  return (
    <section id="services" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-slate-50/20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            {language === "hi" ? (
              <>
                हमारी <span className="text-indigo-600">विशेष सेवाएं</span>
              </>
            ) : (
              <>
                Our <span className="text-indigo-600">Core Services</span>
              </>
            )}
          </h2>
          <p className="text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed">
            {language === "hi"
              ? "ग्रामीण और लघु व्यापारिक समुदायों के सशक्तिकरण के लिए तैयार की गई कानूनी सेवाएं"
              : "Comprehensive legal assistance tools engineered to provide maximum clarity, speed, and safety."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className={`group hover:scale-105 hover:shadow-xl ${service.shadowClass} border border-slate-100/80 transition-all duration-300 rounded-3xl bg-white p-2`}>
              <CardHeader className="text-center pb-2">
                <div className={`h-16 w-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-colors ${service.bgClass}`}>
                  <service.icon className={`h-8 w-8 ${service.iconColor}`} />
                </div>
                <CardTitle className="text-lg font-extrabold text-slate-800 mb-1">
                  {language === "hi" ? service.title : service.titleEn}
                </CardTitle>
                <CardDescription className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">
                  {language === "hi" ? service.titleEn : service.title}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center px-4 pb-6">
                <p className="text-slate-600 text-sm leading-relaxed">
                  {language === "hi" ? service.description : service.descriptionEn}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
