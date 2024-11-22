// app/api/chat/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { messages, videoTranscript, videoTitle } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Messages are required and must be an array', { status: 400 });
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Simple function to truncate text to avoid context length issues
    const truncateText = (text: string, maxLength: number = 10000) => {
      if (text.length <= maxLength) return text;
      const halfLength = Math.floor(maxLength / 2);
      return `${text.slice(0, halfLength)}... [truncated] ...${text.slice(-halfLength)}`;
    };

    // Start a chat
    const chat = model.startChat();

    // Send the context first
    const contextMessage = `I will act as an AI assistant discussing the YouTube video "${videoTitle}". Here's a summary of the video transcript: ${truncateText(videoTranscript)}`;
    
    await chat.sendMessage(contextMessage);

    // Send the actual user message
    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;

    return new Response(response.text(), {
      headers: {
        'Content-Type': 'text/plain',
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}