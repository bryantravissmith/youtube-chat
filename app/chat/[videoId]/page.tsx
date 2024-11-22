"use client";

import { useState, useEffect, useRef, use } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type VideoInfo = {
  title: string;
  channelTitle: string;
  transcript: string;
};

// Loading Spinner Component
function LoadingSpinner() {
  return (
    <div className="flex items-center space-x-2 text-gray-400">
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  );
}

// Message Component with Fade In
function Message({ message, isLatest }: { message: Message; isLatest: boolean }) {
  const [isVisible, setIsVisible] = useState(!isLatest);

  useEffect(() => {
    if (isLatest) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isLatest]);

  return (
    <div 
      className={`mb-4 p-3 rounded-lg max-w-[80%] text-white transition-opacity duration-300 ${
        message.role === 'user' 
          ? 'bg-blue-600 self-end ml-auto'
          : 'bg-gray-700 self-start mr-auto'
      } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {message.role === 'assistant' ? (
        <ReactMarkdown
          className="prose prose-invert max-w-none"
          components={{
            p: ({ children }) => <p className="mb-2">{children}</p>,
            ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
            li: ({ children }) => <li className="mb-1">{children}</li>,
            h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
            h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
            h3: ({ children }) => <h3 className="text-md font-bold mb-2">{children}</h3>,
            code: ({ children }) => (
              <code className="bg-gray-800 px-1 py-0.5 rounded">{children}</code>
            ),
            pre: ({ children }) => (
              <pre className="bg-gray-800 p-2 rounded mb-2 overflow-x-auto">{children}</pre>
            ),
            a: ({ href, children }) => (
              <a href={href} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-gray-600 pl-4 my-2">{children}</blockquote>
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      ) : (
        <div>{message.content}</div>
      )}
    </div>
  );
}

export default function ChatPage({ params }: { params: Promise<{ videoId: string }> }) {
  const resolvedParams = use(params);
  const videoId = resolvedParams.videoId;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Fetch video transcript and details
  useEffect(() => {
    const fetchVideoDetails = async () => {
      if (!videoId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const [transcriptResponse, videoResponse] = await Promise.all([
          fetch(`/api/transcript/${videoId}`),
          fetch(`/api/video-info/${videoId}`)
        ]);

        const transcriptData = await transcriptResponse.json();
        const videoData = await videoResponse.json();
        
        setVideoInfo({
          title: videoData.title,
          transcript: transcriptData.fullText,
          channelTitle: videoData.channelTitle
        });

        // Initial system message
        setMessages([{
          role: 'assistant', 
          content: `Hello! I'm your AI companion for the video "${videoData.title}" from the channel "${videoData.channelTitle}". I've analyzed the full transcript and I'm ready to discuss its contents. What would you like to know?`
        }]);

      } catch (error) {
        console.error('Failed to fetch video details', error);
        setMessages([{
          role: 'assistant',
          content: 'Sorry, I encountered an error loading the video transcript.'
        }]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoDetails();
  }, [videoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          videoTranscript: videoInfo?.transcript,
          videoTitle: videoInfo?.title
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      
      if (!text) {
        throw new Error('Empty response from chat API');
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: text
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: error instanceof Error 
          ? `Sorry, I encountered an error: ${error.message}`
          : 'Sorry, I encountered an error processing your message. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <div className="flex-grow container mx-auto max-w-2xl px-4 py-8 flex flex-col">
        <div className="bg-gray-800 rounded-xl shadow-md flex-grow flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h1 className="text-xl font-bold text-white">
              {videoInfo?.title || 'Video Chat'}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {videoInfo?.channelTitle || 'Loading channel...'}
            </p>
            {error && (
              <div className="mt-2 text-sm text-red-400">
                {error}
              </div>
            )}
          </div>
          <ScrollArea className="flex-grow p-4 space-y-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <Message
                key={index}
                message={msg}
                isLatest={index === messages.length - 1}
              />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4 p-3">
                <LoadingSpinner />
              </div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>
          <form 
            onSubmit={handleSubmit} 
            className="border-t border-gray-700 p-4 flex space-x-2"
          >
            <Input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the video..."
              className="flex-grow bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus-visible:ring-blue-600"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? 'Thinking...' : 'Send'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}