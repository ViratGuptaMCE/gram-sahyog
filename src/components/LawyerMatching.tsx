
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Star, Phone, MapPin, Award } from 'lucide-react';

const LawyerMatching = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    domain: '',
    location: '',
    experience: ''
  });
  const [matchedLawyers, setMatchedLawyers] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const domains = [
    { value: 'civil', label: 'दीवानी कानून / Civil Law' },
    { value: 'criminal', label: 'आपराधिक कानून / Criminal Law' },
    { value: 'family', label: 'पारिवारिक कानून / Family Law' },
    { value: 'property', label: 'संपत्ति कानून / Property Law' },
    { value: 'labor', label: 'श्रम कानून / Labor Law' },
    { value: 'consumer', label: 'उपभोक्ता कानून / Consumer Law' }
  ];

  const mockLawyers = [
    {
      id: 1,
      name: 'अधिवक्ता राजेश शर्मा',
      nameEn: 'Advocate Rajesh Sharma',
      domain: 'संपत्ति कानून विशेषज्ञ',
      domainEn: 'Property Law Specialist',
      experience: '15 साल का अनुभव',
      experienceEn: '15 years experience',
      rating: 4.8,
      location: 'दिल्ली / Delhi',
      phone: '+91-9876543210',
      specialties: ['भूमि विवाद', 'संपत्ति पंजीकरण', 'वसीयत'],
      specialtiesEn: ['Land Disputes', 'Property Registration', 'Wills'],
      fees: '₹2000-5000 प्रति केस'
    },
    {
      id: 2,
      name: 'अधिवक्ता प्रिया गुप्ता',
      nameEn: 'Advocate Priya Gupta',
      domain: 'पारिवारिक कानून विशेषज्ञ',
      domainEn: 'Family Law Specialist',
      experience: '12 साल का अनुभव',
      experienceEn: '12 years experience',
      rating: 4.9,
      location: 'मुंबई / Mumbai',
      phone: '+91-8765432109',
      specialties: ['तलाक', 'बाल हिरासत', 'गुजारा भत्ता'],
      specialtiesEn: ['Divorce', 'Child Custody', 'Alimony'],
      fees: '₹1500-4000 प्रति केस'
    },
    {
      id: 3,
      name: 'अधिवक्ता अमित पटेल',
      nameEn: 'Advocate Amit Patel',
      domain: 'आपराधिक कानून विशेषज्ञ',
      domainEn: 'Criminal Law Specialist',
      experience: '18 साल का अनुभव',
      experienceEn: '18 years experience',
      rating: 4.7,
      location: 'अहमदाबाद / Ahmedabad',
      phone: '+91-7654321098',
      specialties: ['जमानत', 'अपराधिक मुकदमे', 'साइबर अपराध'],
      specialtiesEn: ['Bail', 'Criminal Cases', 'Cyber Crime'],
      fees: '₹3000-8000 प्रति केस'
    }
  ];

  const searchLawyers = () => {
    setIsSearching(true);
    setTimeout(() => {
      setMatchedLawyers(mockLawyers);
      setIsSearching(false);
    }, 1500);
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
                <Select onValueChange={(value) => setSearchCriteria({...searchCriteria, domain: value})}>
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
                  onChange={(e) => setSearchCriteria({...searchCriteria, location: e.target.value})}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="experience">न्यूनतम अनुभव / Minimum Experience</Label>
                <Select onValueChange={(value) => setSearchCriteria({...searchCriteria, experience: value})}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="अनुभव चुनें / Select Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-5">0-5 साल / years</SelectItem>
                    <SelectItem value="5-10">5-10 साल / years</SelectItem>
                    <SelectItem value="10-15">10-15 साल / years</SelectItem>
                    <SelectItem value="15+">15+ साल / years</SelectItem>
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
              {isSearching ? 'वकील खोजे जा रहे हैं... / Searching Lawyers...' : 'वकील खोजें / Search Lawyers'}
            </Button>
          </CardContent>
        </Card>

        {matchedLawyers.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              मिलान करने वाले वकील / Matched Lawyers ({matchedLawyers.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedLawyers.map((lawyer) => (
                <Card key={lawyer.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{lawyer.name}</CardTitle>
                        <CardDescription className="text-sm">{lawyer.nameEn}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">{lawyer.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        {lawyer.domain}
                      </Badge>
                      <p className="text-sm text-gray-600">{lawyer.domainEn}</p>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Award className="h-4 w-4" />
                      <span>{lawyer.experience}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{lawyer.location}</span>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">विशेषताएं / Specialties:</h4>
                      <div className="flex flex-wrap gap-1">
                        {lawyer.specialties.map((specialty, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm">
                      <strong>फीस / Fees:</strong> {lawyer.fees}
                    </div>

                    <div className="space-y-2 pt-4">
                      <Button className="w-full" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        संपर्क करें / Contact
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
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
    </section>
  );
};

export default LawyerMatching;
