import React, { useState, useEffect } from 'react';
import { Menu, X, Scale, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'hi');

  const toggleLanguage = () => {
    const nextLang = language === 'hi' ? 'en' : 'hi';
    setLanguage(nextLang);
    localStorage.setItem('language', nextLang);
    window.dispatchEvent(new Event('languageChange'));
  };

  useEffect(() => {
    const handleLangChange = () => {
      setLanguage(localStorage.getItem('language') || 'hi');
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  return (
    <header className="glass-navbar sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2 group">
            <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
              <Scale className="h-6 w-6 text-indigo-600 animate-pulse" />
            </div>
            <a href="/" className="hover:opacity-90 transition-opacity">
              <h1 className="text-xl font-extrabold text-gradient tracking-tight">
                {language === "hi" ? "ग्राम सहयोग नीति मार्ग" : "Gram Sahyog Niti Marg"}
              </h1>
            </a>
          </div>

          <nav className="hidden md:flex space-x-8 items-center">
            <a
              href="#services"
              className="text-slate-600 font-medium hover:text-indigo-600 transition-colors text-sm"
            >
              {language === "hi" ? "सेवाएं" : "Services"}
            </a>
            <a
              href="#upload"
              className="text-slate-600 font-medium hover:text-indigo-600 transition-colors text-sm"
            >
              {language === "hi" ? "दस्तावेज़ विश्लेषण" : "Document Analysis"}
            </a>
            <a
              href="#qa"
              className="text-slate-600 font-medium hover:text-indigo-600 transition-colors text-sm"
            >
              {language === "hi" ? "कानूनी सहायक" : "Legal Assistant"}
            </a>
            <a
              href="#lawDynamic"
              className="text-slate-600 font-medium hover:text-indigo-600 transition-colors text-sm"
            >
              {language === "hi" ? "वकील खोजें" : "Find Lawyers"}
            </a>
            <a
              href="#corporate"
              className="text-slate-600 font-medium hover:text-indigo-600 transition-colors text-sm"
            >
              {language === "hi" ? "कॉर्पोरेट" : "Corporate"}
            </a>
            <a
              href="/patent"
              className="text-slate-600 font-medium hover:text-indigo-600 transition-colors text-sm"
            >
              {language === "hi" ? "पेटेंट पंजीकरण" : "Patent Registration"}
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-2 border-indigo-200 hover:border-indigo-400 bg-white/50 backdrop-blur rounded-xl hover:scale-105 active:scale-95 transition-all"
            >
              <Globe className="h-4 w-4 text-indigo-600" />
              <span className="font-semibold text-slate-700">{language === "hi" ? "English" : "हिंदी"}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-slate-700 hover:bg-slate-100 rounded-xl"
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
          <div className="md:hidden pb-4 border-t border-slate-100 animate-accordion-down">
            <nav className="flex flex-col space-y-3 pt-4">
              <a
                href="#services"
                onClick={() => setIsMenuOpen(false)}
                className="text-slate-600 font-medium hover:text-indigo-600 transition-colors"
              >
                {language === "hi" ? "सेवाएं" : "Services"}
              </a>
              <a
                href="#upload"
                onClick={() => setIsMenuOpen(false)}
                className="text-slate-600 font-medium hover:text-indigo-600 transition-colors"
              >
                {language === "hi" ? "दस्तावेज़ विश्लेषण" : "Document Analysis"}
              </a>
              <a
                href="#qa"
                onClick={() => setIsMenuOpen(false)}
                className="text-slate-600 font-medium hover:text-indigo-600 transition-colors"
              >
                {language === "hi" ? "कानूनी सहायक" : "Legal Assistant"}
              </a>
              <a
                href="#lawDynamic"
                onClick={() => setIsMenuOpen(false)}
                className="text-slate-600 font-medium hover:text-indigo-600 transition-colors"
              >
                {language === "hi" ? "वकील खोजें" : "Find Lawyers"}
              </a>
              <a
                href="#corporate"
                onClick={() => setIsMenuOpen(false)}
                className="text-slate-600 font-medium hover:text-indigo-600 transition-colors"
              >
                {language === "hi" ? "कॉर्पोरेट" : "Corporate"}
              </a>
              <a
                href="/patent"
                onClick={() => setIsMenuOpen(false)}
                className="text-slate-600 font-medium hover:text-indigo-600 transition-colors"
              >
                {language === "hi" ? "पेटेंट पंजीकरण" : "Patent Registration"}
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
