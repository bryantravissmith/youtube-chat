// app/api/test-gemini/route.ts
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

export async function GET() {
  try {
    // Initialize the API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: 'GEMINI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    // Initialize the chat model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Start a chat
    const chat = model.startChat({
      generationConfig: {
        maxOutputTokens: 1000,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });

    // Array to store the conversation
    const conversation = [];

    // First round
    try {
      const result1 = await chat.sendMessage('Please count to 3.');
      const response1 = await result1.response;
      conversation.push({
        role: 'user',
        message: 'Please count to 3.',
        response: response1.text()
      });

      // Second round
      const result2 = await chat.sendMessage('What was my previous request?');
      const response2 = await result2.response;
      conversation.push({
        role: 'user',
        message: 'What was my previous request?',
        response: response2.text()
      });

      // Third round
      const result3 = await chat.sendMessage('Say goodbye!');
      const response3 = await result3.response;
      conversation.push({
        role: 'user',
        message: 'Say goodbye!',
        response: response3.text()
      });

    } catch (chatError) {
      console.error('Chat interaction error:', chatError);
      return Response.json({
        status: 'error',
        error: chatError instanceof Error ? chatError.message : 'Chat interaction failed',
        apiKeyLastFour: process.env.GEMINI_API_KEY.slice(-4)
      }, { 
        status: 500 
      });
    }

    return Response.json({
      status: 'success',
      apiKeyLastFour: process.env.GEMINI_API_KEY.slice(-4),
      conversation,
      message: 'Multi-turn chat test completed successfully'
    });

  } catch (error) {
    console.error('Gemini test error:', error);
    
    return Response.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      apiKeyLastFour: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.slice(-4) : 'none'
    }, { 
      status: 500 
    });
  }
}