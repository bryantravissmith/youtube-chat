"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic YouTube URL validation
    const videoIdMatch = youtubeUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    
    if (videoIdMatch) {
      const videoId = videoIdMatch[1];
      router.push(`/chat/${videoId}`);
    } else {
      alert('Please enter a valid YouTube URL');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black-100 p-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          YouTube Video Chat Companion
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            type="text" 
            placeholder="Enter YouTube Video URL" 
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
          <Button type="submit" className="w-full">
            Start Chatting
          </Button>
        </form>
      </div>
    </div>
  );
}