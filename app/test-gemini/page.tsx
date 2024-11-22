// app/test-gemini/page.tsx
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type ConversationTurn = {
  role: string;
  message: string;
  response: string;
};

type TestResult = {
  status: string;
  apiKeyLastFour: string;
  conversation: ConversationTurn[];
  message: string;
};

export default function TestGemini() {
  const [result, setResult] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testGemini = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/test-gemini');
      const data = await response.json();

      if (data.status === 'error') {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Gemini Chat API Test</h1>
        
        <Button 
          onClick={testGemini} 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 mb-4"
        >
          {isLoading ? 'Testing Chat...' : 'Test Gemini Chat'}
        </Button>

        {error && (
          <div className="bg-red-900/50 border border-red-500 p-4 rounded-md mb-4">
            <h2 className="text-lg font-semibold mb-2">Error:</h2>
            <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        {result && (
          <div className="bg-gray-800 p-4 rounded-md">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Test Results:</h2>
              <p className="text-green-400">Status: {result.status}</p>
              <p className="text-gray-400">API Key (last 4): {result.apiKeyLastFour}</p>
              <p className="text-gray-400">{result.message}</p>
            </div>

            <h3 className="text-lg font-semibold mb-2">Conversation Test:</h3>
            <ScrollArea className="h-[400px] rounded-md border border-gray-700 p-4">
              {result.conversation.map((turn, index) => (
                <div key={index} className="mb-6">
                  <div className="mb-2">
                    <p className="text-blue-400 font-medium">User Message {index + 1}:</p>
                    <p className="bg-gray-900 p-2 rounded">{turn.message}</p>
                  </div>
                  <div>
                    <p className="text-green-400 font-medium">Assistant Response:</p>
                    <p className="bg-gray-900 p-2 rounded">{turn.response}</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}