
import React, { useState } from 'react';
import { Menu, X, Scale, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../contexts/LanguageContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();

  const text = {
    hi: {
      title: 'ग्रामीण न्याय',
      services: 'सेवाएं',
      upload: 'दस्तावेज़ अपलोड',
      qa: 'प्रश्न-उत्तर',
      lawyers: 'वकील खोजें',
      corporate: 'कॉर्पोरेट',
      switchLang: 'English'
    },
    en: {
      title: 'Rural Justice',
      services: 'Services',
      upload: 'Upload Documents',
      qa: 'Q&A',
      lawyers: 'Find Lawyers',
      corporate: 'Corporate',
      switchLang: 'हिंदी'
    }
  };

  const currentText = text[language];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              {currentText.title}
            </h1>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a href="#services" className="text-gray-700 hover:text-blue-600 transition-colors">
              {currentText.services}
            </a>
            <a href="#upload" className="text-gray-700 hover:text-blue-600 transition-colors">
              {currentText.upload}
            </a>
            <a href="#qa" className="text-gray-700 hover:text-blue-600 transition-colors">
              {currentText.qa}
            </a>
            <a href="#lawyers" className="text-gray-700 hover:text-blue-600 transition-colors">
              {currentText.lawyers}
            </a>
            <a href="#corporate" className="text-gray-700 hover:text-blue-600 transition-colors">
              {currentText.corporate}
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="hidden md:flex items-center space-x-2"
            >
              <Globe className="h-4 w-4" />
              <span>{currentText.switchLang}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4 pt-4">
              <a href="#services" className="text-gray-700 hover:text-blue-600 transition-colors">
                {currentText.services}
              </a>
              <a href="#upload" className="text-gray-700 hover:text-blue-600 transition-colors">
                {currentText.upload}
              </a>
              <a href="#qa" className="text-gray-700 hover:text-blue-600 transition-colors">
                {currentText.qa}
              </a>
              <a href="#lawyers" className="text-gray-700 hover:text-blue-600 transition-colors">
                {currentText.lawyers}
              </a>
              <a href="#corporate" className="text-gray-700 hover:text-blue-600 transition-colors">
                {currentText.corporate}
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
                className="flex items-center space-x-2 w-fit"
              >
                <Globe className="h-4 w-4" />
                <span>{currentText.switchLang}</span>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
