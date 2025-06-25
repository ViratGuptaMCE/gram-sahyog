// src/components/DocumentUploadV2.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileText,
  CheckCircle,
  Volume2,
  Languages,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DocumentUploadV2 = () => {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [progress, setProgress] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const { toast } = useToast();
  const [recomLawyer, setRecomLawyer] = useState(null);
  const [language, setLanguage] = useState("en"); // 'en' or 'hi'
  const [originalAnalysis, setOriginalAnalysis] = useState(""); // Store original English analysis for toggling

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
      toast({
        title: "File Uploaded",
        description: `${selectedFile.name} uploaded successfully`,
      });
    }
  };

  const analyzeDocument = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setProgress(0);

    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          // Leave 10% for final processing
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 2;
      });
    }, 500);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "query",
        "Analyze this legal document and provide key points, potential issues, and recommendations"
      );
      formData.append("translation_language", language); // Send current language preference

      const response = await fetch(
        "https://gram-sahyog.onrender.com/process_pdf/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Complete progress
      setProgress(100);
      setTimeout(() => {
        setAnalysis(data.translated_answer || data.answer);
        setOriginalAnalysis(data.answer); // Store original English version
        setRecomLawyer(data.lawyer);
        setIsAnalyzing(false);
      }, 500);
    } catch (error) {
      console.error("Error analyzing document:", error);
      setIsAnalyzing(false);
      clearInterval(progressInterval);
      toast({
        title: "Error",
        description: "Problem analyzing document",
        variant: "destructive",
      });
    }
  };

  const toggleLanguage = async () => {
    if (!analysis) return;

    if (language === "en") {
      // Switch to Hindi - we need to translate the existing analysis
      try {
        setIsAnalyzing(true);
        const response = await fetch(
          "https://gram-sahyog.onrender.com/translate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: originalAnalysis,
              target_lang: "hi",
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setAnalysis(data.translated_text);
        setLanguage("hi");
      } catch (error) {
        console.error("Error translating:", error);
        toast({
          title: "Error",
          description: "Problem translating to Hindi",
          variant: "destructive",
        });
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      // Switch back to English - use the original analysis
      setAnalysis(originalAnalysis);
      setLanguage("en");
    }
  };

  const readAloud = () => {
    if (!analysis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(analysis);

    // Use appropriate voice based on current language
    if (language === "hi") {
      const hindiVoice = voices.find(
        (voice) => voice.lang.includes("hi") || voice.name.includes("Hindi")
      );
      if (hindiVoice) {
        utterance.voice = hindiVoice;
        utterance.lang = "hi-IN";
      }
    } else {
      const englishVoice = voices.find(
        (voice) => voice.lang.includes("en") || voice.name.includes("English")
      );
      if (englishVoice) {
        utterance.voice = englishVoice;
        utterance.lang = "en-US";
      }
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  useEffect(() => {
    // Clean up speech synthesis when component unmounts
    return () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeaking]);

  return (
    <section id="upload" className="py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Document Analysis
          </h2>
          <p className="text-xl text-gray-600">
            Upload your legal documents for analysis
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-6 w-6" />
              <span>Document Upload</span>
            </CardTitle>
            <CardDescription>
              Upload your documents in PDF format (max 10MB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="document">Choose Document</Label>
              <Input
                id="document"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="mt-2"
              />
            </div>

            {file && (
              <div className="flex items-center space-x-2 p-4 bg-green-50 rounded-lg">
                <FileText className="h-5 w-5 text-green-600" />
                <span className="text-green-800">{file.name}</span>
                <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
              </div>
            )}

            <Button
              onClick={analyzeDocument}
              disabled={!file || isAnalyzing}
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Document"}
            </Button>

            {isAnalyzing && (
              <div className="space-y-2">
                <div className="text-sm text-gray-600">Analysis Progress</div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        {analysis && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-green-600">
                  Analysis Complete
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    onClick={toggleLanguage}
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-900"
                    disabled={isAnalyzing}
                  >
                    <Languages className="h-4 w-4 mr-2" />
                    {language === "en" ? "हिंदी" : "English"}
                  </Button>
                  <Button
                    onClick={readAloud}
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-900"
                    disabled={voices.length === 0}
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    {isSpeaking ? "Stop" : "Read Aloud"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-lg">
                {analysis.split("\n\n").map((section, index) => {
                  // Check if section is a main heading (starts with ** and ends with **)
                  if (section.startsWith("**") && section.endsWith("**")) {
                    const heading = section.replace(/\*\*/g, "");
                    return (
                      <h2
                        key={index}
                        className="text-xl font-bold text-gray-900 mt-6 mb-4 pb-2 border-b border-gray-200"
                      >
                        {heading}
                      </h2>
                    );
                  }

                  // Check if section is a subheading (starts with * and ends with *)
                  if (section.startsWith("*") && section.endsWith("*")) {
                    const subheading = section.replace(/\*/g, "");
                    return (
                      <h3
                        key={index}
                        className="text-lg font-semibold text-gray-800 mt-5 mb-3"
                      >
                        {subheading}
                      </h3>
                    );
                  }

                  // Check if section is a bold paragraph (wrapped in **)
                  if (section.includes("**")) {
                    const parts = section.split("**");
                    return (
                      <p key={index} className="text-gray-800 my-3">
                        {parts.map((part, i) =>
                          i % 2 === 1 ? (
                            <span key={i} className="font-bold">
                              <br />{part}
                            </span>
                          ) : (
                            part
                          )
                        )}
                      </p>
                    );
                  }

                  // Check if section is a numbered list
                  if (section.match(/^\d+\./m)) {
                    return (
                      <ol
                        key={index}
                        className="list-decimal pl-6 space-y-2 my-4"
                      >
                        {section
                          .split("\n")
                          .filter((item) => item.trim())
                          .map((item, i) => (
                            <li key={i} className="text-gray-800 mb-2">
                              {item.replace(/^\d+\.\s*/, "")}
                            </li>
                          ))}
                      </ol>
                    );
                  }

                  // Check if section is a bulleted list
                  if (section.startsWith("- ")) {
                    return (
                      <ul key={index} className="list-disc pl-6 space-y-2 my-4">
                        {section
                          .split("\n")
                          .filter((item) => item.trim())
                          .map((item, i) => (
                            <li key={i} className="text-gray-800 mb-2">
                              {item.replace(/^-\s*/, "")}
                            </li>
                          ))}
                      </ul>
                    );
                  }

                  // Check for key-value pairs (like "Key Points:")
                  if (section.includes(":")) {
                    const [key, ...valueParts] = section.split(":");
                    const value = valueParts.join(":").trim();

                    return (
                      <div key={index} className="my-3">
                        <span className="font-semibold text-gray-800">
                          {key}:
                        </span>
                        <span className="text-gray-800 ml-1">{value}</span>
                      </div>
                    );
                  }

                  // Regular paragraph with line breaks preserved
                  return (
                    <div
                      key={index}
                      className="text-gray-800 my-3 whitespace-pre-line"
                    >
                      {section}
                    </div>
                  );
                })}
              </div>
            </CardContent>
            {recomLawyer && (
              <CardContent>
                <CardHeader className="lawyerhero w-full p-10 mx-8">
                  <CardTitle className="text-blue-600 font-bold mb-10">
                    {language === "en" ? "Recommendation" : "सिफारिश"}
                  </CardTitle>
                  <Card className="lawyer flex justify-center items-center w-full border-red-500">
                    <CardContent className="w-full flex flex-col justify-center items-center gap-2">
                      <CardTitle className="details ml-10 text-red-500 p-10">
                        {recomLawyer.Name}
                      </CardTitle>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-lg font-semibold text-yellow-400">
                          {recomLawyer.Rating}
                        </span>
                      </div>
                      <CardContent>
                        <CardContent className="text-bold">
                          📌 {recomLawyer.Location}
                        </CardContent>
                        <CardContent className="text-bold">
                          🎓{" "}
                          {language === "en" ? "Specialization" : "विशेषज्ञता"}:{" "}
                          {recomLawyer.Specialization}
                        </CardContent>
                        <CardContent className="text-bold">
                          ⌚ {language === "en" ? "Experience" : "अनुभव"}:{" "}
                          {recomLawyer.Experience}
                        </CardContent>
                      </CardContent>
                    </CardContent>

                    <div className="imge w-full flex justify-center items-center">
                      <img
                        src={recomLawyer.Image_Url}
                        alt="lawyer image"
                        className=" "
                        style={{ width: "50%" }}
                      />
                    </div>
                  </Card>
                </CardHeader>
              </CardContent>
            )}
          </Card>
        )}
      </div>
    </section>
  );
};

export default DocumentUploadV2;
