
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Star, Phone, MapPin, Award } from 'lucide-react';
import Profile from './Profile';

const LawyerMatching = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    domain: '',
    location: '',
    experience: ''
  });
  const [matchedLawyers, setMatchedLawyers] = useState([]);
  const [translatedNames, setTranslatedNames] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLawyer, setSelLawyer] = useState(null);

  const domains = [
    { value: "civil", label: "दीवानी कानून / Civil Law" },
    { value: "criminal", label: "आपराधिक कानून / Criminal Law" },
    { value: "family", label: "पारिवारिक कानून / Family Law" },
    { value: "property", label: "संपत्ति कानून / Property Law" },
    { value: "Tax", label: "कर कानून / Tax Law" },
    { value: "Consumer Court", label: "उपभोक्ता कानून / Consumer Law" },
  ];
  async function translateToHindi(text) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(
      text
    )}`;

    const res = await fetch(url);
    const data = await res.json();
    return data[0][0][0]; // Translated text
  }
  const searchLawyers = async () => {
    setIsSearching(true);
    try {
      const formData = new FormData();
      formData.append("domain", searchCriteria.domain);
      formData.append("location", searchCriteria.location);
      formData.append("experience", searchCriteria.experience);

      const response = await fetch("/api/get_lawyers/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        setMatchedLawyers(result.lawyers);
        const translations = {};
        for (const lawyer of result.lawyers) {
          translations[lawyer.Name] = await translateToHindi(lawyer.Name);
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
    <section id="lawyers" className="py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            वकील खोजें / Find Lawyers
          </h2>
          <p className="text-xl text-gray-600">
            अपने मामले के लिए सबसे उपयुक्त विशेषज्ञ वकील खोजें
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-6 w-6" />
              <span>वकील खोज मापदंड / Lawyer Search Criteria</span>
            </CardTitle>
            <CardDescription>
              अपनी आवश्यकताओं के अनुसार वकील खोजें
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="domain">कानून का क्षेत्र / Legal Domain</Label>
                <Select
                  onValueChange={(value) =>
                    setSearchCriteria({ ...searchCriteria, domain: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="क्षेत्र चुनें / Select Domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {domains.map((domain) => (
                      <SelectItem key={domain.value} value={domain.value}>
                        {domain.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">स्थान / Location</Label>
                <Input
                  id="location"
                  placeholder="शहर का नाम / City Name"
                  value={searchCriteria.location}
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      location: e.target.value,
                    })
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="experience">
                  न्यूनतम अनुभव / Minimum Experience
                </Label>
                <Select
                  onValueChange={(value) =>
                    setSearchCriteria({ ...searchCriteria, experience: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="अनुभव चुनें / Select Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0-5 साल / years</SelectItem>
                    <SelectItem value="5">5-10 साल / years</SelectItem>
                    <SelectItem value="10">10-15 साल / years</SelectItem>
                    <SelectItem value="15">15+ साल / years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={searchLawyers}
              disabled={isSearching}
              className="w-full"
              size="lg"
            >
              {isSearching
                ? "वकील खोजे जा रहे हैं... / Searching Lawyers..."
                : "वकील खोजें / Search Lawyers"}
            </Button>
          </CardContent>
        </Card>

        {matchedLawyers.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              मिलान करने वाले वकील / Matched Lawyers ({matchedLawyers.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedLawyers.map((lawyer, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="photo p-5 rounded-full overflow-hidden">
                        <img
                          src={lawyer.Image_Url}
                          alt="photo"
                          width={50}
                          height={50}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{lawyer.Name}</CardTitle>
                        <CardDescription className="text-sm">
                          {translatedNames[lawyer.Name] ||
                            "Loading translation..."}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">
                          {lawyer.Rating}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        {lawyer.Specialization}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Award className="h-4 w-4" />
                      <span>{lawyer.Experience}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{lawyer.Location}</span>
                    </div>

                    <div className="space-y-2 pt-4">
                      <Button className="w-full" size="sm">
                        <a href="https://www.chatbase.co/chatbot-iframe/0CXRULDX-IJ6GaESy_Wy9">
                          संपर्क करें / Contact
                        </a>
                      </Button>
                      <Button variant="outline" className="w-full" size="sm" onClick={() => setSelLawyer(lawyer)}>
                        प्रोफाइल देखें / View Profile
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
