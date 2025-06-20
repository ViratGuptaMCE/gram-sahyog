
import React from 'react';
import { Button } from '@/components/ui/button';
import { Scale, Users, FileText, MessageSquare } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-600 opacity-10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-blue-600">न्याय</span>
            <br />
            <span className="text-2xl md:text-4xl text-gray-700">Legal Aid</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            गांव के लोगों के लिए कानूनी सहायता। दस्तावेज़ अपलोड करें, सवाल पूछें, और बेहतरीन वकील खोजें।
            <br />
            <span className="text-lg">Legal help for rural communities. Upload documents, ask questions, and find expert lawyers.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              दस्तावेज़ अपलोड करें / Upload Documents
            </Button>
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              सवाल पूछें / Ask Questions
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
              <FileText className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">दस्तावेज़ विश्लेषण</h3>
              <p className="text-gray-600 text-center">Document Analysis</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
              <MessageSquare className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">कानूनी सलाह</h3>
              <p className="text-gray-600 text-center">Legal Advice</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
              <Users className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">वकील खोजें</h3>
              <p className="text-gray-600 text-center">Find Lawyers</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
              <Scale className="h-12 w-12 text-orange-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">कॉर्पोरेट सहायता</h3>
              <p className="text-gray-600 text-center">Corporate Help</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
