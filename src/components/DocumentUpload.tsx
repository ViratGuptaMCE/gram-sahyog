
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DocumentUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      toast({
        title: "फ़ाइल अपलोड हुई / File Uploaded",
        description: `${selectedFile.name} सफलतापूर्वक अपलोड हुई / uploaded successfully`,
      });
    }
  };

  const analyzeDocument = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setProgress(0);
    
    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate API call
    setTimeout(() => {
      setAnalysis(`
दस्तावेज़ विश्लेषण रिपोर्ट / Document Analysis Report:

📋 दस्तावेज़ प्रकार: ${file.name.includes('contract') ? 'अनुबंध / Contract' : 'कानूनी दस्तावेज़ / Legal Document'}

✅ मुख्य बिंदु / Key Points:
• यह दस्तावेज़ कानूनी रूप से वैध प्रतीत होता है
• सभी आवश्यक हस्ताक्षर और मुहर मौजूद हैं
• कोई स्पष्ट कानूनी समस्या नहीं दिखाई दे रही

⚠️ सुझाव / Recommendations:
• इस दस्तावेज़ को स्थानीय वकील से भी दिखाएं
• यदि कोई संदेह है तो कानूनी सलाह लें
• दस्तावेज़ की फोटोकॉपी अपने पास सुरक्षित रखें

📞 अगले कदम: यदि आपको और सहायता चाहिए, तो हमारे Q&A सेक्शन का उपयोग करें या किसी वकील से संपर्क करें।
      `);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <section id="upload" className="py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            दस्तावेज़ अपलोड करें / Upload Documents
          </h2>
          <p className="text-xl text-gray-600">
            अपने कानूनी दस्तावेज़ अपलोड करें और हिंदी में विस्तृत विश्लेषण प्राप्त करें
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-6 w-6" />
              <span>दस्तावेज़ अपलोड / Document Upload</span>
            </CardTitle>
            <CardDescription>
              PDF, DOC, या JPG फॉर्मेट में अपने दस्तावेज़ अपलोड करें (अधिकतम 10MB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="document">दस्तावेज़ चुनें / Choose Document</Label>
              <Input
                id="document"
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
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
              {isAnalyzing ? 'विश्लेषण हो रहा है... / Analyzing...' : 'दस्तावेज़ का विश्लेषण करें / Analyze Document'}
            </Button>

            {isAnalyzing && (
              <div className="space-y-2">
                <div className="text-sm text-gray-600">विश्लेषण प्रगति / Analysis Progress</div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        {analysis && (
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">विश्लेषण पूर्ण / Analysis Complete</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">{analysis}</pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default DocumentUpload;
