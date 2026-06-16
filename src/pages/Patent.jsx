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
    <div className="min-h-screen bg-[#F0F4F8] relative overflow-hidden selection:bg-[#0B2545]/20 selection:text-[#111827]">
      <div className="absolute left-[8%] top-0 bottom-0 w-[1px] bg-[#0B2545]/[0.03] pointer-events-none"></div>
      <div className="absolute right-[8%] top-0 bottom-0 w-[1px] bg-[#0B2545]/[0.03] pointer-events-none"></div>

      <Header />
      
      <main className="container mx-auto px-6 sm:px-8 py-24 z-10 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 mb-4">
            <span className="h-[1px] w-8 bg-[#0B2545]/60"></span>
            <span className="text-xs font-bold text-[#0B2545] tracking-[4px] uppercase font-sans">
              {language === "hi" ? "नवाचार संरक्षण" : "RURAL INNOVATION"}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-sans text-[#111827] font-bold leading-tight tracking-tight mb-4">
            {language === "hi" ? (
              <>
                पेटेंट <span className="text-[#0B2545]">पंजीकरण पोर्टल</span>
              </>
            ) : (
              <>
                Patent <span className="text-[#0B2545]">Filing Portal</span>
              </>
            )}
          </h1>
          <p className="text-sm md:text-base text-[#111827]/70 max-w-xl mx-auto leading-relaxed font-sans font-light tracking-wide">
            {language === "hi"
              ? "ग्रामीण नवप्रवर्तकों के लिए अपने आविष्कारों का पेटेंट आवेदन करने और ट्रैक करने का सरल मंच।"
              : "Easy workflows for local inventors to file patents, protect intellectual property, and track claims."}
          </p>
        </div>

        {!isSubmitted ? (
          <Card className="max-w-3xl mx-auto border border-[#0B2545]/15 shadow-none rounded-none bg-transparent overflow-hidden p-0 mb-12">
            <CardHeader className="pb-4 p-6">
              <CardTitle className="text-lg font-sans font-bold text-[#111827] flex items-center space-x-3">
                <FileUp className="h-4 w-4 text-[#0B2545]" />
                <span>{language === "hi" ? "आवेदन प्रपत्र" : "Application Form"}</span>
              </CardTitle>
              <CardDescription className="text-xs text-[#111827]/60 font-sans">
                {language === "hi"
                  ? "कृपया अपने आविष्कार और व्यक्तिगत संपर्क का सटीक विवरण भरें।"
                  : "Provide accurate description and supporting documents for your intellectual claim."}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6 pt-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-xs font-bold text-[#0B2545] uppercase tracking-widest font-sans">
                      {language === "hi" ? "पूरा नाम" : "Full Name"} *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-2 rounded-none border-[#0B2545]/20 h-11 bg-transparent font-sans text-xs text-[#111827]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-xs font-bold text-[#0B2545] uppercase tracking-widest font-sans">
                      {language === "hi" ? "ईमेल पता" : "Email Address"} *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-2 rounded-none border-[#0B2545]/20 h-11 bg-transparent font-sans text-xs text-[#111827]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone" className="text-xs font-bold text-[#0B2545] uppercase tracking-widest font-sans">
                      {language === "hi" ? "मोबाइल नंबर" : "Phone Number"} *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="mt-2 rounded-none border-[#0B2545]/20 h-11 bg-transparent font-sans text-xs text-[#111827]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-xs font-bold text-[#0B2545] uppercase tracking-widest font-sans">
                      {language === "hi" ? "पूरा पता" : "Address"} *
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="mt-2 rounded-none border-[#0B2545]/20 h-11 bg-transparent font-sans text-xs text-[#111827]"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="patentTitle" className="text-xs font-bold text-[#0B2545] uppercase tracking-widest font-sans">
                    {language === "hi" ? "आविष्कार का शीर्षक" : "Patent Title"} *
                  </Label>
                  <Input
                    id="patentTitle"
                    name="patentTitle"
                    value={formData.patentTitle}
                    onChange={handleChange}
                    required
                    className="mt-2 rounded-none border-[#0B2545]/20 h-11 bg-transparent font-sans text-xs text-[#111827]"
                  />
                </div>

                <div>
                  <Label htmlFor="patentDescription" className="text-xs font-bold text-[#0B2545] uppercase tracking-widest font-sans">
                    {language === "hi" ? "आविष्कार का विस्तृत विवरण" : "Patent Description"} *
                  </Label>
                  <Textarea
                    id="patentDescription"
                    name="patentDescription"
                    value={formData.patentDescription}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="mt-2 rounded-none border border-[#0B2545]/20 focus:border-[#0B2545] focus:ring-0 placeholder:text-[#111827]/40 bg-transparent p-4 font-sans text-xs tracking-wide leading-relaxed text-[#111827] resize-none"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold text-[#0B2545] uppercase tracking-widest font-sans">
                    {language === "hi" ? "सहायक दस्तावेज अपलोड करें (PDF या वीडियो)" : "Upload Supporting Documents (PDF or Video)"} *
                  </Label>
                  <Input
                    type="file"
                    accept=".pdf,.mp4,.mov,.avi"
                    onChange={handleFileChange}
                    required
                    className="mt-2 rounded-none border-[#0B2545]/20 h-11 bg-transparent font-sans text-xs text-[#111827] pt-2"
                  />
                  <p className="text-xs text-[#111827]/50 mt-2 font-bold uppercase tracking-wider font-sans">
                    {language === "hi" ? "स्वीकृत प्रारूप: PDF, MP4, MOV, AVI" : "Accepted formats: PDF, MP4, MOV, AVI"}
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-transparent border border-[#0B2545] hover:bg-[#0B2545] text-[#0B2545] hover:text-[#F0F4F8] font-semibold tracking-wider font-sans uppercase text-xs rounded-none py-6 transition-all duration-300"
                >
                  {language === "hi" ? "आवेदन जमा करें" : "Submit Patent Application"} →
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-3xl mx-auto border border-[#0B2545]/15 shadow-none rounded-none bg-transparent overflow-hidden mb-12 p-6 text-center animate-fade-in">
            <div className="text-[#0B2545] mb-4">
              <CheckCircle2 className="h-12 w-12 mx-auto animate-bounce" />
            </div>
            <h2 className="text-2xl font-sans font-bold text-[#111827] mb-2">
              {language === "hi" ? "आवेदन सफलतापूर्वक जमा हुआ!" : "Application Submitted Successfully!"}
            </h2>
            <p className="text-xs text-[#111827]/70 mb-6 font-sans">
              {language === "hi" 
                ? "आपका पेटेंट आवेदन प्राप्त हो गया है और समीक्षा के लिए तैयार है।" 
                : "Your patent application has been received and is currently queued for legal validation."}
            </p>
            
            <div className="bg-[#0B2545]/5 border border-[#0B2545]/15 rounded-none p-6 max-w-md mx-auto">
              <p className="font-bold text-[#0B2545] text-xs uppercase tracking-widest font-sans">
                {language === "hi" ? "आपका टिकट नंबर" : "Your Tracking Ticket"}
              </p>
              <p className="text-2xl font-black text-[#111827] mt-1 font-mono tracking-wider">{ticketNumber}</p>
              <p className="mt-3 text-xs text-[#111827]/75">
                {language === "hi" ? "वर्तमान स्थिति" : "Current Status"}: <span className="font-bold text-[#0B2545] bg-[#0B2545]/10 border border-[#0B2545]/20 px-2 py-0.5 rounded-none">Submitted</span>
              </p>
            </div>
            
            <p className="mt-6 text-xs text-[#111827]/55 max-w-sm mx-auto font-sans leading-relaxed">
              {language === "hi" 
                ? "कृपया इस टिकट नंबर को सुरक्षित रखें। आप इसका उपयोग स्थिति ट्रैक करने में कर सकते हैं।" 
                : "Save this ticket number to monitor progress. You can query status anytime using the form below."}
            </p>
          </Card>
        )}

        <Card className="max-w-3xl mx-auto border border-[#0B2545]/15 shadow-none rounded-none bg-transparent overflow-hidden p-0 mb-8">
          <CardHeader className="pb-4 p-6">
            <CardTitle className="text-lg font-sans font-bold text-[#111827] flex items-center space-x-3">
              <Ticket className="h-4 w-4 text-[#0B2545]" />
              <span>{language === "hi" ? "अपने आवेदन को ट्रैक करें" : "Track Application"}</span>
            </CardTitle>
            <CardDescription className="text-xs text-[#111827]/60 font-sans">
              {language === "hi" 
                ? "अपनी आवेदन स्थिति जांचने के लिए टिकट नंबर दर्ज करें" 
                : "Provide your PAT-XXXXXXXX ticket to check current validation status"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 p-6 pt-0">
            <form onSubmit={handleTrackSubmit} className="space-y-4">
              <div>
                <Label htmlFor="trackingNumber" className="text-xs font-bold text-[#0B2545] uppercase tracking-widest font-sans">
                  {language === "hi" ? "टिकट संख्या दर्ज करें" : "Ticket Number"}
                </Label>
                <Input
                  id="trackingNumber"
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="PAT-12345678"
                  required
                  className="mt-2 rounded-none border-[#0B2545]/20 h-11 bg-transparent font-sans text-xs text-[#111827]"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-transparent border border-[#0B2545] hover:bg-[#0B2545] text-[#0B2545] hover:text-[#F0F4F8] font-semibold tracking-wider font-sans uppercase text-xs rounded-none py-6 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Search className="h-3.5 w-3.5 mr-2" />
                <span>{language === "hi" ? "स्थिति जांचें" : "Check Status"} →</span>
              </Button>
            </form>

            {isTracking && (
              <div className="mt-6 bg-[#0B2545]/5 border border-[#0B2545]/15 rounded-none p-6 animate-fade-in space-y-3">
                <h3 className="font-bold text-[#0B2545] text-xs uppercase tracking-widest font-sans">
                  {language === "hi" ? "आवेदन विवरण" : "Application Details"}
                </h3>
                <div className="space-y-1.5 text-xs text-[#111827]/85 font-sans font-light tracking-wide">
                  <p>
                    <span className="font-bold">{language === "hi" ? "टिकट नंबर" : "Ticket ID"}:</span>{" "}
                    <span className="font-mono text-[#111827] font-bold">{trackingNumber}</span>
                  </p>
                  <p>
                    <span className="font-bold">{language === "hi" ? "स्थिति" : "Status"}:</span>{" "}
                    <span className="font-bold text-[#0B2545] bg-[#0B2545]/10 border border-[#0B2545]/20 px-2 py-0.5 rounded-none">{trackingStatus}</span>
                  </p>
                </div>
                <p className="text-xs text-[#111827]/70 border-t border-[#0B2545]/15 pt-2.5 leading-relaxed font-sans font-light">
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
