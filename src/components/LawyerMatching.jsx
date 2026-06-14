import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Star, MapPin, Award, Search, Loader2 } from 'lucide-react';
import Profile from './Profile';

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
    <section id="lawDynamic" className="py-20 bg-slate-50/50 relative rounded-3xl my-6 border border-slate-100">
      <div className="absolute bottom-[-5%] right-[-5%] w-[25%] h-[25%] rounded-full bg-purple-100/20 blur-[80px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            {language === "hi" ? (
              <>
                वकील <span className="text-gradient">खोज व मिलान</span>
              </>
            ) : (
              <>
                Find & Match <span className="text-gradient">Advocates</span>
              </>
            )}
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {language === "hi"
              ? "अपनी आवश्यकताओं के अनुसार विशेषज्ञ वकीलों को खोजें और संपर्क करें।"
              : "Search legal professionals by specialization, city location, and minimum experience."}
          </p>
        </div>

        <Card className="mb-10 border border-slate-100/80 shadow-2xl shadow-slate-100 rounded-3xl overflow-hidden bg-white p-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-xl font-extrabold text-slate-800">
              <Users className="h-5 w-5 text-indigo-600 animate-pulse" />
              <span>{language === "hi" ? "खोज मानदंड" : "Search Criteria"}</span>
            </CardTitle>
            <CardDescription className="text-slate-400">
              {language === "hi"
                ? "शहर, कानून का प्रकार और अनुभव दर्ज करें"
                : "Fill variables below to narrow advocate search"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="domain" className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {language === "hi" ? "कानून का क्षेत्र" : "Legal Domain"}
                </Label>
                <Select onValueChange={(value) => setSearchCriteria({ ...searchCriteria, domain: value })}>
                  <SelectTrigger className="mt-2 rounded-2xl border-slate-200 h-11 bg-slate-50/30">
                    <SelectValue placeholder={language === "hi" ? "क्षेत्र चुनें" : "Select Domain"} />
                  </SelectTrigger>
                  <SelectContent>
                    {domains.map((domain) => (
                      <SelectItem key={domain.value} value={domain.value}>
                        {language === "hi" ? domain.labelHi : domain.labelEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location" className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {language === "hi" ? "शहर / स्थान" : "Location / City"}
                </Label>
                <Input
                  id="location"
                  placeholder={language === "hi" ? "जैसे: Delhi, Mumbai" : "e.g., Delhi, Mumbai"}
                  value={searchCriteria.location}
                  onChange={(e) => setSearchCriteria({ ...searchCriteria, location: e.target.value })}
                  className="mt-2 rounded-2xl border-slate-200 h-11 bg-slate-50/30"
                />
              </div>

              <div>
                <Label htmlFor="experience" className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {language === "hi" ? "न्यूनतम अनुभव" : "Minimum Experience"}
                </Label>
                <Select onValueChange={(value) => setSearchCriteria({ ...searchCriteria, experience: value })}>
                  <SelectTrigger className="mt-2 rounded-2xl border-slate-200 h-11 bg-slate-50/30">
                    <SelectValue placeholder={language === "hi" ? "अनुभव चुनें" : "Select Experience"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">{language === "hi" ? "कोई भी अनुभव" : "Any Experience"}</SelectItem>
                    <SelectItem value="5">5+ {language === "hi" ? "साल" : "Years"}</SelectItem>
                    <SelectItem value="10">10+ {language === "hi" ? "साल" : "Years"}</SelectItem>
                    <SelectItem value="15">15+ {language === "hi" ? "साल" : "Years"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={searchLawyers}
              disabled={isSearching}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl py-6 shadow-xl shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all hover:scale-[1.01] active:scale-95 duration-200"
              size="lg"
            >
              {isSearching ? (
                <span className="flex items-center space-x-2 justify-center">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{language === "hi" ? "खोज की जा रही है..." : "Searching Advocates..."}</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <Search className="h-4 w-4" />
                  <span>{language === "hi" ? "वकील खोजें" : "Search Advocates"}</span>
                </span>
              )}
            </Button>
          </CardContent>
        </Card>

        {matchedLawyers.length > 0 && (
          <div className="space-y-6 mt-8">
            <h3 className="text-xl font-extrabold text-slate-800 mb-6">
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
                <Card key={idx} className="group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border border-slate-100 rounded-3xl overflow-hidden bg-white p-2">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 shadow-sm shrink-0 bg-slate-50">
                        <img
                          src={lawyer.Image_Url}
                          alt="lawyer photo"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-extrabold text-slate-900 truncate">
                          {lawyer.Name}
                        </CardTitle>
                        {language === 'hi' && (
                          <CardDescription className="text-xs font-semibold text-slate-400 truncate">
                            {translatedNames[lawyer.Name] || "अनुवाद हो रहा है..."}
                          </CardDescription>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 shrink-0 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-100">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-bold text-yellow-700">
                          {lawyer.Rating}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 px-4 pb-6">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="secondary" className="bg-indigo-50/70 border border-indigo-100/30 text-indigo-700 text-xs font-bold rounded-lg px-2.5 py-0.5">
                        {lawyer.Specialization}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm text-slate-650">
                      <div className="flex items-center space-x-2.5">
                        <Award className="h-4 w-4 text-indigo-500" />
                        <span>{lawyer.Experience}</span>
                      </div>

                      <div className="flex items-center space-x-2.5">
                        <MapPin className="h-4 w-4 text-indigo-500" />
                        <span className="truncate">{lawyer.Location}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3">
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/10" size="sm">
                        <a href="https://www.chatbase.co/chatbot-iframe/0CXRULDX-IJ6GaESy_Wy9" target="_blank" rel="noopener noreferrer" className="w-full text-center">
                          {language === "hi" ? "संपर्क" : "Contact"}
                        </a>
                      </Button>
                      <Button variant="outline" className="w-full border-indigo-100 text-indigo-700 hover:bg-indigo-50/50 font-bold rounded-xl" size="sm" onClick={() => setSelLawyer(lawyer)}>
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
