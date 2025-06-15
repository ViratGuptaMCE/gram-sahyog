
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            पेज नहीं मिला / Page Not Found
          </h2>
          <p className="text-gray-600">
            यह पेज उपलब्ध नहीं है। कृपया होम पेज पर वापस जाएं।
            <br />
            <span className="text-sm">This page is not available. Please return to the home page.</span>
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/')}
            className="w-full"
            size="lg"
          >
            <Home className="h-4 w-4 mr-2" />
            होम पेज पर जाएं / Go to Home Page
          </Button>
          
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            वापस जाएं / Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
