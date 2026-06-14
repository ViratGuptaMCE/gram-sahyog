import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building, MessageSquare, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LegalLoader from './LegalLoader';

const CorporateManager = () => {
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "hi");
  const [query, setQuery] = useState({
    category: '',
    company: '',
    issue: '',
    description: ''
  });
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem("corporate_tickets");
    return saved ? JSON.parse(saved) : [];
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("corporate_tickets", JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    const handleLangChange = () => {
      setLanguage(localStorage.getItem("language") || "hi");
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  const categories = [
    { value: 'employment', labelEn: 'Employment Law', labelHi: 'रोजगार कानून' },
    { value: 'contract', labelEn: 'Contract Disputes', labelHi: 'अनुबंध विवाद' },
    { value: 'compliance', labelEn: 'Compliance Issues', labelHi: 'अनुपालन मुद्दे' },
    { value: 'intellectual', labelEn: 'Intellectual Property', labelHi: 'बौद्धिक संपदा' },
    { value: 'corporate', labelEn: 'Corporate Governance', labelHi: 'कॉर्पोरेट गवर्नेंस' },
    { value: 'tax', labelEn: 'Tax Related', labelHi: 'कर संबंधी' }
  ];

  // No mock tickets

  const submitQuery = async () => {
    if (!query.category || !query.company || !query.issue) {
      toast({
        title: language === "hi" ? "त्रुटि" : "Error",
        description: language === "hi" ? "कृपया सभी आवश्यक फील्ड भरें" : "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      const selectedCat = categories.find(c => c.value === query.category);
      const newTicket = {
        id: `CORP${String(Date.now()).slice(-3)}`,
        categoryEn: selectedCat ? selectedCat.labelEn : query.category,
        categoryHi: selectedCat ? selectedCat.labelHi : query.category,
        company: query.company,
        issue: query.issue,
        status: 'pending',
        priority: 'medium',
        createdAt: new Date().toISOString().split('T')[0],
        responseEn: 'AI response is currently being prepared by our corporate team.',
        responseHi: 'हमारे कॉर्पोरेट कानूनी दल द्वारा एआई प्रतिक्रिया तैयार की जा रही है।'
      };
      
      setTickets(prev => [newTicket, ...prev]);
      setQuery({ category: '', company: '', issue: '', description: '' });
      setIsSubmitting(false);
      
      toast({
        title: language === "hi" ? "सफलतापूर्वक सबमिट किया गया" : "Successfully Submitted",
        description: `${language === "hi" ? "टिकट नंबर" : "Ticket ID"}: ${newTicket.id}`,
      });
    }, 1200);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-[#00B4D8]/15 border-[#00B4D8]/30 text-[#0B2545]';
      case 'pending': return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'in-progress': return 'bg-[#0B2545]/10 border-[#0B2545]/20 text-[#0B2545]';
      default: return 'bg-[#F0F4F8]/60 border-[#0B2545]/10 text-[#111827]';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-3 w-3" />;
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'in-progress': return <AlertCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  // Initialized from localStorage directly

  return (
    <section id="corporate" className="py-24 bg-[#F0F4F8] relative">
      <div className="absolute left-0 right-0 top-0 h-[1px] bg-[#0B2545]/15"></div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 mb-4">
            <span className="h-[1px] w-8 bg-[#0B2545]/60"></span>
            <span className="text-xs font-bold text-[#0B2545] tracking-[4px] uppercase font-sans">
              {language === "hi" ? "उद्यम अनुपालन" : "ENTERPRISE COMPLIANCE"}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-sans text-[#111827] font-bold leading-tight tracking-tight mb-4">
            {language === "hi" ? (
              <>
                कॉर्पोरेट <span className="text-[#0B2545]">कानूनी प्रबंधक</span>
              </>
            ) : (
              <>
                Corporate <span className="text-[#0B2545]">Legal Manager</span>
              </>
            )}
          </h2>
          <p className="text-sm md:text-base text-[#111827]/70 max-w-2xl mx-auto leading-relaxed font-sans font-light tracking-wide">
            {language === "hi"
              ? "लघु एवं ग्रामीण उद्योगों के लिए विशेष अनुपालन और विवाद समाधान सेल।"
              : "State compliance assistance, corporate filing tools, and employment disputes manager."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Query Submission Form */}
          <Card className="border border-[#0B2545]/15 shadow-none rounded-none bg-transparent overflow-hidden p-0">
            <CardHeader className="pb-4 p-6">
              <CardTitle className="flex items-center space-x-3 text-lg font-sans font-bold text-[#111827]">
                <Building className="h-4 w-4 text-[#0B2545]" />
                <span>{language === "hi" ? "नई समस्या सबमिट करें" : "Submit Legal Issue"}</span>
              </CardTitle>
              <CardDescription className="text-xs text-[#111827]/60 font-sans">
                {language === "hi"
                  ? "कंपनी के नियमों, करों या विवादों का विवरण भरें"
                  : "Provide details regarding your enterprise compliance concern"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4 p-6 pt-0">
              <div>
                <Label htmlFor="category" className="text-xs font-bold text-[#0B2545] uppercase tracking-widest font-sans">
                  {language === "hi" ? "श्रेणी" : "Category"} *
                </Label>
                <Select onValueChange={(value) => setQuery({...query, category: value})}>
                  <SelectTrigger className="mt-2 rounded-none border-[#0B2545]/20 h-11 bg-transparent font-sans text-xs text-[#111827]">
                    <SelectValue placeholder={language === "hi" ? "श्रेणी चुनें" : "Select Category"} />
                  </SelectTrigger>
                  <SelectContent className="rounded-none bg-[#F0F4F8]">
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value} className="rounded-none hover:bg-[#0B2545]/10">
                        {language === "hi" ? category.labelHi : category.labelEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="company" className="text-xs font-bold text-[#0B2545] uppercase tracking-widest font-sans">
                  {language === "hi" ? "कंपनी / व्यापार का नाम" : "Company Name"} *
                </Label>
                <Input
                  id="company"
                  placeholder={language === "hi" ? "जैसे: ग्रामीण हस्तशिल्प समिति" : "e.g., Rural Crafts Association"}
                  value={query.company}
                  onChange={(e) => setQuery({...query, company: e.target.value})}
                  className="mt-2 rounded-none border-[#0B2545]/20 h-11 bg-transparent font-sans text-xs text-[#111827]"
                />
              </div>

              <div>
                <Label htmlFor="issue" className="text-xs font-bold text-[#0B2545] uppercase tracking-widest font-sans">
                  {language === "hi" ? "समस्या का शीर्षक" : "Issue Title"} *
                </Label>
                <Input
                  id="issue"
                  placeholder={language === "hi" ? "संक्षेप में अपनी समस्या का शीर्षक लिखें" : "Brief title of the legal dispute"}
                  value={query.issue}
                  onChange={(e) => setQuery({...query, issue: e.target.value})}
                  className="mt-2 rounded-none border-[#0B2545]/20 h-11 bg-transparent font-sans text-xs text-[#111827]"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-xs font-bold text-[#0B2545] uppercase tracking-widest font-sans">
                  {language === "hi" ? "विस्तृत विवरण" : "Description"}
                </Label>
                <Textarea
                  id="description"
                  placeholder={language === "hi" ? "अपनी समस्या या अनुपालन मुद्दे का पूरा विवरण दें..." : "Describe the compliance dispute in detail..."}
                  value={query.description}
                  onChange={(e) => setQuery({...query, description: e.target.value})}
                  className="mt-2 min-h-[90px] rounded-none border border-[#0B2545]/20 focus:border-[#0B2545] focus:ring-0 placeholder:text-[#111827]/40 bg-transparent p-4 font-sans text-xs tracking-wide leading-relaxed text-[#111827] resize-none"
                />
              </div>

              <Button
                onClick={submitQuery}
                disabled={isSubmitting}
                className="w-full bg-transparent border border-[#0B2545] hover:bg-[#0B2545] text-[#0B2545] hover:text-[#F0F4F8] font-semibold tracking-wider font-sans uppercase text-xs rounded-none py-6 transition-all duration-300 flex items-center justify-center space-x-2"
                size="lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center space-x-2 justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-[#0B2545]" />
                    <span>{language === "hi" ? "सबमिट किया जा रहा है..." : "Submitting..."}</span>
                  </span>
                ) : (
                  <span>{language === "hi" ? "कानूनी मुद्दा दर्ज करें" : "File Corporate Issue"} →</span>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Tickets Tracking Log */}
          <div className="space-y-4 max-h-[510px] overflow-y-auto pr-2">
            <h3 className="text-sm font-bold text-[#0B2545] tracking-widest uppercase px-1 font-sans mb-4">
              💼 {language === "hi" ? "आपके सक्रिय मामले / टिकट" : "Your Active Compliance Cases"}
            </h3>

            {isSubmitting && (
              <Card className="border border-dashed border-[#0B2545]/30 rounded-none bg-[#F0F4F8]/10 p-4 text-center shadow-none animate-pulse">
                <LegalLoader 
                  message={language === "hi" ? "नया मामला दर्ज किया जा रहा है..." : "Filing Compliance Case..."} 
                  subMessage={language === "hi" ? "हम सुरक्षा मानकों और कानूनी डेटाबेस में आपका टिकट दर्ज कर रहे हैं..." : "Registering your audit query in the compliance logs..."} 
                />
              </Card>
            )}
            
            {tickets.length === 0 ? (
              <Card className="border border-dashed border-[#0B2545]/15 rounded-none bg-[#F0F4F8]/10 p-8 text-center shadow-none">
                <CardContent className="flex flex-col items-center justify-center space-y-3 py-6">
                  <Building className="h-10 w-10 text-[#0B2545]/40 stroke-1 animate-pulse" />
                  <p className="text-xs font-semibold text-[#0B2545] tracking-wider uppercase font-sans">
                    {language === "hi" 
                      ? "कोई सक्रिय कॉर्पोरेट मामला दर्ज नहीं है।" 
                      : "No active compliance cases filed yet."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              tickets.map((ticket) => (
                <Card key={ticket.id} className="border border-[#0B2545]/15 hover:shadow-[0_4px_20px_rgba(10,74,69,0.08)] transition-all duration-300 rounded-none bg-transparent p-0 shadow-none">
                  <CardHeader className="p-6 pb-2 text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold font-mono text-[#0B2545] bg-[#0B2545]/10 border border-[#0B2545]/20 px-2 py-0.5 rounded-none">
                        {ticket.id}
                      </span>
                      <Badge variant="outline" className={`flex items-center space-x-1 border text-xs font-bold rounded-none px-2 py-0.5 ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                        <span className="capitalize">{ticket.status}</span>
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-sans font-bold text-[#111827] mt-3 truncate">
                      {ticket.issue}
                    </CardTitle>
                    <CardDescription className="text-xs text-[#111827]/60 font-sans">
                      {ticket.company} • {ticket.createdAt}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-6 pt-2 space-y-3 text-left">
                    <div className="flex justify-between items-center bg-[#F0F4F8]/10 border border-[#0B2545]/10 p-2 rounded-none">
                      <span className="text-xs text-[#111827]/75 font-sans font-light tracking-wide">{language === "hi" ? "विषय श्रेणी" : "Category"}</span>
                      <span className="text-xs font-bold text-[#0B2545] bg-[#0B2545]/10 border border-[#0B2545]/20 px-2.5 py-0.5 rounded-none uppercase tracking-widest font-sans">
                        {language === "hi" ? ticket.categoryHi : ticket.categoryEn}
                      </span>
                    </div>

                    {ticket.responseEn && (
                      <div className="bg-[#0B2545]/5 border border-[#0B2545]/15 rounded-none p-4 mt-2 shadow-inner">
                        <div className="flex items-center space-x-1.5 mb-1.5">
                          <MessageSquare className="h-3.5 w-3.5 text-[#0B2545]" />
                          <span className="text-xs font-bold text-[#0B2545] uppercase tracking-wider font-sans">{language === "hi" ? "सलाहकार जवाब" : "Legal Counsel Response"}</span>
                        </div>
                        <p className="text-xs text-[#111827]/80 leading-relaxed font-sans font-light tracking-wide">
                          {language === "hi" ? ticket.responseHi : ticket.responseEn}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CorporateManager;
