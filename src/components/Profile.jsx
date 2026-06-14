import React, { useState, useEffect } from "react";
import { Star, MapPin, Award, BookOpen, User, X } from "lucide-react";
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
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto px-4 py-8 animate-fade-in"
      onClick={props.onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-slate-100 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-6 py-5 flex justify-between items-center relative">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <User className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-extrabold truncate pr-4">{props.Name}</h2>
          </div>
          <button
            onClick={props.onClose}
            className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Top Profile Summary */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-slate-100">
            {props.Image_Url && (
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-indigo-50 shadow-md shrink-0 bg-slate-50">
                <img
                  src={props.Image_Url}
                  alt={props.Name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center space-x-1 bg-yellow-50 px-2.5 py-0.5 rounded-full border border-yellow-100">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-bold text-yellow-700">
                  {props.Rating} / 5.0 {language === "hi" ? "रेटिंग" : "Rating"}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-800">
                {language === "hi" ? "सत्यापित कानूनी विशेषज्ञ" : "Verified Legal Specialist"}
              </h3>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InfoBlock
              title={language === "hi" ? "अदालत / स्थान" : "Court Location"}
              content={props.Location}
              icon={<MapPin className="h-5 w-5 text-indigo-500" />}
            />
            <InfoBlock
              title={language === "hi" ? "विशेषज्ञता" : "Specialization"}
              content={props.Specialization}
              icon={<BookOpen className="h-5 w-5 text-indigo-500" />}
            />
            <InfoBlock
              title={language === "hi" ? "अनुभव" : "Experience"}
              content={props.Experience}
              icon={<Award className="h-5 w-5 text-indigo-500" />}
            />
            <InfoBlock 
              title={language === "hi" ? "शहर" : "City"} 
              content={props.City} 
              icon={<MapPin className="h-5 w-5 text-indigo-500" />} 
            />
          </div>

          {/* Description Full Width */}
          {props.Description && (
            <div className="bg-slate-50 border border-slate-100/80 p-5 rounded-2xl shadow-inner">
              <h3 className="font-extrabold text-slate-900 mb-2.5 text-sm uppercase tracking-wider text-indigo-750">
                {language === "hi" ? "वकील विवरण" : "Advocate Description"}
              </h3>
              <p className="text-xs text-slate-650 leading-relaxed whitespace-pre-wrap">
                {props.Description}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-6 py-4 flex justify-end space-x-3 bg-slate-50/50">
          <Button
            variant="outline"
            className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 font-bold"
            onClick={props.onClose}
          >
            {language === "hi" ? "बंद करें" : "Close"}
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/10">
            <a href="https://www.chatbase.co/chatbot-iframe/0CXRULDX-IJ6GaESy_Wy9" target="_blank" rel="noopener noreferrer">
              {language === "hi" ? "संपर्क करें" : "Contact"}
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
      <div className="p-2 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-indigo-100/30">
        {icon}
      </div>
      <div className="min-w-0">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</h4>
        <p className="text-sm font-extrabold text-slate-800 mt-1 break-words leading-tight">{content}</p>
      </div>
    </div>
  );
};

export default Profile;
