// src/components/DocumentUploadV2.jsx
import React, { useState } from "react";
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
import { Upload, FileText, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DocumentUploadV2 = () => {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

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
              <CardTitle className="text-green-600">
                Analysis Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="whitespace-pre-wrap text-sm">{analysis}</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default DocumentUploadV2;
