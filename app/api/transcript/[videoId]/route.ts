// app/api/transcript/[videoId]/route.ts
import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

export async function GET(
  request: Request,
  context: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await context.params;
    
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const fullText = transcript
      .map(segment => segment.text)
      .join(' ')
      .trim();

    return NextResponse.json({
      fullText
    });
  } catch (error) {
    console.error('Transcript fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transcript' },
      { status: 500 }
    );
  }
}