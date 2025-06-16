
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquare, Send, User, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const QASection = () => {
  const [question, setQuestion] = useState('');
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmitQuestion = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    const currentQuestion = question;
    setQuestion('');

    // Simulate AI response
    setTimeout(() => {
      const mockAnswer = `
कानूनी सलाह / Legal Advice:

प्रश्न के संबंध में:
आपके द्वारा पूछे गए प्रश्न "${currentQuestion}" के लिए निम्नलिखित कानूनी सलाह है:

📚 कानूनी स्थिति:
• भारतीय कानून के अनुसार यह मामला संविधान के अनुच्छेद के तहत आता है
• इस प्रकार के मामलों में सामान्यतः निम्नलिखित प्रक्रिया अपनाई जाती है

⚖️ कानूनी कार्यवाही:
• सबसे पहले संबंधित दस्तावेज़ इकट्ठे करें
• स्थानीय कानूनी सहायता केंद्र से संपर्क करें
• यदि आवश्यक हो तो न्यायालय में याचिका दायर करें

📋 आवश्यक दस्तावेज़:
• पहचान प्रमाण पत्र
• पता प्रमाण पत्र
• संबंधित केस से जुड़े दस्तावेज़

🔔 महत्वपूर्ण सुझाव:
यह केवल सामान्य कानूनी जानकारी है। विस्तृत कानूनी सलाह के लिए कृपया किसी योग्य वकील से मिलें।

Legal Advice in English:
For the question "${currentQuestion}", please consult with a qualified lawyer for specific legal advice. This is general information only.
      `;

      const newConversation = {
        id: Date.now(),
        question: currentQuestion,
        answer: mockAnswer
      };

      setConversations(prev => [newConversation, ...prev]);
      setIsLoading(false);
      
      toast({
        title: "उत्तर मिल गया / Answer Received",
        description: "आपके प्रश्न का कानूनी उत्तर तैयार है / Legal answer for your question is ready",
      });
    }, 2000);
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
                      <h4 className="font-semibold text-gray-900 mb-2">आपका प्रश्न / Your Question:</h4>
                      <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{conv.question}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Bot className="h-8 w-8 text-green-600 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">कानूनी सलाह / Legal Advice:</h4>
                      <div className="text-gray-700 bg-green-50 p-4 rounded-lg">
                        <pre className="whitespace-pre-wrap text-sm">{conv.answer}</pre>
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
