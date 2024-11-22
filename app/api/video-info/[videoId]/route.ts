// app/api/video-info/[videoId]/route.ts
import { channel } from 'diagnostics_channel';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: Promise<{ videoId: string }> }
) {
  if (!process.env.YOUTUBE_API_KEY) {
    return NextResponse.json(
      { error: 'YouTube API key not configured' },
      { status: 500 }
    );
  }


  const { videoId } = await context.params;

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('YouTube API response was not ok');
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    const videoInfo = data.items[0];
    return NextResponse.json({
      title: videoInfo.snippet.title,
      channelTitle: videoInfo.snippet.channelTitle,
      description: videoInfo.snippet.description
    });
  } catch (error) {
    console.error('Video info fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video info' },
      { status: 500 }
    );
  }
}