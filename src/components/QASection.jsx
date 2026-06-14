import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Send, User, Bot, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LegalLoader from "./LegalLoader";

const API_BASE = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "") : "/api";

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
          <ol key={`list-${key}`} className="list-decimal pl-6 my-3 space-y-1.5 text-slate-750">
            {currentList}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`list-${key}`} className="list-disc pl-6 my-3 space-y-1.5 text-slate-750">
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
        elements.push(<h1 key={index} className="text-lg md:text-xl font-black text-slate-900 mt-5 mb-2.5 pb-1.5 border-b border-slate-100">{headingText}</h1>);
      } else if (level === 2) {
        elements.push(<h2 key={index} className="text-base md:text-lg font-bold text-slate-900 mt-4 mb-2 pb-1 border-b border-slate-100/50">{headingText}</h2>);
      } else {
        elements.push(<h3 key={index} className="text-sm font-extrabold text-slate-850 mt-3 mb-1.5">{headingText}</h3>);
      }
      return;
    }

    if (trimmed.startsWith("**") && trimmed.endsWith("**") && !trimmed.slice(2, -2).includes("**")) {
      flushList(index);
      elements.push(<h4 key={index} className="text-xs font-extrabold text-slate-900 mt-3 mb-1.5 uppercase tracking-wider">{trimmed.slice(2, -2)}</h4>);
      return;
    }

    const bulletMatch = trimmed.match(/^[-*+]\s+(.*)$/);
    if (bulletMatch) {
      if (currentListType && currentListType !== 'ul') {
        flushList(index);
      }
      currentListType = 'ul';
      currentList.push(
        <li key={`li-${index}`} className="leading-relaxed text-sm text-slate-655 mb-0.5">
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
        <li key={`li-${index}`} className="leading-relaxed text-sm text-slate-655 mb-0.5">
          {parseInlineStyles(numberMatch[2])}
        </li>
      );
      return;
    }

    flushList(index);
    elements.push(
      <p key={index} className="my-2 text-slate-650 leading-relaxed text-sm">
        {parseInlineStyles(trimmed)}
      </p>
    );
  });

  flushList(lines.length);
  return elements;
};

const QASection = () => {
  const [question, setQuestion] = useState("");
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "hi");
  const [sessionId] = useState(() => "sess_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9));
  const { toast } = useToast();

  useEffect(() => {
    const handleLangChange = () => {
      setLanguage(localStorage.getItem("language") || "hi");
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  const handleSubmitQuestion = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    const currentQuestion = question;
    setQuestion("");

    try {
      const response = await fetch(`${API_BASE}/getanswer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentQuestion,
          session_id: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const newConversation = {
        id: Date.now(),
        question: currentQuestion,
        answer: data.answer,
      };

      setConversations((prev) => [newConversation, ...prev]);

      toast({
        title: language === "hi" ? "उत्तर प्राप्त हुआ" : "Answer Received",
        description: language === "hi" ? "एआई सहायक ने आपका कानूनी उत्तर तैयार कर दिया है" : "AI legal companion has prepared your reply.",
      });
    } catch (error) {
      console.error("Error fetching answer:", error);
      toast({
        title: language === "hi" ? "त्रुटि" : "Error",
        description: language === "hi" ? "उत्तर प्राप्त करने में असमर्थ" : "Failed to fetch response from Groq.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="qa" className="py-24 bg-[#F0F4F8] relative">
      <div className="absolute left-0 right-0 top-0 h-[1px] bg-[#111827]/15"></div>
      
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 mb-4">
            <span className="h-[1px] w-8 bg-[#0B2545]/50"></span>
            <span className="text-xs font-bold text-[#0B2545] tracking-[4px] uppercase font-sans">
              {language === "hi" ? "कानूनी एआई सहायक" : "LEGAL AI ASSISTANT"}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-sans font-black text-[#111827] leading-tight mb-4">
            {language === "hi" ? (
              <>
                कानूनी सहायक <span className="text-[#0B2545]">(AI Q&A)</span>
              </>
            ) : (
              <>
                Legal AI <span className="text-[#0B2545]">Q&A Assistant</span>
              </>
            )}
          </h2>
          <p className="text-sm md:text-base text-[#111827]/60 max-w-2xl mx-auto leading-relaxed font-sans font-light tracking-wide">
            {language === "hi"
              ? "हिंदी या अंग्रेजी में कोई भी कानूनी प्रश्न पूछें और तत्कालिक सहायता सलाह प्राप्त करें।"
              : "Consult our legal model on labor laws, contract disputes, family rights, or civil issues."}
          </p>
        </div>

        <Card className="mb-8 border border-[#111827]/15 shadow-none rounded-none bg-transparent overflow-hidden p-0">
          <CardHeader className="pb-4 p-6">
            <CardTitle className="flex items-center space-x-3 text-lg font-sans font-bold text-[#111827] uppercase tracking-wider">
              <MessageSquare className="h-4 w-4 text-[#0B2545]" />
              <span>{language === "hi" ? "अपना प्रश्न पूछें" : "Consult AI Companion"}</span>
            </CardTitle>
            <CardDescription className="text-xs text-[#111827]/60 font-sans">
              {language === "hi" 
                ? "यहाँ अपना प्रश्न विस्तार से लिखें" 
                : "Type your query below in Hindi or English"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 p-6 pt-0">
            <div>
              <Label htmlFor="question" className="text-xs font-bold text-[#0B2545] uppercase tracking-widest font-sans">
                {language === "hi" ? "आपका प्रश्न" : "Your Question"}
              </Label>
              <Textarea
                id="question"
                placeholder={language === "hi" 
                  ? "उदाहरण: मेरी जमीन की पैमाइश/सीमा विवाद पर क्या नियम हैं?" 
                  : "e.g., What are the legal steps if a tenant refuses to pay rent?"}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="mt-2 min-h-[110px] rounded-none border border-[#111827]/20 focus:border-[#0B2545] focus:ring-0 placeholder:text-[#111827]/40 bg-[#F0F4F8]/10 p-4 font-sans text-xs tracking-wide leading-relaxed text-[#111827] resize-none"
              />
            </div>

            <Button
              onClick={handleSubmitQuestion}
              disabled={!question.trim() || isLoading}
              className="w-full bg-[#111827] hover:bg-[#0B2545] text-[#F0F4F8] font-semibold tracking-wider font-sans uppercase text-xs rounded-none py-6 shadow-sm transition-all duration-300 flex items-center justify-center space-x-2"
              size="lg"
            >
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-[#F0F4F8]" />
                  <span>{language === "hi" ? "AI उत्तर तैयार कर रहा है..." : "AI is writing response..."}</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <Send className="h-3.5 w-3.5" />
                  <span>{language === "hi" ? "प्रश्न सबमिट करें" : "Submit Question"}</span>
                </span>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {isLoading && (
            <Card className="border border-dashed border-[#111827]/30 rounded-none bg-[#F0F4F8]/10 p-8 text-center shadow-none animate-pulse">
              <LegalLoader 
                message={language === "hi" ? "AI उत्तर तैयार कर रहा है..." : "AI is writing response..."} 
                subMessage={language === "hi" ? "कृपया कुछ क्षण प्रतीक्षा करें, हम कानून संहिताओं का विश्लेषण कर रहे हैं..." : "Please wait as we analyze the legal codes..."} 
              />
            </Card>
          )}

          {conversations.map((conv) => (
            <Card key={conv.id} className="border border-[#111827]/15 shadow-none rounded-none bg-transparent overflow-hidden p-0 animate-fade-in">
              <CardContent className="p-6 space-y-6">
                
                {/* Question bubble */}
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-[#0B2545]/5 rounded-none flex items-center justify-center shrink-0 border border-[#0B2545]/15 text-[#0B2545]">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-xs text-[#0B2545] uppercase tracking-widest mb-1.5 font-sans">
                      {language === "hi" ? "आपका प्रश्न" : "Your Question"}
                    </h4>
                    <div className="text-[#111827] bg-[#0B2545]/5 border border-[#0B2545]/10 p-4 rounded-none leading-relaxed text-xs shadow-sm font-sans tracking-wide">
                      {conv.question}
                    </div>
                  </div>
                </div>

                {/* Answer bubble */}
                <div className="flex items-start space-x-4 pt-4 border-t border-[#111827]/10">
                  <div className="p-3 bg-[#111827]/5 rounded-none flex items-center justify-center shrink-0 border border-[#111827]/15 text-[#111827]">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-xs text-[#111827]/60 uppercase tracking-widest mb-1.5 font-sans">
                      {language === "hi" ? "कानूनी सलाह (AI)" : "Legal AI Counsel"}
                    </h4>
                    <div className="text-[#111827] bg-transparent border border-[#0B2545]/15 p-5 rounded-none leading-relaxed text-xs shadow-sm font-sans tracking-wide">
                      {renderMarkdown(conv.answer)}
                    </div>
                  </div>
                </div>
                
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QASection;
