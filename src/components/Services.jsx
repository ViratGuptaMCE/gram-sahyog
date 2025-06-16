
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, MessageSquare, Users, Scale } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Services = () => {
  const { language } = useLanguage();

  const text = {
    hi: {
      title: 'हमारी सेवाएं',
      subtitle: 'ग्रामीण समुदाय के लिए व्यापक कानूनी सहायता सेवाएं',
      services: [
        {
          title: 'दस्तावेज़ विश्लेषण',
          description: 'अपने कानूनी दस्तावेज़ अपलोड करें और हिंदी में विस्तृत विश्लेषण प्राप्त करें'
        },
        {
          title: 'प्रश्न-उत्तर सेवा',
          description: 'कानूनी सवाल पूछें और विशेषज्ञों से उचित कानूनी रूप में जवाब पाएं'
        },
        {
          title: 'वकील मैचिंग',
          description: 'अपने मामले के लिए सबसे उपयुक्त विशेषज्ञ वकील खोजें'
        },
        {
          title: 'कॉर्पोरेट कानूनी सहायता',
          description: 'कॉर्पोरेट कर्मचारियों के लिए विशेष कानूनी सहायता सेवा'
        }
      ]
    },
    en: {
      title: 'Our Services',
      subtitle: 'Comprehensive legal aid services for rural communities',
      services: [
        {
          title: 'Document Analysis',
          description: 'Upload your legal documents and get detailed analysis with AI-powered insights'
        },
        {
          title: 'Q&A Service',
          description: 'Ask legal questions and get proper legal responses from expert professionals'
        },
        {
          title: 'Lawyer Matching',
          description: 'Find the most suitable expert lawyer for your specific legal case'
        },
        {
          title: 'Corporate Legal Aid',
          description: 'Special legal aid service designed specifically for corporate employees'
        }
      ]
    }
  };

  const currentText = text[language];
  const icons = [FileText, MessageSquare, Users, Scale];
  const colors = ['text-blue-600', 'text-green-600', 'text-purple-600', 'text-orange-600'];

  return (
    <section id="services" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {currentText.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {currentText.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentText.services.map((service, index) => {
            const IconComponent = icons[index];
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <IconComponent className={`h-12 w-12 mx-auto mb-4 ${colors[index]}`} />
                  <CardTitle className="text-lg mb-2">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
