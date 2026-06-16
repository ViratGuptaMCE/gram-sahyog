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
import LegalLoader from "./LegalLoader";
import LawyerAvatar from "./LawyerAvatar";

const API_BASE = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "") : "/api";

const stripMarkdownForSpeech = (text) => {
  if (!text) return "";
  return text
    .replace(/\*\*?/g, "")            
    .replace(/#{1,6}\s+/g, "")        
    .replace(/^\s*[-*+]\s+/gm, "")     
    .replace(/^\s*\d+\.\s+/gm, "")     
    .replace(/[\/\\]/g, "")           
    .replace(/\n+/g, " ")             
    .replace(/\s+/g, " ")             
    .trim();
};

const renderMarkdown = (text) => {
  if (!text) return null;
  
  const lines = text.split("\n");
  const elements = [];
  let currentList = [];
  let currentListType = null; 

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
  const [ocrStatus, setOcrStatus] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();
  const [recomLawyer, setRecomLawyer] = useState(null);
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "hi");
  const [originalAnalysis, setOriginalAnalysis] = useState(""); 
  const audioPlayerRef = useRef(null);

  useEffect(() => {
    const handleLangChange = () => {
      setLanguage(localStorage.getItem("language") || "hi");
    };
    window.addEventListener("languageChange", handleLangChange);

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }

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
    setOcrStatus("");

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
      console.log("The Response is : ", response);
      let isOcrNeeded = false;
      let errorMsg = "";

      if (!response.ok) {
        try {
          const errData = await response.json();
          errorMsg = errData.detail || "";
        } catch (e) {
          errorMsg = `HTTP error! status: ${response.status}`;
        }
        console.log("The Error Message that we got : - ", errorMsg);
        const lowerMsg = errorMsg.toLowerCase();
        if (
          lowerMsg.includes("tesseract") ||
          lowerMsg.includes("ocr") ||
          lowerMsg.includes("not installed") ||
          lowerMsg.includes("not found") ||
          lowerMsg.includes("no readable text") ||
          lowerMsg.includes("executable")
        ) {
          isOcrNeeded = true;
        } else {
          throw new Error(errorMsg);
        }
      }
      toast({
        title: language === "hi" ? "त्रुटि" : "Error",
        description:
          (language === "hi"
            ? "दस्तावेज़ के विश्लेषण में समस्या आई OCR needed"
            : "Problem analyzing document , OCR Needed , retrying"),
      });
      if (isOcrNeeded) {
        clearInterval(progressInterval);
        setOcrStatus(language === "hi" ? "OCR इंजन शुरू किया जा रहा है..." : "Initializing OCR...");
        setProgress(5);

        let extractedText = "";
        try {
          const { performClientSideOCR } = await import("../lib/ocr");
          extractedText = await performClientSideOCR(file, (page, total) => {
            setOcrStatus(
              language === "hi"
                ? `OCR विश्लेषण: पृष्ठ ${page} / ${total}...`
                : `OCR: Page ${page} / ${total}...`
            );
            setProgress(Math.round((page / total) * 90) + 5);
          });
        } catch (ocrErr) {
          console.error("OCR failed:", ocrErr);
          throw new Error(
            language === "hi"
              ? "क्लाइंट-साइड OCR विफल रहा। कृपया सुनिश्चित करें कि फ़ाइल सही है।"
              : "OCR failed. Please ensure the file is valid and readable."
          );
        }

        setOcrStatus(language === "hi" ? "अंतिम विश्लेषण चल रहा है..." : "Performing final analysis...");
        setProgress(95);

        const retryFormData = new FormData();
        retryFormData.append("file", file);
        retryFormData.append(
          "query",
          "Analyze this legal document and provide key points, potential issues, and recommendations in clear bullet points."
        );
        retryFormData.append("translation_language", language);
        retryFormData.append("extracted_text", extractedText);

        const retryResponse = await fetch(`${API_BASE}/process_pdf/`, {
          method: "POST",
          body: retryFormData,
        });

        if (!retryResponse.ok) {
          let retryErrorMsg = "";
          try {
            const retryErrData = await retryResponse.json();
            retryErrorMsg = retryErrData.detail || "";
          } catch (e) {
            retryErrorMsg = `HTTP error! status: ${retryResponse.status}`;
          }
          throw new Error(retryErrorMsg);
        }

        const data = await retryResponse.json();
        
        setProgress(100);
        setOcrStatus("");
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

      } else {
        const data = await response.json();

        setProgress(100);
        setOcrStatus("");
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
      }
    } catch (error) {
      console.error("Error analyzing document:", error);
      setIsAnalyzing(false);
      setOcrStatus("");
      clearInterval(progressInterval);
      toast({
        title: language === "hi" ? "त्रुटि" : "Error",
        description: error.message || (language === "hi" ? "दस्तावेज़ के विश्लेषण में समस्या आई" : "Problem analyzing document"),
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

  const playGoogleTTS = (text, lang, showToast = true) => {
    setIsSpeaking(true);
    if (showToast) {
      toast({
        title: language === "hi" ? "वाचन प्रारंभ" : "Speech Started",
        description: language === "hi" ? "एआई सहायक विश्लेषण पढ़ रहा है..." : "AI assistant is reading...",
      });
    }

    const cleanText = stripMarkdownForSpeech(text);
    
    const chunks = [];
    const maxChunkSize = 140;
    let remainingText = cleanText;

    while (remainingText.length > 0) {
      if (remainingText.length <= maxChunkSize) {
        chunks.push(remainingText.trim());
        break;
      }

      let splitIdx = -1;
      const sub = remainingText.substring(0, maxChunkSize);
      
      const punctuationMarks = ['।', '.', '?', '!'];
      for (const mark of punctuationMarks) {
        const idx = sub.lastIndexOf(mark);
        if (idx > splitIdx) {
          splitIdx = idx + 1;
        }
      }

      if (splitIdx === -1) {
        const clauseMarks = [',', ';', ':'];
        for (const mark of clauseMarks) {
          const idx = sub.lastIndexOf(mark);
          if (idx > splitIdx) {
            splitIdx = idx + 1;
          }
        }
      }

      if (splitIdx === -1) {
        const lastSpace = sub.lastIndexOf(' ');
        if (lastSpace > 20) {
          splitIdx = lastSpace + 1;
        }
      }

      if (splitIdx === -1) {
        splitIdx = maxChunkSize;
      }

      const chunk = remainingText.substring(0, splitIdx).trim();
      if (chunk) {
        chunks.push(chunk);
      }
      remainingText = remainingText.substring(splitIdx);
    }

    if (chunks.length === 0) {
      setIsSpeaking(false);
      return;
    }

    let currentIdx = 0;
    let isAborted = false;

    const playNext = () => {
      if (isAborted) return;

      if (currentIdx >= chunks.length) {
        setIsSpeaking(false);
        audioPlayerRef.current = null;
        return;
      }

      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(chunks[currentIdx])}`;
      const audio = new Audio(ttsUrl);
      audioPlayerRef.current = audio;

      audio.onended = () => {
        if (!isAborted) {
          currentIdx++;
          playNext();
        }
      };

      const handlePlaybackError = (err) => {
        if (isAborted) return;
        isAborted = true;
        console.error("Google TTS error, aborting:", err);
        setIsSpeaking(false);
        if (audioPlayerRef.current) {
          audioPlayerRef.current.pause();
          audioPlayerRef.current = null;
        }
        toast({
          title: language === "hi" ? "वाचन त्रुटि" : "Speech Error",
          description: language === "hi" ? "ऑडियो वाचन पूर्ण नहीं किया जा सका।" : "Could not complete audio playback.",
          variant: "destructive"
        });
      };

      audio.onerror = handlePlaybackError;
      audio.play().catch(handlePlaybackError);
    };

    playNext();
  };

  const readAloud = () => {
    if (!analysis) return;

    if (isSpeaking) {
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

    const cleanText = stripMarkdownForSpeech(analysis);
    window.speechSynthesis.cancel();

    const currentVoices = window.speechSynthesis.getVoices();
    const targetLang = language === "hi" ? "hi-IN" : "en-US";
    
    const hasLangVoice = currentVoices.some(
      (voice) => 
        voice.lang.toLowerCase().startsWith(language) ||
        voice.name.toLowerCase().includes(language === "hi" ? "hindi" : "english")
    );

    if (hasLangVoice) {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = targetLang;
      
      const matchedVoice = currentVoices.find(
        (voice) => 
          voice.lang.toLowerCase().startsWith(language) || 
          voice.name.toLowerCase().includes(language === "hi" ? "hindi" : "english")
      );
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        toast({
          title: language === "hi" ? "वाचन प्रारंभ" : "Speech Started",
          description: language === "hi" ? "एआई सहायक विश्लेषण पढ़ रहा है..." : "AI assistant is reading document analysis...",
        });
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (e) => {
        console.error("SpeechSynthesis error, falling back to Google Translate TTS:", e);
        playGoogleTTS(analysis, language, false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      playGoogleTTS(analysis, language, true);
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
    <section id="upload" className="py-24 bg-[#F0F4F8] relative">
      <div className="absolute left-0 right-0 top-0 h-[1px] bg-[#111827]/15"></div>
      
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 mb-4">
            <span className="h-[1px] w-8 bg-[#0B2545]/50"></span>
            <span className="text-xs font-bold text-[#0B2545] tracking-[4px] uppercase font-sans">
              {language === "hi" ? "दस्तावेज़ विश्लेषक" : "DOCUMENT ANALYSIS"}
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-sans font-black text-[#111827] leading-tight mb-4">
            {language === "hi" ? (
              <>
                दस्तावेज़ <span className="text-[#0B2545]">विश्लेषण</span>
              </>
            ) : (
              <>
                Document <span className="text-[#0B2545]">Analyzer</span>
              </>
            )}
          </h2>
          <p className="text-sm md:text-base text-[#111827]/60 max-w-2xl mx-auto leading-relaxed font-sans font-light tracking-wide">
            {language === "hi"
              ? "दस्तावेज़ों को अपलोड करें और एआई की सहायता से उनका आसान अनुवाद और सारांश पाएं।"
              : "Upload contracts, agreements, or land deeds to extract key points and legal advice."}
          </p>
        </div>

        <Card className="border border-[#111827]/15 shadow-none rounded-none bg-transparent overflow-hidden p-0">
          <CardHeader className="pb-4 p-6">
            <CardTitle className="flex items-center space-x-3 text-lg font-sans font-bold text-[#111827] uppercase tracking-wider">
              <Upload className="h-4 w-4 text-[#0B2545]" />
              <span>{language === "hi" ? "नया दस्तावेज़ अपलोड करें" : "Upload Document"}</span>
            </CardTitle>
            <CardDescription className="text-xs text-[#111827]/60 font-sans">
              {language === "hi" 
                ? "PDF फाइल चुनें (अधिकतम आकार 10MB)" 
                : "Select or drag a PDF document (Max size 10MB)"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 p-6 pt-0">
            <div className="border border-dashed border-[#111827]/30 hover:border-[#0B2545] bg-[#F0F4F8]/10 hover:bg-[#0B2545]/5 transition-all duration-300 rounded-none p-10 text-center cursor-pointer relative group">
              <input
                id="document"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="h-10 w-10 text-[#0B2545]/60 mx-auto mb-4 group-hover:scale-105 group-hover:text-[#0B2545] transition-all duration-300" />
              <p className="text-xs font-bold text-[#111827] uppercase tracking-wider font-sans">
                {language === "hi" ? "यहाँ PDF फ़ाइल खींचें या ब्राउज़ करें" : "Drag & drop PDF here, or click to browse"}
              </p>
              <p className="text-xs text-[#111827]/45 mt-2 font-sans tracking-wide">PDF (up to 10MB)</p>
            </div>

            {file && (
              <div className="flex items-center space-x-3 p-4 bg-[#0B2545]/5 border border-[#0B2545]/15 rounded-none animate-fade-in">
                <div className="p-2 bg-[#0B2545]/10 rounded-none">
                  <FileText className="h-4 w-4 text-[#0B2545]" />
                </div>
                <span className="text-xs font-bold text-[#111827] truncate max-w-xs">{file.name}</span>
                <CheckCircle className="h-4 w-4 text-[#0B2545] ml-auto" />
              </div>
            )}

            <Button
              onClick={analyzeDocument}
              disabled={!file || isAnalyzing}
              className="w-full bg-[#111827] hover:bg-[#0B2545] text-[#F0F4F8] font-semibold tracking-wider font-sans uppercase text-xs rounded-none py-6 shadow-sm transition-all duration-300 flex items-center justify-center space-x-2"
              size="lg"
            >
              {isAnalyzing ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-[#F0F4F8]" />
                  <span>{language === "hi" ? "दस्तावेज़ का विश्लेषण हो रहा है..." : "Analyzing Document..."}</span>
                </span>
              ) : (
                <span>{language === "hi" ? "विश्लेषण शुरू करें" : "Analyze Document"}</span>
              )}
            </Button>

            {isAnalyzing && (
              <div className="space-y-4 pt-4 border-t border-[#111827]/15 mt-4">
                <LegalLoader 
                  message={ocrStatus || (language === "hi" ? "दस्तावेज़ का विश्लेषण जारी है..." : "Analyzing Document...")} 
                  subMessage={
                    ocrStatus 
                      ? (language === "hi" ? "क्लाइंट-साइड OCR द्वारा दस्तावेज़ के पन्नों से पाठ निकाला जा रहा है..." : "Extracting text from pages using OCR...")
                      : (language === "hi" ? "हम नियमों और प्रावधानों का मिलान कर रहे हैं..." : "Verifying sections, regulations, and bylaws...")
                  } 
                />
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-[#0B2545] uppercase tracking-wider">
                    <span>{language === "hi" ? "प्रगति" : "Progress"}</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full h-1.5 bg-[#0B2545]/10 rounded-none" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {analysis && (
          <Card className="mt-8 border border-[#111827]/15 shadow-none rounded-none bg-transparent overflow-hidden p-0">
            <CardHeader className="bg-[#F0F4F8]/30 border-b border-[#111827]/15 py-4 px-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <CardTitle className="text-[#0B2545] font-sans font-bold text-base flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-[#0B2545]" />
                  <span>{language === "hi" ? "दस्तावेज़ विश्लेषण पूर्ण" : "Analysis Report"}</span>
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    onClick={toggleLanguageText}
                    variant="outline"
                    size="sm"
                    className="border-[#111827]/30 text-[#111827] hover:bg-[#0B2545]/5 hover:text-[#0B2545] hover:border-[#0B2545] bg-transparent rounded-none transition-all duration-300 uppercase font-sans text-xs tracking-widest font-bold h-8 px-3"
                    disabled={isAnalyzing}
                  >
                    <Languages className="h-3.5 w-3.5 mr-1.5 text-[#0B2545]" />
                    {language === "en" ? "हिंदी संस्करण" : "English Version"}
                  </Button>
                  <Button
                    onClick={readAloud}
                    variant="outline"
                    size="sm"
                    className={`border-[#111827]/30 text-[#111827] hover:bg-[#0B2545]/5 hover:text-[#0B2545] hover:border-[#0B2545] bg-transparent rounded-none transition-all duration-300 uppercase font-sans text-xs tracking-widest font-bold h-8 px-3 ${isSpeaking ? 'bg-[#0B2545]/10 border-[#0B2545]' : ''}`}
                  >
                    <Volume2 className="h-3.5 w-3.5 mr-1.5 text-[#0B2545]" />
                    {isSpeaking ? (language === "hi" ? "बोलना रोकें" : "Stop Speaking") : (language === "hi" ? "बोलकर सुनें" : "Read Aloud")}
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="prose max-w-none text-[#111827] leading-relaxed bg-[#F0F4F8]/10 p-6 rounded-none border border-[#111827]/10 max-h-[500px] overflow-y-auto shadow-inner font-sans font-light text-sm tracking-wide">
                {renderMarkdown(analysis)}
              </div>
            </CardContent>

            {recomLawyer && (
              <CardContent className="border-t border-[#111827]/15 p-6 bg-[#0B2545]/5">
                <h3 className="text-xs font-bold text-[#0B2545] tracking-widest uppercase mb-4 px-1">
                  ⚖️ {language === "en" ? "Matched Professional Advocate" : "आपके केस के लिए मिलान विशेषज्ञ वकील"}
                </h3>
                
                <div className="flex flex-col md:flex-row items-center justify-between w-full border border-[#111827]/15 bg-transparent rounded-none p-6 transition-all duration-300 gap-6 shadow-none">
                  <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#0B2545] bg-[#0B2545]/10 border border-[#0B2545]/20 px-3 py-1 rounded-none">
                        {language === "en" ? "AI Smart Recommendation" : "एआई स्मार्ट सुझाव"}
                      </span>
                      <CardTitle className="text-xl font-sans font-bold text-[#111827] mt-3">
                        {recomLawyer.Name}
                      </CardTitle>
                    </div>
                    
                    <div className="flex items-center space-x-1 bg-[#0B2545]/10 border border-[#0B2545]/20 rounded-none px-2.5 py-0.5">
                      <Star className="h-3.5 w-3.5 fill-[#00B4D8] text-[#00B4D8]" />
                      <span className="text-xs font-bold text-[#0B2545]">
                        {recomLawyer.Rating} / 5.0
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-[#111827]/85 font-sans font-light tracking-wide">
                      <p className="flex items-center space-x-2 justify-center md:justify-start">
                        <span className="text-[#0B2545]">📍</span>
                        <span>{recomLawyer.Location}</span>
                      </p>
                      <p className="flex items-center space-x-2 justify-center md:justify-start">
                        <span className="text-[#0B2545]">💼</span>
                        <span>
                          <strong>{language === "en" ? "Domain" : "विशेषज्ञता"}:</strong> {recomLawyer.Specialization}
                        </span>
                      </p>
                      <p className="flex items-center space-x-2 justify-center md:justify-start">
                        <span className="text-[#0B2545]">🎓</span>
                        <span>
                          <strong>{language === "en" ? "Experience" : "अनुभव"}:</strong> {recomLawyer.Experience}
                        </span>
                      </p>
                    </div>

                    <Button size="sm" className="bg-[#111827] hover:bg-[#0B2545] text-[#F0F4F8] font-semibold tracking-wider font-sans uppercase text-xs rounded-none py-4 transition-all duration-300 mt-2">
                      <a href="https://www.chatbase.co/chatbot-iframe/0CXRULDX-IJ6GaESy_Wy9" target="_blank" rel="noopener noreferrer">
                        {language === "en" ? "Contact Lawyer" : "वकील से संपर्क करें"}
                      </a>
                    </Button>
                  </div>

                  <div className="w-28 h-28 rounded-none overflow-hidden border border-[#111827]/15 shadow-inner flex items-center justify-center bg-[#EFEAE2] shrink-0">
                    <LawyerAvatar src={recomLawyer.Image_Url} alt={recomLawyer.Name} sizeClass="h-14 w-14" />
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
