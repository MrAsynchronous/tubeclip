import { NextRequest, NextResponse } from 'next/server';
import { Readable, PassThrough } from 'stream';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';

// Set FFmpeg path for Vercel deployment
ffmpeg.setFfmpegPath(ffmpegPath.path);

export async function POST(request: NextRequest) {
  try {
    const { url, format, quality } = await request.json();

    if (!url || !format || !quality) {
      return NextResponse.json({ error: 'URL, format, and quality are required' }, { status: 400 });
    }

    // Dynamic import to handle potential module issues
    const ytdl = await import('@distube/ytdl-core');
    const ytdlCore = ytdl.default;

    // Validate YouTube URL
    if (!ytdlCore.validateURL(url)) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    // Get video info for filename
    const info = await ytdlCore.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s-]/g, '').trim();

    let stream: Readable;
    let contentType: string;
    let filename: string;

    if (format === 'mp4') {
      // Download video with audio (best quality that includes both)
      const qualityMap: { [key: string]: string } = {
        '720p': 'best[height<=720]',
        '1080p': 'best[height<=1080]', 
        '1440p': 'best[height<=1440]',
        '2160p': 'best[height<=2160]'
      };
      
      stream = ytdlCore(url, {
        quality: qualityMap[quality] || 'best',
        filter: (format: { hasVideo?: boolean; hasAudio?: boolean }) => {
          // Prefer formats that have both video and audio
          return !!(format.hasVideo && format.hasAudio);
        }
      });
      contentType = 'video/mp4';
      filename = `${title}.mp4`;

      // For MP4, stream directly without conversion
      const chunks: Buffer[] = [];
      
      return new Promise<NextResponse>((resolve, reject) => {
        stream.on('data', (chunk) => {
          chunks.push(chunk);
        });

        stream.on('end', () => {
          const buffer = Buffer.concat(chunks);
          
          const response = new NextResponse(buffer, {
            status: 200,
            headers: {
              'Content-Type': contentType,
              'Content-Disposition': `attachment; filename="${filename}"`,
              'Content-Length': buffer.length.toString(),
            },
          });
          
          resolve(response);
        });

        stream.on('error', (error) => {
          console.error('Stream error:', error);
          reject(NextResponse.json(
            { error: 'Failed to download video' },
            { status: 500 }
          ));
        });
      });

    } else if (format === 'mp3') {
      // Download audio and convert to MP3
      const audioStream = ytdlCore(url, {
        quality: 'highestaudio',
        filter: (format: { hasVideo?: boolean; hasAudio?: boolean }) => {
          // Prefer audio-only formats
          return !!(format.hasAudio && !format.hasVideo);
        }
      });

      contentType = 'audio/mpeg';
      filename = `${title}.mp3`;

      // Convert audio to MP3 using ffmpeg
      return new Promise<NextResponse>((resolve, reject) => {
        const chunks: Buffer[] = [];
        const passThrough = new PassThrough();

        // Set up ffmpeg conversion
        const ffmpegCommand = ffmpeg(audioStream)
          .audioCodec('libmp3lame')
          .audioBitrate(quality.replace('kbps', ''))
          .format('mp3')
          .on('error', (err) => {
            console.error('FFmpeg error:', err);
            reject(NextResponse.json(
              { error: 'Failed to convert audio to MP3' },
              { status: 500 }
            ));
          })
          .on('end', () => {
            console.log('FFmpeg conversion completed');
          });

        // Pipe the converted audio to our PassThrough stream
        ffmpegCommand.pipe(passThrough);

        // Collect the converted data
        passThrough.on('data', (chunk) => {
          chunks.push(chunk);
        });

        passThrough.on('end', () => {
          const buffer = Buffer.concat(chunks);
          
          const response = new NextResponse(buffer, {
            status: 200,
            headers: {
              'Content-Type': contentType,
              'Content-Disposition': `attachment; filename="${filename}"`,
              'Content-Length': buffer.length.toString(),
            },
          });
          
          resolve(response);
        });

        passThrough.on('error', (error) => {
          console.error('PassThrough error:', error);
          reject(NextResponse.json(
            { error: 'Failed to process converted audio' },
            { status: 500 }
          ));
        });
      });

    } else {
      return NextResponse.json({ error: 'Invalid format specified' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error downloading video:', error);
    return NextResponse.json(
      { error: 'Failed to download video' },
      { status: 500 }
    );
  }
} 