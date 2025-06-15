
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CorporateManager = () => {
  const [query, setQuery] = useState({
    category: '',
    company: '',
    issue: '',
    description: ''
  });
  const [tickets, setTickets] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const categories = [
    { value: 'employment', label: 'रोजगार कानून / Employment Law' },
    { value: 'contract', label: 'अनुबंध विवाद / Contract Disputes' },
    { value: 'compliance', label: 'अनुपालन मुद्दे / Compliance Issues' },
    { value: 'intellectual', label: 'बौद्धिक संपदा / Intellectual Property' },
    { value: 'corporate', label: 'कॉर्पोरेट गवर्नेंस / Corporate Governance' },
    { value: 'tax', label: 'कर संबंधी / Tax Related' }
  ];

  const mockTickets = [
    {
      id: 'CORP001',
      category: 'रोजगार कानून',
      company: 'टेक कॉर्प इंडिया',
      issue: 'कर्मचारी छंटनी नीति',
      status: 'resolved',
      priority: 'high',
      createdAt: '2024-01-15',
      response: 'आपकी कंपनी की छंटनी नीति भारतीय श्रम कानून के अनुसार है। कुछ सुधार के सुझाव दिए गए हैं।'
    },
    {
      id: 'CORP002', 
      category: 'अनुबंध विवाद',
      company: 'मैन्युफैक्चरिंग प्राइवेट लिमिटेड',
      issue: 'विक्रेता अनुबंध समस्या',
      status: 'pending',
      priority: 'medium',
      createdAt: '2024-01-20',
      response: ''
    }
  ];

  const submitQuery = async () => {
    if (!query.category || !query.company || !query.issue) {
      toast({
        title: "त्रुटि / Error",
        description: "कृपया सभी आवश्यक फील्ड भरें / Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      const newTicket = {
        id: `CORP${String(Date.now()).slice(-3)}`,
        category: query.category,
        company: query.company,
        issue: query.issue,
        status: 'pending',
        priority: 'medium',
        createdAt: new Date().toISOString().split('T')[0],
        response: ''
      };
      
      setTickets(prev => [newTicket, ...prev]);
      setQuery({ category: '', company: '', issue: '', description: '' });
      setIsSubmitting(false);
      
      toast({
        title: "सफलतापूर्वक जमा किया गया / Successfully Submitted",
        description: `टिकट नंबर: ${newTicket.id}`,
      });
    }, 1500);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Initialize with mock data on first render
  React.useEffect(() => {
    if (tickets.length === 0) {
      setTickets(mockTickets);
    }
  }, []);

  return (
    <section id="corporate" className="py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            कॉर्पोरेट कानूनी प्रबंधक / Corporate Legal Manager
          </h2>
          <p className="text-xl text-gray-600">
            कॉर्पोरेट कर्मचारियों के लिए विशेष कानूनी सहायता सेवा
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Query Submission Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-6 w-6" />
                <span>नई कानूनी समस्या सबमिट करें / Submit New Legal Issue</span>
              </CardTitle>
              <CardDescription>
                अपनी कंपनी की कानूनी समस्या का विवरण दें
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">समस्या की श्रेणी / Issue Category *</Label>
                <Select onValueChange={(value) => setQuery({...query, category: value})}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="श्रेणी चुनें / Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="company">कंपनी का नाम / Company Name *</Label>
                <Input
                  id="company"
                  placeholder="आपकी कंपनी का नाम / Your Company Name"
                  value={query.company}
                  onChange={(e) => setQuery({...query, company: e.target.value})}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="issue">समस्या का शीर्षक / Issue Title *</Label>
                <Input
                  id="issue"
                  placeholder="संक्षेप में समस्या बताएं / Brief description of issue"
                  value={query.issue}
                  onChange={(e) => setQuery({...query, issue: e.target.value})}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description">विस्तृत विवरण / Detailed Description</Label>
                <Textarea
                  id="description"
                  placeholder="समस्या का विस्तृत विवरण दें / Provide detailed description of the issue"
                  value={query.description}
                  onChange={(e) => setQuery({...query, description: e.target.value})}
                  className="mt-2 min-h-[100px]"
                />
              </div>

              <Button
                onClick={submitQuery}
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? 'सबमिट हो रहा है... / Submitting...' : 'समस्या सबमिट करें / Submit Issue'}
              </Button>
            </CardContent>
          </Card>

          {/* Tickets History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-6 w-6" />
                <span>आपके टिकट्स / Your Tickets</span>
              </CardTitle>
              <CardDescription>
                सबमिट किए गए कानूनी मुद्दों की स्थिति देखें
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{ticket.id}</Badge>
                        <Badge className={getStatusColor(ticket.status)}>
                          {getStatusIcon(ticket.status)}
                          <span className="ml-1">
                            {ticket.status === 'resolved' ? 'हल किया गया' : 
                             ticket.status === 'pending' ? 'लंबित' : 'प्रगति में'}
                          </span>
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">{ticket.createdAt}</span>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm">{ticket.issue}</h4>
                      <p className="text-sm text-gray-600">{ticket.company}</p>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {ticket.category}
                      </Badge>
                    </div>

                    {ticket.response && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <h5 className="font-semibold text-sm text-green-800 mb-1">
                          कानूनी सलाह / Legal Advice:
                        </h5>
                        <p className="text-sm text-green-700">{ticket.response}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Help Section */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Building className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">त्वरित सहायता / Quick Help</h3>
                <p className="text-sm text-gray-600">24/7 कॉर्पोरेट कानूनी सहायता उपलब्ध</p>
              </div>
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">विशेषज्ञ सलाह / Expert Advice</h3>
                <p className="text-sm text-gray-600">अनुभवी कानूनी विशेषज्ञों से सलाह</p>
              </div>
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">त्वरित समाधान / Quick Solutions</h3>
                <p className="text-sm text-gray-600">48 घंटे में प्रारंभिक सलाह</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CorporateManager;
