// src/components/DocumentUploadV2.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DocumentUploadV2 = () => {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [progress, setProgress] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const { toast } = useToast();

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
        return prev + 10;
      });
    }, 500);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "query",
        "Analyze this legal document and provide key points, potential issues, and recommendations in Hindi"
      );
      formData.append("translation_language", "en");

      const response = await fetch("/api/process_pdf/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Complete progress
      setProgress(100);
      setTimeout(() => {
        setAnalysis(data.translated_answer || data.answer);
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

  const readAloud = () => {
    if (!analysis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(analysis);

    // Try to find a Hindi voice, fallback to default
    const hindiVoice = voices.find(
      (voice) => voice.lang.includes("hi") || voice.name.includes("Hindi")
    );

    if (hindiVoice) {
      utterance.voice = hindiVoice;
      utterance.lang = "hi-IN"; // Hindi language code
    } else {
      console.warn("No Hindi voice found, using default voice");
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
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-lg">
                {analysis.split("\n\n").map((section, index) => {
                  // Check if section is a heading
                  if (section.startsWith("**") && section.endsWith("**")) {
                    const heading = section.replace(/\*\*/g, "");
                    return (
                      <h3
                        key={index}
                        className="text-lg font-bold text-gray-900 mt-4 mb-2 border-b pb-2"
                      >
                        {heading}
                      </h3>
                    );
                  }

                  // Check if section is a numbered list
                  if (section.includes("1.") && section.includes("\n2.")) {
                    return (
                      <ol
                        key={index}
                        className="list-decimal pl-6 space-y-2 my-4"
                      >
                        {section
                          .split("\n")
                          .filter((item) => item.trim())
                          .map((item, i) => (
                            <li key={i} className="text-gray-800">
                              {item.replace(/^\d+\.\s*/, "")}
                            </li>
                          ))}
                      </ol>
                    );
                  }

                  // Check if section is a bulleted list
                  if (section.includes("- ")) {
                    return (
                      <ul key={index} className="list-disc pl-6 space-y-2 my-4">
                        {section
                          .split("\n")
                          .filter((item) => item.trim())
                          .map((item, i) => (
                            <li key={i} className="text-gray-800">
                              {item.replace(/^-\s*/, "")}
                            </li>
                          ))}
                      </ul>
                    );
                  }

                  // Regular paragraph
                  return (
                    <p key={index} className="text-gray-800 my-3">
                      {section}
                    </p>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default DocumentUploadV2;
