
import React from 'react';
import { Scale, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Scale className="h-8 w-8 text-blue-400" />
              <h3 className="text-xl font-bold">ग्रामीण न्याय</h3>
            </div>
            <p className="text-gray-300 mb-4">
              गांव के लोगों के लिए कानूनी सहायता सेवा
            </p>
            <p className="text-gray-400 text-sm">
              Legal aid service for rural communities
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">सेवाएं / Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li>दस्तावेज़ विश्लेषण / Document Analysis</li>
              <li>कानूनी सलाह / Legal Advice</li>
              <li>वकील खोज / Lawyer Search</li>
              <li>कॉर्पोरेट सहायता / Corporate Help</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">कानूनी क्षेत्र / Legal Areas</h4>
            <ul className="space-y-2 text-gray-300">
              <li>संपत्ति कानून / Property Law</li>
              <li>पारिवारिक कानून / Family Law</li>
              <li>आपराधिक कानून / Criminal Law</li>
              <li>श्रम कानून / Labor Law</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">संपर्क / Contact</h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91-1800-123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>help@ruraladvice.in</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>नई दिल्ली, भारत</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 ग्रामीण न्याय / Rural Justice. सभी अधिकार सुरक्षित / All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            यह केवल सामान्य कानूनी जानकारी है। विस्तृत सलाह के लिए वकील से मिलें।
            <br />
            This is general legal information only. Consult a lawyer for detailed advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
