import React, { useState } from "react";
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
import { MessageSquare, Send, User, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formatLegalResponse = (text) => {
  // Split the text into sections
  const sections = text.split("### ").filter((section) => section.trim());

  return sections.map((section, index) => {
    const [heading, ...content] = section
      .split("\n")
      .filter((line) => line.trim());
    const contentText = content.join("\n");

    return (
      <div key={index} className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3">{heading}</h3>
        {contentText.split("\n\n").map((paragraph, pIndex) => {
          // Format bold text within paragraphs
          const formattedParagraph = paragraph
            .split("**")
            .map((part, partIndex) => {
              return partIndex % 2 === 1 ? (
                <span key={partIndex} className="font-bold">
                  {part}
                </span>
              ) : (
                part
              );
            });

          return (
            <p key={pIndex} className="mb-3 text-gray-700">
              {formattedParagraph}
            </p>
          );
        })}
      </div>
    );
  });
};

const QASection = () => {
  const [question, setQuestion] = useState("");
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmitQuestion = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    const currentQuestion = question;
    setQuestion("");

    try {
      const response = await fetch(
        "https://gram-sahyog.onrender.com/getanswer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: currentQuestion,
          }),
        }
      );

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
        title: "उत्तर मिल गया / Answer Received",
        description:
          "आपके प्रश्न का कानूनी उत्तर तैयार है / Legal answer for your question is ready",
      });
    } catch (error) {
      console.error("Error fetching answer:", error);
      toast({
        title: "त्रुटि / Error",
        description:
          "उत्तर प्राप्त करने में समस्या हुई / Problem getting answer",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="qa" className="py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            प्रश्न-उत्तर सेवा / Q&A Service
          </h2>
          <p className="text-xl text-gray-600">
            कानूनी सवाल पूछें और विशेषज्ञों से उचित कानूनी रूप में जवाब पाएं
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-6 w-6" />
              <span>अपना प्रश्न पूछें / Ask Your Question</span>
            </CardTitle>
            <CardDescription>
              हिंदी या अंग्रेजी में अपना कानूनी प्रश्न लिखें
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="question">आपका प्रश्न / Your Question</Label>
              <Textarea
                id="question"
                placeholder="उदाहरण: मेरी ज़मीन पर कोई और कब्ज़ा कर रहा है, मैं क्या कर सकता हूँ? / Example: Someone is occupying my land, what can I do?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="mt-2 min-h-[100px]"
              />
            </div>

            <Button
              onClick={handleSubmitQuestion}
              disabled={!question.trim() || isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>उत्तर तैयार हो रहा है... / Preparing Answer...</>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  प्रश्न भेजें / Send Question
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {conversations.map((conv) => (
            <Card key={conv.id} className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <User className="h-8 w-8 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        आपका प्रश्न / Your Question:
                      </h4>
                      <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">
                        {conv.question}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Bot className="h-8 w-8 text-green-600 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        कानूनी सलाह / Legal Advice:
                      </h4>
                      <div className="text-gray-700 bg-green-50 p-4 rounded-lg">
                        <pre className="whitespace-pre-wrap text-sm">
                          {formatLegalResponse(conv.answer)}
                        </pre>
                      </div>
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
