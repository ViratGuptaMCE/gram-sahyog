import React, { useState, useEffect } from "react";
import { Star, MapPin, Award, BookOpen, User, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const Profile = (props) => {
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "hi");

  useEffect(() => {
    const handleLangChange = () => {
      setLanguage(localStorage.getItem("language") || "hi");
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  return (
    <div
      className="fixed inset-0 bg-[#111827]/70 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto px-4 py-8 animate-fade-in"
      onClick={props.onClose}
    >
      <div
        className="bg-[#F0F4F8] rounded-none border border-[#0B2545]/20 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0B2545] text-[#F0F4F8] px-6 py-5 flex justify-between items-center relative">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#F0F4F8]/10 rounded-none border border-[#F0F4F8]/20">
              <User className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-lg font-sans font-bold tracking-wide truncate pr-4">{props.Name}</h2>
          </div>
          <button
            onClick={props.onClose}
            className="text-[#F0F4F8]/80 hover:text-[#F0F4F8] p-1 hover:bg-white/10 rounded-none transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Top Profile Summary */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-[#0B2545]/15">
            <div className="w-24 h-24 rounded-none border border-[#0B2545]/25 flex items-center justify-center shrink-0 bg-[#0B2545]/5 text-[#00B4D8]">
              <Users className="h-12 w-12 stroke-[1.2]" />
            </div>
            
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center space-x-1 bg-[#00B4D8]/10 px-2.5 py-0.5 rounded-none border border-[#00B4D8]/30">
                <Star className="h-3.5 w-3.5 fill-[#00B4D8] text-[#00B4D8]" />
                <span className="text-xs font-bold text-[#0B2545]">
                  {props.Rating} / 5.0 {language === "hi" ? "रेटिंग" : "Rating"}
                </span>
              </div>
              <h3 className="text-base font-sans font-bold text-[#111827]">
                {language === "hi" ? "सत्यापित कानूनी विशेषज्ञ" : "Verified Legal Specialist"}
              </h3>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InfoBlock
              title={language === "hi" ? "अदालत / स्थान" : "Court Location"}
              content={props.Location}
              icon={<MapPin className="h-5 w-5 text-[#0B2545]" />}
            />
            <InfoBlock
              title={language === "hi" ? "विशेषज्ञता" : "Specialization"}
              content={props.Specialization}
              icon={<BookOpen className="h-5 w-5 text-[#0B2545]" />}
            />
            <InfoBlock
              title={language === "hi" ? "अनुभव" : "Experience"}
              content={props.Experience}
              icon={<Award className="h-5 w-5 text-[#0B2545]" />}
            />
            <InfoBlock 
              title={language === "hi" ? "शहर" : "City"} 
              content={props.City} 
              icon={<MapPin className="h-5 w-5 text-[#0B2545]" />} 
            />
          </div>

          {/* Description Full Width */}
          {props.Description && (
            <div className="bg-[#0B2545]/5 border border-[#0B2545]/15 p-5 rounded-none shadow-inner">
              <h3 className="font-bold text-[#0B2545] mb-2.5 text-xs uppercase tracking-wider">
                {language === "hi" ? "वकील विवरण" : "Advocate Description"}
              </h3>
              <p className="text-xs text-[#111827]/80 leading-relaxed whitespace-pre-wrap font-sans">
                {props.Description}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#0B2545]/15 px-6 py-4 flex justify-end space-x-3 bg-[#F0F4F8]">
          <Button
            variant="outline"
            className="rounded-none border-[#0B2545]/20 text-[#111827] hover:bg-[#0B2545]/10 font-bold font-sans text-xs uppercase tracking-wider py-5"
            onClick={props.onClose}
          >
            {language === "hi" ? "बंद करें" : "Close"}
          </Button>
          <Button className="bg-transparent border border-[#0B2545] text-[#0B2545] hover:bg-[#0B2545] hover:text-[#F0F4F8] font-bold font-sans rounded-none text-xs uppercase tracking-wider py-5 shadow-none transition-all duration-300">
            <a href="https://www.chatbase.co/chatbot-iframe/0CXRULDX-IJ6GaESy_Wy9" target="_blank" rel="noopener noreferrer" className="flex items-center">
              {language === "hi" ? "संपर्क करें" : "Contact"} →
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Reusable Info Block
const InfoBlock = ({ title, content, icon }) => {
  return (
    <div className="flex items-start space-x-3">
      <div className="p-2 bg-[#0B2545]/5 rounded-none flex items-center justify-center shrink-0 border border-[#0B2545]/10">
        {icon}
      </div>
      <div className="min-w-0">
        <h4 className="text-xs font-bold text-[#111827]/55 uppercase tracking-widest">{title}</h4>
        <p className="text-sm font-bold text-[#111827] mt-1 break-words leading-tight">{content}</p>
      </div>
    </div>
  );
};

export default Profile;
