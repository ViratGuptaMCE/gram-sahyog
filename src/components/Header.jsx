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
    <header className="glass-navbar sticky top-0 z-50 backdrop-blur-md bg-[#F0F4F8]/80 border-b border-[#111827]/15 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center py-5">
          
          {/* Text Logo */}
          <div className="flex items-center space-x-2 group">
            <div className="p-1.5 bg-[#0B2545]/10 rounded-none group-hover:bg-[#0B2545]/20 transition-colors">
              <Scale className="h-4.5 w-4.5 text-[#0B2545]" />
            </div>
            <a href="/" className="hover:opacity-90 transition-opacity">
              <h1 className="text-sm font-sans font-bold text-[#111827] tracking-[3px] uppercase">
                {language === "hi" ? "न्याय सहयोग" : "NYAY SAHYOG"}
              </h1>
            </a>
          </div>

          {/* Nav Links in high-tracking uppercase labels */}
          <nav className="hidden md:flex space-x-8 items-center">
            <a
              href="#services"
              className="text-[#111827]/80 font-sans text-xs font-bold tracking-[2.5px] uppercase hover:text-[#0B2545] transition-colors"
            >
              {language === "hi" ? "सेवाएं" : "Services"}
            </a>
            <a
              href="#upload"
              className="text-[#111827]/80 font-sans text-xs font-bold tracking-[2.5px] uppercase hover:text-[#0B2545] transition-colors"
            >
              {language === "hi" ? "विश्लेषण" : "Analysis"}
            </a>
            <a
              href="#qa"
              className="text-[#111827]/80 font-sans text-xs font-bold tracking-[2.5px] uppercase hover:text-[#0B2545] transition-colors"
            >
              {language === "hi" ? "कानूनी सहायक" : "Legal Assistant"}
            </a>
            <a
              href="#lawDynamic"
              className="text-[#111827]/80 font-sans text-xs font-bold tracking-[2.5px] uppercase hover:text-[#0B2545] transition-colors"
            >
              {language === "hi" ? "वकील" : "Lawyers"}
            </a>
            <a
              href="#corporate"
              className="text-[#111827]/80 font-sans text-xs font-bold tracking-[2.5px] uppercase hover:text-[#0B2545] transition-colors"
            >
              {language === "hi" ? "कॉर्पोरेट" : "Corporate"}
            </a>
            <a
              href="/patent"
              className="text-[#111827]/80 font-sans text-xs font-bold tracking-[2.5px] uppercase hover:text-[#0B2545] transition-colors"
            >
              {language === "hi" ? "पेटेंट" : "Patent"}
            </a>
          </nav>

          {/* Actions & Language Switcher */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-2 border-[#111827]/30 text-[#111827] hover:bg-[#0B2545]/5 hover:text-[#0B2545] bg-transparent rounded-none transition-all duration-300 uppercase font-sans text-xs tracking-widest font-bold py-4 px-4 h-9"
            >
              <Globe className="h-3.5 w-3.5 text-[#0B2545]" />
              <span>{language === "hi" ? "English" : "हिंदी"}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-[#111827] hover:bg-[#0B2545]/10 rounded-none h-9 w-9 p-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 border-t border-[#111827]/15">
            <nav className="flex flex-col space-y-4 pt-4">
              <a
                href="#services"
                onClick={() => setIsMenuOpen(false)}
                className="text-[#111827]/80 font-sans text-xs font-bold tracking-[2px] uppercase hover:text-[#0B2545] transition-colors"
              >
                {language === "hi" ? "सेवाएं" : "Services"}
              </a>
              <a
                href="#upload"
                onClick={() => setIsMenuOpen(false)}
                className="text-[#111827]/80 font-sans text-xs font-bold tracking-[2px] uppercase hover:text-[#0B2545] transition-colors"
              >
                {language === "hi" ? "दस्तावेज़ विश्लेषण" : "Document Analysis"}
              </a>
              <a
                href="#qa"
                onClick={() => setIsMenuOpen(false)}
                className="text-[#111827]/80 font-sans text-xs font-bold tracking-[2px] uppercase hover:text-[#0B2545] transition-colors"
              >
                {language === "hi" ? "कानूनी सहायक" : "Legal Assistant"}
              </a>
              <a
                href="#lawDynamic"
                onClick={() => setIsMenuOpen(false)}
                className="text-[#111827]/80 font-sans text-xs font-bold tracking-[2px] uppercase hover:text-[#0B2545] transition-colors"
              >
                {language === "hi" ? "वकील खोजें" : "Find Lawyers"}
              </a>
              <a
                href="#corporate"
                onClick={() => setIsMenuOpen(false)}
                className="text-[#111827]/80 font-sans text-xs font-bold tracking-[2px] uppercase hover:text-[#0B2545] transition-colors"
              >
                {language === "hi" ? "कॉर्पोरेट" : "Corporate"}
              </a>
              <a
                href="/patent"
                onClick={() => setIsMenuOpen(false)}
                className="text-[#111827]/80 font-sans text-xs font-bold tracking-[2px] uppercase hover:text-[#0B2545] transition-colors"
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
