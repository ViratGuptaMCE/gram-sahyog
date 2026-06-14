import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Ticket, Search, FileUp, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Patent = () => {
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "hi");
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    patentTitle: "",
    patentDescription: "",
    file: null
  });

  const [ticketNumber, setTicketNumber] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingStatus, setTrackingStatus] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleLangChange = () => {
      setLanguage(localStorage.getItem("language") || "hi");
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateTicketNumber = () => {
    return "PAT-" + Date.now().toString().slice(-8);
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTicketNumber = generateTicketNumber();
    setTicketNumber(newTicketNumber);

    const existingApplications =
      JSON.parse(localStorage.getItem("patentApplications")) || [];

    const newApplication = {
      ...formData,
      file: formData.file ? formData.file.name : null,
      ticketNumber: newTicketNumber,
      status: "Submitted",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "patentApplications",
      JSON.stringify([...existingApplications, newApplication])
    );

    setIsSubmitted(true);
    toast({
      title: language === "hi" ? "आवेदन जमा हो गया" : "Application Submitted",
      description: `${language === "hi" ? "टिकट संख्या" : "Ticket Number"}: ${newTicketNumber}`,
    });
  };

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!trackingNumber) return;

    const applications =
      JSON.parse(localStorage.getItem("patentApplications")) || [];

    const foundApplication = applications.find(
      (app) => app.ticketNumber === trackingNumber.trim()
    );

    if (foundApplication) {
      setTrackingStatus(foundApplication.status);
      setIsTracking(true);
    } else {
      toast({
        title: language === "hi" ? "कोई रिकॉर्ड नहीं मिला" : "No Record Found",
        description: language === "hi" ? "कृपया सही टिकट नंबर दर्ज करें।" : "Please enter a valid ticket number.",
        variant: "destructive"
      });
      setIsTracking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-slate-50 to-emerald-50/30">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 mb-4 shadow-sm">
            <Sparkles className="h-4 w-4 text-indigo-600 animate-spin" />
            <span className="text-xs font-bold text-indigo-800 tracking-wide uppercase">
              {language === "hi" ? "ग्रामीण नवाचार संवर्धन" : "Rural Innovation Promotion"}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-3">
            {language === "hi" ? (
              <>
                पेटेंट <span className="text-gradient">पंजीकरण पोर्टल</span>
              </>
            ) : (
              <>
                Patent <span className="text-gradient">Filing Portal</span>
              </>
            )}
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base">
            {language === "hi"
              ? "ग्रामीण नवप्रवर्तकों के लिए अपने आविष्कारों का पेटेंट आवेदन करने और ट्रैक करने का सरल मंच।"
              : "Easy workflows for local inventors to file patents, protect intellectual property, and track claims."}
          </p>
        </div>

        {!isSubmitted ? (
          <Card className="max-w-3xl mx-auto border border-slate-100 shadow-2xl shadow-slate-100 rounded-3xl overflow-hidden bg-white mb-8 p-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-extrabold text-slate-800 flex items-center space-x-2">
                <FileUp className="h-5 w-5 text-indigo-600" />
                <span>{language === "hi" ? "आवेदन प्रपत्र" : "Application Form"}</span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                {language === "hi"
                  ? "कृपया अपने आविष्कार और व्यक्तिगत संपर्क का सटीक विवरण भरें।"
                  : "Provide accurate description and supporting documents for your intellectual claim."}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {language === "hi" ? "पूरा नाम" : "Full Name"} *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-2 rounded-2xl border-slate-200 h-11 bg-slate-50/30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {language === "hi" ? "ईमेल पता" : "Email Address"} *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-2 rounded-2xl border-slate-200 h-11 bg-slate-50/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone" className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {language === "hi" ? "मोबाइल नंबर" : "Phone Number"} *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="mt-2 rounded-2xl border-slate-200 h-11 bg-slate-50/30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {language === "hi" ? "पूरा पता" : "Address"} *
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="mt-2 rounded-2xl border-slate-200 h-11 bg-slate-50/30"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="patentTitle" className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {language === "hi" ? "आविष्कार का शीर्षक" : "Patent Title"} *
                  </Label>
                  <Input
                    id="patentTitle"
                    name="patentTitle"
                    value={formData.patentTitle}
                    onChange={handleChange}
                    required
                    className="mt-2 rounded-2xl border-slate-200 h-11 bg-slate-50/30"
                  />
                </div>

                <div>
                  <Label htmlFor="patentDescription" className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {language === "hi" ? "आविष्कार का विस्तृत विवरण" : "Patent Description"} *
                  </Label>
                  <Textarea
                    id="patentDescription"
                    name="patentDescription"
                    value={formData.patentDescription}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="mt-2 rounded-2xl border-slate-200 placeholder:text-slate-400 resize-none p-4"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {language === "hi" ? "सहायक दस्तावेज़ अपलोड करें (PDF या वीडियो)" : "Upload Supporting Documents (PDF or Video)"} *
                  </Label>
                  <Input
                    type="file"
                    accept=".pdf,.mp4,.mov,.avi"
                    onChange={handleFileChange}
                    required
                    className="mt-2 rounded-2xl border-slate-200 h-11 bg-slate-50/30"
                  />
                  <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider">
                    {language === "hi" ? "स्वीकृत प्रारूप: PDF, MP4, MOV, AVI" : "Accepted formats: PDF, MP4, MOV, AVI"}
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl py-6 shadow-xl shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all hover:scale-[1.01] active:scale-95 duration-200"
                >
                  {language === "hi" ? "आवेदन जमा करें" : "Submit Patent Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-3xl mx-auto border border-slate-100 shadow-2xl shadow-slate-100 rounded-3xl overflow-hidden bg-white mb-8 p-6 text-center animate-fade-in">
            <div className="text-emerald-500 mb-4">
              <CheckCircle2 className="h-16 w-16 mx-auto animate-bounce" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
              {language === "hi" ? "आवेदन सफलतापूर्वक जमा हुआ!" : "Application Submitted Successfully!"}
            </h2>
            <p className="text-slate-500 mb-6 text-sm">
              {language === "hi" 
                ? "आपका पेटेंट आवेदन प्राप्त हो गया है और समीक्षा के लिए तैयार है।" 
                : "Your patent application has been received and is currently queued for legal validation."}
            </p>
            
            <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-6 max-w-md mx-auto">
              <p className="font-bold text-slate-500 text-xs uppercase tracking-widest">
                {language === "hi" ? "आपका टिकट नंबर" : "Your Tracking Ticket"}
              </p>
              <p className="text-2xl font-black text-indigo-700 mt-1 font-mono tracking-wider">{ticketNumber}</p>
              <p className="mt-3 text-xs text-slate-650">
                {language === "hi" ? "वर्तमान स्थिति" : "Current Status"}: <span className="font-extrabold text-indigo-600 bg-white border border-indigo-100 px-2 py-0.5 rounded-md">Submitted</span>
              </p>
            </div>
            
            <p className="mt-6 text-xs text-slate-400 max-w-sm mx-auto">
              {language === "hi" 
                ? "कृपया इस टिकट नंबर को सुरक्षित रखें। आप इसका उपयोग स्थिति ट्रैक करने में कर सकते हैं।" 
                : "Save this ticket number to monitor progress. You can query status anytime using the form below."}
            </p>
          </Card>
        )}

        <Card className="max-w-3xl mx-auto border border-slate-100 shadow-2xl shadow-slate-100 rounded-3xl overflow-hidden bg-white p-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-extrabold text-slate-800 flex items-center space-x-2">
              <Ticket className="h-5 w-5 text-indigo-600 animate-pulse" />
              <span>{language === "hi" ? "अपने आवेदन को ट्रैक करें" : "Track Application"}</span>
            </CardTitle>
            <CardDescription className="text-slate-400">
              {language === "hi" 
                ? "अपनी आवेदन स्थिति जांचने के लिए टिकट नंबर दर्ज करें" 
                : "Provide your PAT-XXXXXXXX ticket to check current validation status"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleTrackSubmit} className="space-y-4">
              <div>
                <Label htmlFor="trackingNumber" className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {language === "hi" ? "टिकट संख्या दर्ज करें" : "Ticket Number"}
                </Label>
                <Input
                  id="trackingNumber"
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="PAT-12345678"
                  required
                  className="mt-2 rounded-2xl border-slate-200 h-11 bg-slate-50/30"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl py-6 shadow-xl shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all hover:scale-[1.01] active:scale-95 duration-200"
              >
                <Search className="h-4 w-4 mr-2" />
                {language === "hi" ? "स्थिति जांचें" : "Check Status"}
              </Button>
            </form>

            {isTracking && (
              <div className="mt-6 bg-slate-50/80 border border-slate-100 rounded-2xl p-6 animate-fade-in space-y-3">
                <h3 className="font-extrabold text-slate-800 text-sm">
                  {language === "hi" ? "आवेदन विवरण" : "Application Details"}
                </h3>
                <div className="space-y-1.5 text-xs text-slate-650">
                  <p>
                    <span className="font-bold">{language === "hi" ? "टिकट नंबर" : "Ticket ID"}:</span>{" "}
                    <span className="font-mono text-indigo-700 font-bold">{trackingNumber}</span>
                  </p>
                  <p>
                    <span className="font-bold">{language === "hi" ? "स्थिति" : "Status"}:</span>{" "}
                    <span className="font-extrabold text-emerald-600 bg-white border border-slate-100 px-2 py-0.5 rounded-md">{trackingStatus}</span>
                  </p>
                </div>
                <p className="text-xs text-slate-500 border-t border-slate-200/50 pt-2.5 leading-relaxed">
                  {trackingStatus === "Submitted" &&
                    (language === "hi" 
                      ? "आपका आवेदन सफलतापूर्वक प्राप्त कर लिया गया है और विधिक समीक्षा की प्रतीक्षा कर रहा है।" 
                      : "Your application has been received and is awaiting legal validation.")}
                  {trackingStatus === "Under Review" &&
                    (language === "hi" 
                      ? "आपके आवेदन की वर्तमान में हमारे विधिक अधिकारियों द्वारा समीक्षा की जा रही है।" 
                      : "Your application is currently being analyzed by our legal expert panels.")}
                  {trackingStatus === "Approved" &&
                    (language === "hi" 
                      ? "बधाई हो! आपका पेटेंट आवेदन स्वीकृत कर लिया गया है।" 
                      : "Congratulations! Your patent application has been officially approved.")}
                  {trackingStatus === "Rejected" &&
                    (language === "hi" 
                      ? "अस्वीकृत। आपका आवेदन अस्वीकार कर दिया गया है। अधिक जानकारी के लिए सहायता से संपर्क करें।" 
                      : "Your application has been rejected. Please contact our helpdesk for support details.")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Patent;
