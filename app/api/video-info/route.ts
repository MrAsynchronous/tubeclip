import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Dynamic import to handle potential module issues
    const ytdl = await import('@distube/ytdl-core');
    const ytdlCore = ytdl.default;

    // Validate YouTube URL
    if (!ytdlCore.validateURL(url)) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    // Get video info
    const info = await ytdlCore.getInfo(url);
    const videoDetails = info.videoDetails;

    // Format duration
    const duration = parseInt(videoDetails.lengthSeconds);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Get thumbnail
    const thumbnail = videoDetails.thumbnails && videoDetails.thumbnails.length > 0
      ? videoDetails.thumbnails[videoDetails.thumbnails.length - 1].url
      : '';

    return NextResponse.json({
      title: videoDetails.title,
      duration: formattedDuration,
      thumbnail: thumbnail,
    });

  } catch (error) {
    console.error('Error fetching video info:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to fetch video information';
    if (error instanceof Error) {
      if (error.message.includes('Video unavailable')) {
        errorMessage = 'This video is not available for download';
      } else if (error.message.includes('private')) {
        errorMessage = 'This video is private and cannot be downloaded';
      } else if (error.message.includes('age')) {
        errorMessage = 'Age-restricted videos cannot be downloaded';
      } else if (error.message.includes('extract')) {
        errorMessage = 'Unable to process this video. YouTube may have changed their system.';
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 