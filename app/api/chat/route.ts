// app/api/chat/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    // Validate request body exists
    if (!req.body) {
      return new Response(
        JSON.stringify({ error: 'Request body is required' }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const body = await req.json();

    // Validate required fields
    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Valid messages array is required' }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!body.videoTitle || typeof body.videoTitle !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Video title is required' }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Simple function to truncate text
    const truncateText = (text: string, maxLength: number = 10000) => {
      if (!text) return '';
      if (text.length <= maxLength) return text;
      const halfLength = Math.floor(maxLength / 2);
      return `${text.slice(0, halfLength)}... [truncated] ...${text.slice(-halfLength)}`;
    };

    // Start a chat
    const chat = model.startChat();

    try {
      // Send the context first
      const videoTranscript = body.videoTranscript || 'No transcript available';
      const contextMessage = `I will act as an AI assistant discussing the YouTube video "${body.videoTitle}". Here's a summary of the video transcript: ${truncateText(videoTranscript)}`;
      
      await chat.sendMessage(contextMessage);

      // Send the actual user message
      const lastMessage = body.messages[body.messages.length - 1]?.content;
      if (!lastMessage) {
        throw new Error('No valid message content found');
      }

      const result = await chat.sendMessage(lastMessage);
      const response = await result.response;
      const text = response.text();

      return new Response(text, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });

    } catch (chatError) {
      console.error('Chat generation error:', chatError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate chat response' }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to process chat request' 
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}