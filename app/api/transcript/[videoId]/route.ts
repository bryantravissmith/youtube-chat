// app/api/transcript/[videoId]/route.ts
import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

function processTranscript(transcript: any[]): string {
    const fullText = transcript
      .map(segment => segment.text.trim())
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  
    // const maxLength = 4000;
    // if (fullText.length > maxLength) {
    //   const firstHalf = fullText.slice(0, maxLength / 2);
    //   const secondHalf = fullText.slice(-maxLength / 2);
    //   return `${firstHalf}... [truncated] ...${secondHalf}`;
    // }
    return fullText;
  }

export async function GET(
  request: Request,
  context: { params: Promise<{ videoId: string }> }
) {

    const { videoId } = await context.params;

    try {
        const transcript = await YoutubeTranscript.fetchTranscript(videoId);
        const processText = processTranscript(transcript);
        return NextResponse.json({
            fullText: processText,
            wordCount: processText.split(' ').length,
            charCount: processText.length
        });
    } catch (error) {
        console.error('Transcript fetch error:', error);
        return NextResponse.json(
        { error: 'Failed to fetch transcript' },
        { status: 500 }
        );
    }
}
