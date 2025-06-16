
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, MessageSquare, Users, Scale } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: FileText,
      title: "दस्तावेज़ विश्लेषण",
      titleEn: "Document Analysis",
      description: "अपने कानूनी दस्तावेज़ अपलोड करें और हिंदी में विस्तृत विश्लेषण प्राप्त करें",
      descriptionEn: "Upload your legal documents and get detailed analysis in Hindi",
      color: "text-blue-600"
    },
    {
      icon: MessageSquare,
      title: "प्रश्न-उत्तर सेवा",
      titleEn: "Q&A Service", 
      description: "कानूनी सवाल पूछें और विशेषज्ञों से उचित कानूनी रूप में जवाब पाएं",
      descriptionEn: "Ask legal questions and get proper legal responses from experts",
      color: "text-green-600"
    },
    {
      icon: Users,
      title: "वकील मैचिंग",
      titleEn: "Lawyer Matching",
      description: "अपने मामले के लिए सबसे उपयुक्त विशेषज्ञ वकील खोजें",
      descriptionEn: "Find the most suitable expert lawyer for your case",
      color: "text-purple-600"
    },
    {
      icon: Scale,
      title: "कॉर्पोरेट कानूनी सहायता",
      titleEn: "Corporate Legal Aid",
      description: "कॉर्पोरेट कर्मचारियों के लिए विशेष कानूनी सहायता सेवा",
      descriptionEn: "Special legal aid service for corporate employees",
      color: "text-orange-600"
    }
  ];

  return (
    <section id="services" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            हमारी सेवाएं / Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ग्रामीण समुदाय के लिए व्यापक कानूनी सहायता सेवाएं
            <br />
            <span className="text-lg">Comprehensive legal aid services for rural communities</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center">
                <service.icon className={`h-12 w-12 mx-auto mb-4 ${service.color}`} />
                <CardTitle className="text-lg mb-2">{service.title}</CardTitle>
                <CardDescription className="text-sm text-gray-500">{service.titleEn}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                <p className="text-gray-500 text-xs">{service.descriptionEn}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
