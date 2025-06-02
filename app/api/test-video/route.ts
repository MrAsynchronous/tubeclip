import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    console.log('Testing URL:', url);

    // Test the new ytdl-core package
    const ytdl = await import('@distube/ytdl-core');
    console.log('ytdl imported successfully');
    
    const ytdlCore = ytdl.default;
    console.log('ytdlCore extracted:', typeof ytdlCore);

    // Test URL validation
    const isValid = ytdlCore.validateURL(url);
    console.log('URL validation result:', isValid);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    // Try to get basic info
    console.log('Attempting to get video info...');
    const info = await ytdlCore.getBasicInfo(url);
    console.log('Basic info retrieved successfully');

    return NextResponse.json({
      success: true,
      title: info.videoDetails.title,
      videoId: info.videoDetails.videoId,
      lengthSeconds: info.videoDetails.lengthSeconds,
    });

  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json(
      { 
        error: 'Test failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 