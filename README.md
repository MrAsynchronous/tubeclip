# TubeClip - YouTube Video Downloader

A simple and elegant web application for downloading YouTube videos as MP3 or MP4 files.

## Features

- 🎥 Download YouTube videos in MP4 format
- 🎵 Extract audio and convert to MP3 format
- 📱 Responsive design that works on all devices
- 🌙 Dark mode support
- ⚡ Fast and efficient downloading
- 🎯 Multiple quality options for both video and audio

## Quality Options

### Video (MP4)
- 720p
- 1080p
- 1440p
- 2160p (4K)

### Audio (MP3)
- 128kbps
- 192kbps  
- 320kbps

**Note**: Audio is extracted from YouTube and converted to MP3 format using FFmpeg for maximum compatibility across all devices and media players.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- FFmpeg (required for MP3 conversion)
  - **macOS**: `brew install ffmpeg`
  - **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/download.html)
  - **Linux**: `sudo apt install ffmpeg` (Ubuntu/Debian) or `sudo yum install ffmpeg` (CentOS/RHEL)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd tubeclip
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Paste a YouTube URL into the input field
2. Click "Analyze" to fetch video information
3. Choose your preferred format (MP3 or MP4)
4. Select the quality/bitrate
5. Click "Download" to start the download

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **YouTube Processing**: ytdl-core

## Important Notes

- This application is for educational purposes only
- Please respect copyright laws and only download content you have permission to use
- Some videos may not be available for download due to YouTube's restrictions
- Large files may take some time to process and download

## Development

### Project Structure

```
tubeclip/
├── app/
│   ├── api/
│   │   ├── video-info/
│   │   │   └── route.ts      # API for fetching video information
│   │   └── download/
│   │       └── route.ts      # API for downloading videos
│   ├── globals.css           # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page component
├── public/                  # Static assets
├── package.json
└── README.md
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. Please ensure you comply with YouTube's Terms of Service and applicable copyright laws.

## Disclaimer

This tool is provided as-is for educational purposes. The developers are not responsible for any misuse of this application. Users are responsible for ensuring they have the right to download and use any content they access through this tool.
