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

const CorporateManager = () => {
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "hi");
  const [query, setQuery] = useState({
    category: '',
    company: '',
    issue: '',
    description: ''
  });
  const [tickets, setTickets] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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

  const mockTickets = [
    {
      id: 'CORP001',
      categoryEn: 'Employment Law',
      categoryHi: 'रोजगार कानून',
      company: 'Tech Corp India',
      issue: 'Employee Layoff Policy',
      status: 'resolved',
      priority: 'high',
      createdAt: '2026-05-15',
      responseEn: 'Your layoff policies align with the Indian Industrial Disputes Act. Recommendations sent via email.',
      responseHi: 'आपकी छंटनी नीतियां औद्योगिक विवाद अधिनियम के अनुरूप हैं। ईमेल के जरिए सुधार के सुझाव भेजे गए हैं।'
    },
    {
      id: 'CORP002', 
      categoryEn: 'Contract Disputes',
      categoryHi: 'अनुबंध विवाद',
      company: 'Rural Craft Ltd',
      issue: 'Vendor payment default',
      status: 'pending',
      priority: 'medium',
      createdAt: '2026-06-10',
      responseEn: '',
      responseHi: ''
    }
  ];

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
      case 'resolved': return 'bg-emerald-50 border-emerald-100 text-emerald-700';
      case 'pending': return 'bg-amber-50 border-amber-100 text-amber-700';
      case 'in-progress': return 'bg-blue-550 border-blue-100 text-blue-700';
      default: return 'bg-slate-50 border-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-3.5 w-3.5" />;
      case 'pending': return <Clock className="h-3.5 w-3.5" />;
      case 'in-progress': return <AlertCircle className="h-3.5 w-3.5" />;
      default: return <Clock className="h-3.5 w-3.5" />;
    }
  };

  useEffect(() => {
    if (tickets.length === 0) {
      setTickets(mockTickets);
    }
  }, []);

  return (
    <section id="corporate" className="py-20 bg-slate-50/50 relative rounded-3xl my-6 border border-slate-100">
      <div className="absolute top-[-5%] left-[-5%] w-[20%] h-[20%] rounded-full bg-orange-100/20 blur-[80px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            {language === "hi" ? (
              <>
                कॉर्पोरेट <span className="text-gradient">कानूनी प्रबंधक</span>
              </>
            ) : (
              <>
                Corporate <span className="text-gradient">Legal Manager</span>
              </>
            )}
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {language === "hi"
              ? "लघु एवं ग्रामीण उद्योगों के लिए विशेष अनुपालन और विवाद समाधान सेल।"
              : "State compliance assistance, corporate filing tools, and employment disputes manager."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Query Submission Form */}
          <Card className="border border-slate-100/80 shadow-2xl shadow-slate-100 rounded-3xl overflow-hidden bg-white p-2">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-xl font-extrabold text-slate-800">
                <Building className="h-5 w-5 text-indigo-600 animate-pulse" />
                <span>{language === "hi" ? "नई समस्या सबमिट करें" : "Submit Legal Issue"}</span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                {language === "hi"
                  ? "कंपनी के नियमों, करों या विवादों का विवरण भरें"
                  : "Provide details regarding your enterprise compliance concern"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category" className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {language === "hi" ? "श्रेणी" : "Category"} *
                </Label>
                <Select onValueChange={(value) => setQuery({...query, category: value})}>
                  <SelectTrigger className="mt-2 rounded-2xl border-slate-200 h-11 bg-slate-50/30">
                    <SelectValue placeholder={language === "hi" ? "श्रेणी चुनें" : "Select Category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {language === "hi" ? category.labelHi : category.labelEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="company" className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {language === "hi" ? "कंपनी / व्यापार का नाम" : "Company Name"} *
                </Label>
                <Input
                  id="company"
                  placeholder={language === "hi" ? "जैसे: ग्रामीण हस्तशिल्प समिति" : "e.g., Rural Crafts Association"}
                  value={query.company}
                  onChange={(e) => setQuery({...query, company: e.target.value})}
                  className="mt-2 rounded-2xl border-slate-200 h-11 bg-slate-50/30"
                />
              </div>

              <div>
                <Label htmlFor="issue" className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {language === "hi" ? "समस्या का शीर्षक" : "Issue Title"} *
                </Label>
                <Input
                  id="issue"
                  placeholder={language === "hi" ? "संक्षेप में अपनी समस्या का शीर्षक लिखें" : "Brief title of the legal dispute"}
                  value={query.issue}
                  onChange={(e) => setQuery({...query, issue: e.target.value})}
                  className="mt-2 rounded-2xl border-slate-200 h-11 bg-slate-50/30"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {language === "hi" ? "विस्तृत विवरण" : "Description"}
                </Label>
                <Textarea
                  id="description"
                  placeholder={language === "hi" ? "अपनी समस्या या अनुपालन मुद्दे का पूरा विवरण दें..." : "Describe the compliance dispute in detail..."}
                  value={query.description}
                  onChange={(e) => setQuery({...query, description: e.target.value})}
                  className="mt-2 min-h-[90px] rounded-2xl border-slate-200 placeholder:text-slate-400 resize-none p-4"
                />
              </div>

              <Button
                onClick={submitQuery}
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl py-6 shadow-xl shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all hover:scale-[1.01] active:scale-95 duration-200"
                size="lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center space-x-2 justify-center">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{language === "hi" ? "सबमिट किया जा रहा है..." : "Submitting..."}</span>
                  </span>
                ) : (
                  <span>{language === "hi" ? "कानूनी मुद्दा दर्ज करें" : "File Corporate Issue"}</span>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Tickets Tracking Log */}
          <div className="space-y-4 max-h-[510px] overflow-y-auto pr-2">
            <h3 className="text-base font-extrabold text-slate-800 px-1">
              💼 {language === "hi" ? "आपके सक्रिय मामले / टिकट" : "Your Active Compliance Cases"}
            </h3>
            
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="border border-slate-100 hover:shadow-lg transition-all duration-300 rounded-3xl bg-white p-2">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-extrabold font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100/50">
                      {ticket.id}
                    </span>
                    <Badge variant="outline" className={`flex items-center space-x-1 border text-xs font-bold rounded-full px-2 py-0.5 ${getStatusColor(ticket.status)}`}>
                      {getStatusIcon(ticket.status)}
                      <span className="capitalize">{ticket.status}</span>
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-extrabold text-slate-900 mt-2 truncate">
                    {ticket.issue}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    {ticket.company} • {ticket.createdAt}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3 px-6 pb-4">
                  <div className="flex justify-between items-center bg-slate-50/50 border border-slate-100/50 p-2.5 rounded-xl">
                    <span className="text-xs font-bold text-slate-500">{language === "hi" ? "विषय श्रेणी" : "Category"}</span>
                    <span className="text-xs font-extrabold text-slate-800 bg-white border border-slate-100 px-2.5 py-0.5 rounded-lg">
                      {language === "hi" ? ticket.categoryHi : ticket.categoryEn}
                    </span>
                  </div>

                  {ticket.responseEn && (
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mt-2 shadow-inner">
                      <div className="flex items-center space-x-1.5 mb-1.5">
                        <MessageSquare className="h-4 w-4 text-emerald-600" />
                        <span className="text-xs font-extrabold text-emerald-800">{language === "hi" ? "सलाहकार जवाब" : "Legal Counsel Response"}</span>
                      </div>
                      <p className="text-xs text-slate-650 leading-relaxed">
                        {language === "hi" ? ticket.responseHi : ticket.responseEn}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CorporateManager;
