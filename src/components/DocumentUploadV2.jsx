// src/components/DocumentUploadV2.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star, Upload, FileText, CheckCircle, Volume2, Languages, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const API_BASE = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "") : "/api";

// Helper to strip markdown symbols so the TTS engine reads clean text
const stripMarkdownForSpeech = (text) => {
  if (!text) return "";
  return text
    .replace(/\*\*?/g, "")            // Remove asterisks (* and **)
    .replace(/#{1,6}\s+/g, "")        // Remove headers (#, ##, ###)
    .replace(/^\s*[-*+]\s+/gm, "")     // Remove list bullet characters
    .replace(/^\s*\d+\.\s+/gm, "")     // Remove list numbers (e.g. 1.)
    .replace(/[\/\\]/g, "")            // Remove slashes
    .replace(/\n+/g, " ")             // Replace newlines with spaces for smooth speech
    .replace(/\s+/g, " ")             // Clean up multi-spaces
    .trim();
};

// Robust line-by-line Markdown Parser
const renderMarkdown = (text) => {
  if (!text) return null;
  
  const lines = text.split("\n");
  const elements = [];
  let currentList = [];
  let currentListType = null; // 'ul' or 'ol'

  const flushList = (key) => {
    if (currentList.length > 0) {
      if (currentListType === 'ol') {
        elements.push(
          <ol key={`list-${key}`} className="list-decimal pl-6 my-3 space-y-1.5 text-slate-700">
            {currentList}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`list-${key}`} className="list-disc pl-6 my-3 space-y-1.5 text-slate-700">
            {currentList}
          </ul>
        );
      }
      currentList = [];
      currentListType = null;
    }
  };

  const parseInlineStyles = (str) => {
    const parts = str.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={idx} className="font-extrabold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={idx} className="font-semibold italic text-slate-800">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    if (!trimmed) {
      flushList(index);
      return;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushList(index);
      const level = headingMatch[1].length;
      const title = headingMatch[2];
      const headingText = parseInlineStyles(title);
      
      if (level === 1) {
        elements.push(<h1 key={index} className="text-xl md:text-2xl font-black text-slate-900 mt-6 mb-3 pb-2 border-b border-slate-100">{headingText}</h1>);
      } else if (level === 2) {
        elements.push(<h2 key={index} className="text-lg md:text-xl font-bold text-slate-900 mt-5 mb-2.5 pb-1 border-b border-slate-100/50">{headingText}</h2>);
      } else {
        elements.push(<h3 key={index} className="text-base font-extrabold text-slate-850 mt-4 mb-2">{headingText}</h3>);
      }
      return;
    }

    if (trimmed.startsWith("**") && trimmed.endsWith("**") && !trimmed.slice(2, -2).includes("**")) {
      flushList(index);
      elements.push(<h4 key={index} className="text-sm font-extrabold text-slate-900 mt-4 mb-2 uppercase tracking-wider">{trimmed.slice(2, -2)}</h4>);
      return;
    }

    const bulletMatch = trimmed.match(/^[-*+]\s+(.*)$/);
    if (bulletMatch) {
      if (currentListType && currentListType !== 'ul') {
        flushList(index);
      }
      currentListType = 'ul';
      currentList.push(
        <li key={`li-${index}`} className="leading-relaxed text-sm text-slate-650 mb-1">
          {parseInlineStyles(bulletMatch[1])}
        </li>
      );
      return;
    }

    const numberMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numberMatch) {
      if (currentListType && currentListType !== 'ol') {
        flushList(index);
      }
      currentListType = 'ol';
      currentList.push(
        <li key={`li-${index}`} className="leading-relaxed text-sm text-slate-655 mb-1">
          {parseInlineStyles(numberMatch[2])}
        </li>
      );
      return;
    }

    flushList(index);
    elements.push(
      <p key={index} className="my-2.5 text-slate-650 leading-relaxed text-sm">
        {parseInlineStyles(trimmed)}
      </p>
    );
  });

  flushList(lines.length);
  return elements;
};

const DocumentUploadV2 = () => {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [progress, setProgress] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();
  const [recomLawyer, setRecomLawyer] = useState(null);
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "hi");
  const [originalAnalysis, setOriginalAnalysis] = useState(""); // Store original English analysis for toggling
  const audioPlayerRef = useRef(null);

  // Sync with global language toggles
  useEffect(() => {
    const handleLangChange = () => {
      setLanguage(localStorage.getItem("language") || "hi");
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: language === "hi" ? "फ़ाइल बहुत बड़ी है" : "File too large",
          description: language === "hi" ? "कृपया 10MB से छोटी फ़ाइल अपलोड करें" : "Please upload a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
      toast({
        title: language === "hi" ? "दस्तावेज़ प्राप्त हुआ" : "File Uploaded",
        description: language === "hi" ? `${selectedFile.name} सफलतापूर्वक लोड हो गया है` : `${selectedFile.name} uploaded successfully`,
      });
    }
  };

  const analyzeDocument = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) {
          clearInterval(progressInterval);
          return 92;
        }
        return prev + 4;
      });
    }, 300);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "query",
        "Analyze this legal document and provide key points, potential issues, and recommendations in clear bullet points."
      );
      formData.append("translation_language", language);

      const response = await fetch(`${API_BASE}/process_pdf/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setProgress(100);
      setTimeout(() => {
        setAnalysis(data.answer);
        setOriginalAnalysis(data.answer);
        setRecomLawyer(data.lawyer);
        setIsAnalyzing(false);
        toast({
          title: language === "hi" ? "विश्लेषण पूर्ण" : "Analysis Complete",
          description: language === "hi" ? "दस्तावेज़ का विश्लेषण सफलतापूर्वक कर दिया गया है" : "Document has been analyzed successfully",
        });
      }, 400);
    } catch (error) {
      console.error("Error analyzing document:", error);
      setIsAnalyzing(false);
      clearInterval(progressInterval);
      toast({
        title: language === "hi" ? "त्रुटि" : "Error",
        description: language === "hi" ? "दस्तावेज़ के विश्लेषण में समस्या आई" : "Problem analyzing document",
        variant: "destructive",
      });
    }
  };

  const toggleLanguageText = async () => {
    if (!analysis) return;

    const currentLang = language;
    const nextLang = currentLang === "en" ? "hi" : "en";
    
    localStorage.setItem("language", nextLang);
    window.dispatchEvent(new Event("languageChange"));

    if (currentLang === "en") {
      try {
        setIsAnalyzing(true);
        const response = await fetch(`${API_BASE}/translate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: originalAnalysis,
            target_lang: "hi",
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setAnalysis(data.translated_text);
      } catch (error) {
        console.error("Error translating:", error);
        toast({
          title: "Error",
          description: "Problem translating text",
          variant: "destructive",
        });
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      setAnalysis(originalAnalysis);
    }
  };

  // HTML Audio based sequential speech player using Google Translate TTS (CORS-friendly, natural audio)
  const playGoogleTTS = (text, lang) => {
    setIsSpeaking(true);
    toast({
      title: language === "hi" ? "वाचन प्रारंभ" : "Speech Started",
      description: language === "hi" ? "एआई सहायक विश्लेषण पढ़ रहा है..." : "AI assistant is reading...",
    });

    const cleanText = stripMarkdownForSpeech(text);
    
    // Chunking text into ~150 character segments (max limit is 200)
    const chunks = [];
    const sentenceBoundaryRegex = /[^।,.!?\n]+[।,.!?\n]?/g;
    let match;
    let currentChunk = "";

    while ((match = sentenceBoundaryRegex.exec(cleanText)) !== null) {
      const segment = match[0];
      if ((currentChunk + segment).length > 150) {
        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim());
        }
        currentChunk = segment;
      } else {
        currentChunk += segment;
      }
    }
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    if (chunks.length === 0) {
      setIsSpeaking(false);
      return;
    }

    let currentIdx = 0;

    const playNext = () => {
      if (currentIdx >= chunks.length) {
        setIsSpeaking(false);
        audioPlayerRef.current = null;
        return;
      }

      // Google Translate Public TTS URL
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(chunks[currentIdx])}`;
      const audio = new Audio(ttsUrl);
      audioPlayerRef.current = audio;

      audio.onended = () => {
        currentIdx++;
        playNext();
      };

      audio.onerror = (e) => {
        console.error("Google TTS chunk error, skipping to next:", e);
        currentIdx++;
        playNext();
      };

      audio.play().catch((err) => {
        console.error("Audio playback failed:", err);
        setIsSpeaking(false);
        toast({
          title: language === "hi" ? "वाचन त्रुटि" : "Speech Error",
          description: language === "hi" ? "ऑडियो वाचन प्रारंभ नहीं किया जा सका।" : "Could not play audio track.",
          variant: "destructive"
        });
      });
    };

    playNext();
  };

  const readAloud = () => {
    if (!analysis) return;

    if (isSpeaking) {
      // Cancel everything
      window.speechSynthesis.cancel();
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
      setIsSpeaking(false);
      toast({
        title: language === "hi" ? "वाचन विराम" : "Speech Stopped",
        description: language === "hi" ? "ऑडियो वाचन रोक दिया गया है।" : "Audio playback has been stopped.",
      });
      return;
    }

    // For Hindi: always use Google Translate TTS (sounds much more human and bypasses empty OS voice packages)
    if (language === "hi") {
      playGoogleTTS(analysis, "hi");
    } else {
      // For English: Try SpeechSynthesis first, fallback to Google TTS if unavailable
      window.speechSynthesis.cancel();
      const cleanText = stripMarkdownForSpeech(analysis);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      const currentVoices = window.speechSynthesis.getVoices();
      
      const englishVoice = currentVoices.find(
        (voice) => 
          voice.lang.toLowerCase().startsWith("en") || 
          voice.name.toLowerCase().includes("english")
      );
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      utterance.lang = "en-US";

      utterance.onstart = () => {
        setIsSpeaking(true);
        toast({
          title: "Speech Started",
          description: "AI assistant is reading document analysis...",
        });
      };
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.error("SpeechSynthesis error, falling back to Google Translate TTS:", e);
        playGoogleTTS(analysis, "en");
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    return () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        if (audioPlayerRef.current) {
          audioPlayerRef.current.pause();
        }
      }
    };
  }, [isSpeaking]);

  return (
    <section id="upload" className="py-20 bg-slate-50/50 relative rounded-3xl my-6 border border-slate-100">
      <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-indigo-200/20 blur-[90px] pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            {language === "hi" ? (
              <>
                दस्तावेज़ <span className="text-gradient">विश्लेषण</span>
              </>
            ) : (
              <>
                Document <span className="text-gradient">Analyzer</span>
              </>
            )}
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {language === "hi"
              ? "दस्तावेज़ों को अपलोड करें और एआई की सहायता से उनका आसान अनुवाद और सारांश पाएं।"
              : "Upload contracts, agreements, or land deeds to extract key points and legal advice."}
          </p>
        </div>

        <Card className="border border-slate-100/80 shadow-2xl shadow-slate-100 rounded-3xl overflow-hidden bg-white p-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-xl font-extrabold text-slate-800">
              <Upload className="h-5 w-5 text-indigo-600 animate-bounce" />
              <span>{language === "hi" ? "नया दस्तावेज़ अपलोड करें" : "Upload Document"}</span>
            </CardTitle>
            <CardDescription className="text-slate-400">
              {language === "hi" 
                ? "PDF फाइल चुनें (अधिकतम आकार 10MB)" 
                : "Select or drag a PDF document (Max size 10MB)"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-slate-200 hover:border-indigo-500 bg-slate-50/50 hover:bg-indigo-50/5 transition-all duration-300 rounded-2xl p-10 text-center cursor-pointer relative group">
              <input
                id="document"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4 group-hover:scale-110 group-hover:text-indigo-600 transition-all duration-300" />
              <p className="text-sm font-extrabold text-slate-700">
                {language === "hi" ? "यहाँ PDF फ़ाइल खींचें या ब्राउज़ करें" : "Drag & drop PDF here, or click to browse"}
              </p>
              <p className="text-xs text-slate-400 mt-2">PDF (up to 10MB)</p>
            </div>

            {file && (
              <div className="flex items-center space-x-3 p-4 bg-emerald-50/80 border border-emerald-100 rounded-2xl animate-fade-in">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <FileText className="h-5 w-5 text-emerald-600" />
                </div>
                <span className="text-sm font-bold text-emerald-800 truncate max-w-xs">{file.name}</span>
                <CheckCircle className="h-5 w-5 text-emerald-600 ml-auto" />
              </div>
            )}

            <Button
              onClick={analyzeDocument}
              disabled={!file || isAnalyzing}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl py-6 shadow-xl shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all hover:scale-[1.01] active:scale-95 duration-200"
              size="lg"
            >
              {isAnalyzing ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{language === "hi" ? "दस्तावेज़ का विश्लेषण हो रहा है..." : "Analyzing Document..."}</span>
                </span>
              ) : (
                <span>{language === "hi" ? "विश्लेषण शुरू करें" : "Analyze Document"}</span>
              )}
            </Button>

            {isAnalyzing && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-extrabold text-slate-500">
                  <span>{language === "hi" ? "प्रगति" : "Progress"}</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full h-2.5 bg-slate-100 rounded-full" />
              </div>
            )}
          </CardContent>
        </Card>

        {analysis && (
          <Card className="mt-8 border border-slate-100 shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100/80 py-4 px-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <CardTitle className="text-emerald-700 font-extrabold text-lg flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>{language === "hi" ? "दस्तावेज़ विश्लेषण पूर्ण" : "Analysis Report"}</span>
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    onClick={toggleLanguageText}
                    variant="outline"
                    size="sm"
                    className="border-indigo-100 hover:bg-indigo-50/50 hover:border-indigo-300 text-indigo-700 font-bold rounded-xl shadow-sm"
                    disabled={isAnalyzing}
                  >
                    <Languages className="h-4 w-4 mr-1.5" />
                    {language === "en" ? "हिंदी संस्करण" : "English Version"}
                  </Button>
                  <Button
                    onClick={readAloud}
                    variant="outline"
                    size="sm"
                    className={`border-indigo-100 hover:border-indigo-300 text-indigo-700 font-bold rounded-xl shadow-sm ${isSpeaking ? 'bg-indigo-50 border-indigo-300 text-indigo-800' : 'hover:bg-indigo-50/50'}`}
                  >
                    <Volume2 className="h-4 w-4 mr-1.5" />
                    {isSpeaking ? (language === "hi" ? "बोलना रोकें" : "Stop Speaking") : (language === "hi" ? "बोलकर सुनें" : "Read Aloud")}
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6 px-6 pb-6">
              <div className="prose max-w-none text-slate-700 leading-relaxed bg-slate-50/40 p-6 rounded-2xl border border-slate-100 max-h-[500px] overflow-y-auto shadow-inner">
                {renderMarkdown(analysis)}
              </div>
            </CardContent>

            {recomLawyer && (
              <CardContent className="border-t border-slate-100 pt-6 px-6 pb-6 bg-indigo-50/10">
                <h3 className="text-base font-extrabold text-slate-800 mb-4 px-1">
                  ⚖️ {language === "en" ? "Matched Professional Advocate" : "आपके केस के लिए मिलान विशेषज्ञ वकील"}
                </h3>
                
                <div className="flex flex-col md:flex-row items-center justify-between w-full border border-indigo-100 shadow-md bg-white rounded-2xl p-6 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 gap-6">
                  <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                        {language === "en" ? "AI Smart Recommendation" : "एआई स्मार्ट सुझाव"}
                      </span>
                      <CardTitle className="text-xl font-extrabold text-slate-900 mt-3">
                        {recomLawyer.Name}
                      </CardTitle>
                    </div>
                    
                    <div className="flex items-center space-x-1 bg-yellow-50 border border-yellow-100 rounded-full px-2.5 py-0.5">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-bold text-yellow-700">
                        {recomLawyer.Rating} / 5.0
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-slate-650">
                      <p className="flex items-center space-x-2 justify-center md:justify-start">
                        <span className="text-indigo-500 font-bold">📍</span>
                        <span>{recomLawyer.Location}</span>
                      </p>
                      <p className="flex items-center space-x-2 justify-center md:justify-start">
                        <span className="text-indigo-500 font-bold">💼</span>
                        <span>
                          <strong>{language === "en" ? "Domain" : "विशेषज्ञता"}:</strong> {recomLawyer.Specialization}
                        </span>
                      </p>
                      <p className="flex items-center space-x-2 justify-center md:justify-start">
                        <span className="text-indigo-500 font-bold">🎓</span>
                        <span>
                          <strong>{language === "en" ? "Experience" : "अनुभव"}:</strong> {recomLawyer.Experience}
                        </span>
                      </p>
                    </div>

                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/10 hover:scale-105 transition-all mt-2">
                      <a href="https://www.chatbase.co/chatbot-iframe/0CXRULDX-IJ6GaESy_Wy9" target="_blank" rel="noopener noreferrer">
                        {language === "en" ? "Contact Lawyer" : "वकील से संपर्क करें"}
                      </a>
                    </Button>
                  </div>

                  <div className="w-28 h-28 rounded-2xl overflow-hidden border border-slate-100 shadow-md flex items-center justify-center bg-slate-50 shrink-0">
                    <img
                      src={recomLawyer.Image_Url}
                      alt={recomLawyer.Name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        )}
      </div>
    </section>
  );
};

export default DocumentUploadV2;
