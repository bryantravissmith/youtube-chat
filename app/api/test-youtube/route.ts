// app/api/test-youtube/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  
  if (!API_KEY) {
    return NextResponse.json({ error: 'YouTube API key not found in environment variables' }, { status: 500 });
  }

  try {
    // Try to fetch a simple query - this one gets info for a popular video
    const testVideoId = 'dQw4w9WgXcQ';  // Famous Rick Astley video
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${testVideoId}&key=${API_KEY}`
    );

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({
        status: 'error',
        message: 'API Key invalid',
        details: data.error.message
      }, { status: 400 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'API Key is valid',
      data: {
        videoTitle: data.items[0]?.snippet?.title,
        apiKeyLastFour: API_KEY.slice(-4)
      }
    });

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to test API key',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}