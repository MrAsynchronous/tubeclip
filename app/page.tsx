'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Download, Music, Video, AlertCircle, CheckCircle2, Loader2, Play } from 'lucide-react';

type Format = 'mp3' | 'mp4' | null;

interface VideoInfo {
  title: string;
  duration: string;
  thumbnail: string;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState<Format>(null);
  const [audioQuality, setAudioQuality] = useState([1]); // 0=128kbps, 1=192kbps, 2=320kbps
  const [videoQuality, setVideoQuality] = useState([1]); // 0=720p, 1=1080p, 2=1440p, 3=2160p
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [error, setError] = useState('');
  const [downloadProgress, setDownloadProgress] = useState(0);

  const validateYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)/;
    return youtubeRegex.test(url);
  };

  const audioQualityOptions = ['128kbps', '192kbps', '320kbps'];
  const videoQualityOptions = ['720p', '1080p', '1440p', '2160p'];

  const getSelectedQuality = () => {
    if (format === 'mp3') {
      return audioQualityOptions[audioQuality[0]];
    } else if (format === 'mp4') {
      return videoQualityOptions[videoQuality[0]];
    }
    return '';
  };

  const handleUrlSubmit = async () => {
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    if (!validateYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/video-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch video information');
      }

      const data = await response.json();
      setVideoInfo(data);
    } catch {
      setError('Failed to fetch video information. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    const selectedQuality = getSelectedQuality();
    if (!format || !selectedQuality) {
      setError('Please select format and quality');
      return;
    }

    setIsLoading(true);
    setError('');
    setDownloadProgress(0);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 500);

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, format, quality: selectedQuality }),
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      setDownloadProgress(100);
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${videoInfo?.title || 'video'}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch {
      setError('Download failed. Please try again.');
    } finally {
      clearInterval(progressInterval);
      setIsLoading(false);
      setDownloadProgress(0);
    }
  };

  const resetForm = () => {
    setUrl('');
    setFormat(null);
    setQuality('');
    setAudioQuality([1]);
    setVideoQuality([1]);
    setVideoInfo(null);
    setError('');
    setDownloadProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
              <Download className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TubeClip
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Download YouTube videos as high-quality MP4 files or extract audio as MP3 with professional-grade conversion
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* URL Input Card */}
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-blue-600" />
                Enter YouTube URL
              </CardTitle>
              <CardDescription>
                Paste any YouTube video URL to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">YouTube URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={handleUrlSubmit} 
                    disabled={isLoading || !url.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Analyze
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Video Info Card */}
          {videoInfo && (
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-green-600" />
                  Video Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="relative overflow-hidden rounded-lg">
                    <Image
                      src={videoInfo.thumbnail}
                      alt="Video thumbnail"
                      width={160}
                      height={90}
                      className="object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                      {videoInfo.duration}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg leading-tight mb-2">
                      {videoInfo.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="secondary">Duration: {videoInfo.duration}</Badge>
                      <Badge variant="outline">Ready to download</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Format Selection */}
          {videoInfo && (
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Choose Format</CardTitle>
                <CardDescription>
                  Select the output format for your download
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      format === 'mp3' 
                        ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                                         onClick={() => {
                       setFormat('mp3');
                       setQuality('');
                       setAudioQuality([1]); // Reset to 192kbps
                     }}
                  >
                    <CardContent className="p-6 text-center">
                      <Music className="h-8 w-8 mx-auto mb-3 text-green-600" />
                      <h3 className="font-semibold text-lg mb-2">MP3 Audio</h3>
                      <p className="text-sm text-muted-foreground">
                        Extract high-quality audio only
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        Audio Only
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      format === 'mp4' 
                        ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                                         onClick={() => {
                       setFormat('mp4');
                       setQuality('');
                       setVideoQuality([1]); // Reset to 1080p
                     }}
                  >
                    <CardContent className="p-6 text-center">
                      <Video className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                      <h3 className="font-semibold text-lg mb-2">MP4 Video</h3>
                      <p className="text-sm text-muted-foreground">
                        Download video with audio
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        Video + Audio
                      </Badge>
                    </CardContent>
                  </Card>
                </div>

                {/* Quality Selection */}
                {format && (
                  <div className="space-y-4">
                    <Separator />
                    <div>
                      <Label className="text-base font-semibold">
                        Select Quality
                      </Label>
                      <p className="text-sm text-muted-foreground mb-4">
                        Choose the {format === 'mp3' ? 'bitrate' : 'resolution'} for your download
                      </p>
                      
                                             {format === 'mp3' ? (
                         <div className="space-y-6">
                           <div className="space-y-4">
                             <div className="flex justify-between items-center">
                               <span className="text-sm font-medium">Audio Bitrate</span>
                               <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                 {audioQualityOptions[audioQuality[0]]}
                               </Badge>
                             </div>
                             <Slider
                               value={audioQuality}
                               onValueChange={setAudioQuality}
                               max={2}
                               min={0}
                               step={1}
                               className="w-full"
                             />
                             <div className="flex justify-between text-xs text-muted-foreground">
                               <span>128 kbps<br/>Good</span>
                               <span>192 kbps<br/>High</span>
                               <span>320 kbps<br/>Premium</span>
                             </div>
                           </div>
                         </div>
                       ) : (
                         <div className="space-y-6">
                           <div className="space-y-4">
                             <div className="flex justify-between items-center">
                               <span className="text-sm font-medium">Video Resolution</span>
                               <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                 {videoQualityOptions[videoQuality[0]]}
                               </Badge>
                             </div>
                             <Slider
                               value={videoQuality}
                               onValueChange={setVideoQuality}
                               max={3}
                               min={0}
                               step={1}
                               className="w-full"
                             />
                             <div className="flex justify-between text-xs text-muted-foreground">
                               <span>720p<br/>HD</span>
                               <span>1080p<br/>FHD</span>
                               <span>1440p<br/>QHD</span>
                               <span>4K<br/>UHD</span>
                             </div>
                           </div>
                         </div>
                       )}
                    </div>
                  </div>
                )}

                                 {/* Download Section */}
                 {format && (
                  <div className="space-y-4">
                    <Separator />
                    
                    {downloadProgress > 0 && downloadProgress < 100 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Converting and downloading...</span>
                          <span>{Math.round(downloadProgress)}%</span>
                        </div>
                        <Progress value={downloadProgress} className="h-2" />
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button 
                        onClick={handleDownload}
                        disabled={isLoading}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12"
                        size="lg"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            {format === 'mp3' ? 'Converting to MP3...' : 'Downloading...'}
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-5 w-5" />
                            Download {format.toUpperCase()} ({getSelectedQuality()})
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={resetForm}
                        className="h-12"
                        size="lg"
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 space-y-4">
          <Separator className="my-8" />
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Please respect copyright laws and only download content you have permission to use.</p>
            <p>Audio files are converted to MP3 format using FFmpeg for maximum compatibility.</p>
          </div>
          <div className="flex justify-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline">Powered by FFmpeg</Badge>
            <Badge variant="outline">Built with Next.js</Badge>
            <Badge variant="outline">Styled with ShadCN</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
