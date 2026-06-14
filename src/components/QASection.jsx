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
    <section id="qa" className="py-20 bg-white relative rounded-3xl my-6 border border-slate-100/50">
      <div className="absolute top-[-5%] left-[-5%] w-[25%] h-[25%] rounded-full bg-emerald-100/20 blur-[80px] pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            {language === "hi" ? (
              <>
                कानूनी सहायक <span className="text-gradient">(AI Q&A)</span>
              </>
            ) : (
              <>
                Legal AI <span className="text-gradient">Q&A Assistant</span>
              </>
            )}
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {language === "hi"
              ? "हिंदी या अंग्रेजी में कोई भी कानूनी प्रश्न पूछें और तत्कालिक सहायता सलाह प्राप्त करें।"
              : "Consult our legal model on labor laws, contract disputes, family rights, or civil issues."}
          </p>
        </div>

        <Card className="mb-8 border border-slate-100/80 shadow-2xl shadow-slate-100 rounded-3xl overflow-hidden bg-white p-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-xl font-extrabold text-slate-800">
              <MessageSquare className="h-5 w-5 text-indigo-600 animate-pulse" />
              <span>{language === "hi" ? "अपना प्रश्न पूछें" : "Consult AI Companion"}</span>
            </CardTitle>
            <CardDescription className="text-slate-400">
              {language === "hi" 
                ? "यहाँ अपना प्रश्न विस्तार से लिखें" 
                : "Type your query below in Hindi or English"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="question" className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                {language === "hi" ? "आपका प्रश्न" : "Your Question"}
              </Label>
              <Textarea
                id="question"
                placeholder={language === "hi" 
                  ? "उदाहरण: मेरी जमीन की पैमाइश/सीमा विवाद पर क्या नियम हैं?" 
                  : "e.g., What are the legal steps if a tenant refuses to pay rent?"}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="mt-2 min-h-[110px] rounded-2xl border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/5 placeholder:text-slate-400 resize-none p-4"
              />
            </div>

            <Button
              onClick={handleSubmitQuestion}
              disabled={!question.trim() || isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl py-6 shadow-xl shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all hover:scale-[1.01] active:scale-95 duration-200"
              size="lg"
            >
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{language === "hi" ? "AI उत्तर तैयार कर रहा है..." : "AI is writing response..."}</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <Send className="h-4 w-4" />
                  <span>{language === "hi" ? "प्रश्न सबमिट करें" : "Submit Question"}</span>
                </span>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {conversations.map((conv) => (
            <Card key={conv.id} className="border border-slate-100 shadow-xl shadow-slate-100 rounded-3xl overflow-hidden bg-white p-2 animate-fade-in">
              <CardContent className="p-6 space-y-6">
                {/* Question bubble */}
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-indigo-100/50">
                    <User className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-extrabold text-xs text-slate-450 uppercase tracking-widest mb-1.5">
                      {language === "hi" ? "आपका प्रश्न" : "Your Question"}
                    </h4>
                    <div className="text-slate-800 bg-indigo-50/20 border border-indigo-100/30 p-4 rounded-2xl rounded-tl-none leading-relaxed text-sm shadow-sm">
                      {conv.question}
                    </div>
                  </div>
                </div>

                {/* Answer bubble */}
                <div className="flex items-start space-x-4 pt-4 border-t border-slate-50">
                  <div className="p-3 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-emerald-100/50">
                    <Bot className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-extrabold text-xs text-slate-450 uppercase tracking-widest mb-1.5">
                      {language === "hi" ? "कानूनी सलाह (AI)" : "Legal AI Counsel"}
                    </h4>
                    <div className="text-slate-850 bg-emerald-50/20 border border-emerald-100/30 p-5 rounded-2xl rounded-tl-none leading-relaxed text-sm shadow-sm">
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
