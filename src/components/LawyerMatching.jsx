import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Star, MapPin, Award, Search, Loader2 } from 'lucide-react';
import Profile from './Profile';
import LawyerAvatar from './LawyerAvatar';
import LegalLoader from './LegalLoader';

const API_BASE = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "") : "/api";

const LawyerMatching = () => {
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "hi");
  const [searchCriteria, setSearchCriteria] = useState({
    domain: '',
    location: '',
    experience: ''
  });
  const [matchedLawyers, setMatchedLawyers] = useState([]);
  const [translatedNames, setTranslatedNames] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLawyer, setSelLawyer] = useState(null);

  useEffect(() => {
    const handleLangChange = () => {
      setLanguage(localStorage.getItem("language") || "hi");
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  const domains = [
    { value: "civil", labelEn: "Civil Law", labelHi: "दीवानी कानून" },
    { value: "criminal", labelEn: "Criminal Law", labelHi: "आपराधिक कानून" },
    { value: "family", labelEn: "Family Law", labelHi: "पारिवारिक कानून" },
    { value: "property", labelEn: "Property Law", labelHi: "संपत्ति कानून" },
    { value: "Tax", labelEn: "Tax Law", labelHi: "कर कानून" },
    { value: "Consumer Court", labelEn: "Consumer Law", labelHi: "उपभोक्ता कानून" },
  ];

  async function translateToHindi(text) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(text)}`;
      const res = await fetch(url);
      const data = await res.json();
      return data[0][0][0]; 
    } catch {
      return text;
    }
  }

  const searchLawyers = async () => {
    setIsSearching(true);
    try {
      const formData = new FormData();
      formData.append("domain", searchCriteria.domain);
      formData.append("location", searchCriteria.location);
      formData.append("experience", searchCriteria.experience || "0");

      const response = await fetch(`${API_BASE}/get_lawyers/`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setMatchedLawyers(result.lawyers || []);
        
        const translations = {};
        for (const lawyer of result.lawyers || []) {
          if (language === 'hi') {
            translations[lawyer.Name] = await translateToHindi(lawyer.Name);
          } else {
            translations[lawyer.Name] = lawyer.Name;
          }
        }
        setTranslatedNames(translations);
      } else {
        console.error("Failed to fetch lawyers");
        setMatchedLawyers([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setMatchedLawyers([]);
    }
    setIsSearching(false);
  };

  return (
    <section id="lawDynamic" className="py-24 bg-[#F0F4F8] relative">
      <div className="absolute left-0 right-0 top-0 h-[1px] bg-[#111827]/15"></div>
      
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 mb-4">
            <span className="h-[1px] w-8 bg-[#0B2545]/50"></span>
            <span className="text-xs font-bold text-[#0B2545] tracking-[4px] uppercase font-sans">
              {language === "hi" ? "अधिवक्ता निर्देशिका" : "ADVOCATE FINDER"}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-sans font-black text-[#111827] leading-tight mb-4">
            {language === "hi" ? (
              <>
                वकील <span className="text-[#0B2545]">खोज व मिलान</span>
              </>
            ) : (
              <>
                Find & Match <span className="text-[#0B2545]">Advocates</span>
              </>
            )}
          </h2>
          <p className="text-sm md:text-base text-[#111827]/60 max-w-2xl mx-auto leading-relaxed font-sans font-light tracking-wide">
            {language === "hi"
              ? "अपनी आवश्यकताओं के अनुसार विशेषज्ञ वकीलों को खोजें और संपर्क करें।"
              : "Search legal professionals by specialization, city location, and minimum experience."}
          </p>
        </div>

        <Card className="mb-10 border border-[#111827]/15 shadow-none rounded-none bg-transparent overflow-hidden p-0">
          <CardHeader className="pb-4 p-6">
            <CardTitle className="flex items-center space-x-3 text-lg font-sans font-bold text-[#111827] uppercase tracking-wider">
              <Users className="h-4 w-4 text-[#0B2545]" />
              <span>{language === "hi" ? "खोज मानदंड" : "Search Criteria"}</span>
            </CardTitle>
            <CardDescription className="text-xs text-[#111827]/60 font-sans">
              {language === "hi"
                ? "शहर, कानून का प्रकार और अनुभव दर्ज करें"
                : "Fill variables below to narrow advocate search"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="domain" className="text-xs font-bold text-[#0B2545] uppercase tracking-widest font-sans">
                  {language === "hi" ? "कानून का क्षेत्र" : "Legal Domain"}
                </Label>
                <Select onValueChange={(value) => setSearchCriteria({ ...searchCriteria, domain: value })}>
                  <SelectTrigger className="mt-2 rounded-none border-[#111827]/20 h-11 bg-[#F0F4F8]/10 font-sans text-xs text-[#111827]">
                    <SelectValue placeholder={language === "hi" ? "क्षेत्र चुनें" : "Select Domain"} />
                  </SelectTrigger>
                  <SelectContent className="rounded-none bg-[#F0F4F8] border-[#111827]/15">
                    {domains.map((domain) => (
                      <SelectItem key={domain.value} value={domain.value} className="rounded-none hover:bg-[#0B2545]/5 hover:text-[#0B2545]">
                        {language === "hi" ? domain.labelHi : domain.labelEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location" className="text-xs font-bold text-[#0B2545] uppercase tracking-widest font-sans">
                  {language === "hi" ? "शहर / स्थान" : "Location / City"}
                </Label>
                <Input
                  id="location"
                  placeholder={language === "hi" ? "जैसे: Delhi, Mumbai" : "e.g., Delhi, Mumbai"}
                  value={searchCriteria.location}
                  onChange={(e) => setSearchCriteria({ ...searchCriteria, location: e.target.value })}
                  className="mt-2 rounded-none border-[#111827]/20 h-11 bg-[#F0F4F8]/10 font-sans text-xs text-[#111827]"
                />
              </div>

              <div>
                <Label htmlFor="experience" className="text-xs font-bold text-[#0B2545] uppercase tracking-widest font-sans">
                  {language === "hi" ? "न्यूनतम अनुभव" : "Minimum Experience"}
                </Label>
                <Select onValueChange={(value) => setSearchCriteria({ ...searchCriteria, experience: value })}>
                  <SelectTrigger className="mt-2 rounded-none border-[#111827]/20 h-11 bg-[#F0F4F8]/10 font-sans text-xs text-[#111827]">
                    <SelectValue placeholder={language === "hi" ? "अनुभव चुनें" : "Select Experience"} />
                  </SelectTrigger>
                  <SelectContent className="rounded-none bg-[#F0F4F8] border-[#111827]/15">
                    <SelectItem value="0" className="rounded-none hover:bg-[#0B2545]/5 hover:text-[#0B2545]">{language === "hi" ? "कोई भी अनुभव" : "Any Experience"}</SelectItem>
                    <SelectItem value="5" className="rounded-none hover:bg-[#0B2545]/5 hover:text-[#0B2545]">5+ {language === "hi" ? "साल" : "Years"}</SelectItem>
                    <SelectItem value="10" className="rounded-none hover:bg-[#0B2545]/5 hover:text-[#0B2545]">10+ {language === "hi" ? "साल" : "Years"}</SelectItem>
                    <SelectItem value="15" className="rounded-none hover:bg-[#0B2545]/5 hover:text-[#0B2545]">15+ {language === "hi" ? "साल" : "Years"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={searchLawyers}
              disabled={isSearching}
              className="w-full bg-[#111827] hover:bg-[#0B2545] text-[#F0F4F8] font-semibold tracking-wider font-sans uppercase text-xs rounded-none py-6 shadow-sm transition-all duration-300"
              size="lg"
            >
              {isSearching ? (
                <span className="flex items-center space-x-2 justify-center">
                  <Loader2 className="h-4 w-4 animate-spin text-[#F0F4F8]" />
                  <span>{language === "hi" ? "खोज की जा रही है..." : "Searching Advocates..."}</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <Search className="h-3.5 w-3.5" />
                  <span>{language === "hi" ? "वकील खोजें" : "Search Advocates"}</span>
                </span>
              )}
            </Button>
          </CardContent>
        </Card>

        {isSearching && (
          <div className="mt-12 p-8 border border-dashed border-[#111827]/30 rounded-none bg-[#F0F4F8]/10 text-center animate-pulse">
            <LegalLoader 
              message={language === "hi" ? "वकीलों की खोज की जा रही है..." : "Searching Professional Advocates..."} 
              subMessage={language === "hi" ? "कृपया प्रतीक्षा करें, हम सर्वोत्तम कानूनी अधिवक्ताओं की सूची तैयार कर रहे हैं..." : "Please wait as we match your case credentials with verified profiles..."} 
            />
          </div>
        )}

        {!isSearching && matchedLawyers.length > 0 && (
          <div className="space-y-6 mt-12 animate-fade-in">
            <h3 className="text-xl font-sans font-bold text-[#111827] mb-6">
              {language === "hi" ? (
                <>
                  मिलान करने वाले वकील ({matchedLawyers.length})
                </>
              ) : (
                <>
                  Matched Advocates ({matchedLawyers.length})
                </>
              )}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {matchedLawyers.map((lawyer, idx) => (
                <Card key={idx} className="group hover:shadow-2xl hover:shadow-[#0B2545]/5 transition-all duration-500 border border-[#111827]/15 rounded-none bg-transparent overflow-hidden p-0 shadow-none hover:border-[#0B2545]/40">
                  <CardHeader className="p-6 pb-2 text-left">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-none border border-[#111827]/15 flex items-center justify-center shrink-0 bg-[#0B2545]/5 text-[#00B4D8] group-hover:bg-[#0B2545]/15 transition-all duration-300 overflow-hidden">
                        <LawyerAvatar src={lawyer.Image_Url} alt={lawyer.Name} sizeClass="h-8 w-8" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-sans font-bold text-[#111827] truncate group-hover:text-[#0B2545] transition-colors">
                          {lawyer.Name}
                        </CardTitle>
                        {language === 'hi' && (
                          <CardDescription className="text-xs font-bold text-[#0B2545] uppercase tracking-wider truncate font-sans">
                            {translatedNames[lawyer.Name] || "अनुवाद हो रहा है..."}
                          </CardDescription>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 shrink-0 bg-[#0B2545]/5 px-2.5 py-1 rounded-none border border-[#0B2545]/15 text-[#0B2545]">
                        <Star className="h-3 w-3 fill-[#00B4D8] text-[#00B4D8]" />
                        <span className="text-xs font-sans font-bold">
                          {lawyer.Rating}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-2 space-y-4 text-left">
                    <div className="flex flex-wrap">
                      <Badge variant="secondary" className="bg-[#0B2545]/5 border border-[#0B2545]/15 text-[#0B2545] text-xs font-bold rounded-none px-2.5 py-0.5 uppercase tracking-widest">
                        {lawyer.Specialization}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-xs text-[#111827]/75 font-sans font-light tracking-wide">
                      <div className="flex items-center space-x-2.5">
                        <Award className="h-3.5 w-3.5 text-[#0B2545]" />
                        <span>{lawyer.Experience}</span>
                      </div>

                      <div className="flex items-center space-x-2.5">
                        <MapPin className="h-3.5 w-3.5 text-[#0B2545]" />
                        <span className="truncate">{lawyer.Location}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3">
                      <Button className="w-full bg-[#111827] hover:bg-[#0B2545] text-[#F0F4F8] font-semibold tracking-wider font-sans uppercase text-xs rounded-none py-4 transition-all duration-300" size="sm">
                        <a href="https://www.chatbase.co/chatbot-iframe/0CXRULDX-IJ6GaESy_Wy9" target="_blank" rel="noopener noreferrer" className="w-full text-center">
                          {language === "hi" ? "संपर्क" : "Contact"}
                        </a>
                      </Button>
                      <Button variant="outline" className="w-full border-[#111827]/30 text-[#111827] hover:bg-[#0B2545]/5 hover:text-[#0B2545] hover:border-[#0B2545] bg-transparent rounded-none transition-all duration-300 uppercase font-sans text-xs tracking-widest font-bold" size="sm" onClick={() => setSelLawyer(lawyer)}>
                        {language === "hi" ? "प्रोफाइल" : "Profile"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
      {selectedLawyer && <Profile {...selectedLawyer} onClose={()=> setSelLawyer(null)} />}
    </section>
  );
};

export default LawyerMatching;
