
import React, { useState } from 'react';
import { Menu, X, Scale, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('hi');

  const toggleLanguage = () => {
    setLanguage(language === 'hi' ? 'en' : 'hi');
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-blue-600" />
            <a href="/">
              <h1 className="text-2xl font-bold text-gray-900">
                {language === "hi" ? " न्याय" : "Nyay"}
              </h1>
            </a>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a
              href="#services"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {language === "hi" ? "सेवाएं" : "Services"}
            </a>
            <a
              href="#upload"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {language === "hi" ? "दस्तावेज़ अपलोड" : "Upload Documents"}
            </a>
            <a
              href="#qa"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {language === "hi" ? "प्रश्न-उत्तर" : "Q&A"}
            </a>
            <a
              href="#lawyers"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {language === "hi" ? "वकील खोजें" : "Find Lawyers"}
            </a>
            <a
              href="#corporate"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {language === "hi" ? "कॉर्पोरेट" : "Corporate"}
            </a>
            <a
              href="/patent"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {language === "hi" ? "पेटेंट" : "PATENT"}
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
              <span>{language === "hi" ? "English" : "हिंदी"}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4 pt-4">
              <a
                href="#services"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {language === "hi" ? "सेवाएं" : "Services"}
              </a>
              <a
                href="#upload"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {language === "hi" ? "दस्तावेज़ अपलोड" : "Upload Documents"}
              </a>
              <a
                href="#qa"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {language === "hi" ? "प्रश्न-उत्तर" : "Q&A"}
              </a>
              <a
                href="#lawyers"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {language === "hi" ? "वकील खोजें" : "Find Lawyers"}
              </a>
              <a
                href="#corporate"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {language === "hi" ? "कॉर्पोरेट" : "Corporate"}
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
                className="flex items-center space-x-2 w-fit"
              >
                <Globe className="h-4 w-4" />
                <span>{language === "hi" ? "English" : "हिंदी"}</span>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
