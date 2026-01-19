import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Copy, 
  Download, 
  FileJson, 
  FileText, 
  Check, 
  Image as ImageIcon,
  Eye,
  Play,
  Pause
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export interface VisualSegment {
  id: string;
  timestamp: number;
  endTime: number;
  text: string;
  visualDescription: string;
  thumbnailUrl?: string;
}

interface VisualTranscriptViewerProps {
  videoUrl: string;
  segments: VisualSegment[];
  onSegmentsChange?: (segments: VisualSegment[]) => void;
}

const VisualTranscriptViewer = ({ 
  videoUrl, 
  segments, 
  onSegmentsChange 
}: VisualTranscriptViewerProps) => {
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [showVisualCaptions, setShowVisualCaptions] = useState(true);
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const segmentRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const { toast } = useToast();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Update active segment based on video time
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      const activeSegment = segments.find(
        seg => currentTime >= seg.timestamp && currentTime < seg.endTime
      );
      if (activeSegment && activeSegment.id !== activeSegmentId) {
        setActiveSegmentId(activeSegment.id);
        // Auto-scroll to active segment
        const segmentEl = segmentRefs.current.get(activeSegment.id);
        if (segmentEl) {
          segmentEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [segments, activeSegmentId]);

  const handleSegmentClick = (segment: VisualSegment) => {
    if (videoRef.current) {
      videoRef.current.currentTime = segment.timestamp;
      videoRef.current.play();
      setActiveSegmentId(segment.id);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const getFullText = (): string => {
    return segments
      .map((seg) => `[${formatTime(seg.timestamp)}] ${seg.text}${showVisualCaptions ? `\n  Visual: ${seg.visualDescription}` : ""}`)
      .join("\n\n");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getFullText());
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Visual transcript has been copied.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([getFullText()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "visual-transcript.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Download started",
      description: "Your TXT file is being downloaded.",
    });
  };

  const handleDownloadJson = () => {
    const jsonData = {
      segments: segments.map(seg => ({
        timestamp: seg.timestamp,
        endTime: seg.endTime,
        text: seg.text,
        visualDescription: seg.visualDescription,
      })),
      metadata: {
        totalSegments: segments.length,
        exportedAt: new Date().toISOString(),
      }
    };
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "visual-transcript.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Download started",
      description: "Your JSON file is being downloaded.",
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 bg-secondary/50 rounded-xl border border-border">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="thumbnails"
              checked={showThumbnails}
              onCheckedChange={setShowThumbnails}
            />
            <Label htmlFor="thumbnails" className="flex items-center gap-2 cursor-pointer text-sm">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              Thumbnails
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="visual-captions"
              checked={showVisualCaptions}
              onCheckedChange={setShowVisualCaptions}
            />
            <Label htmlFor="visual-captions" className="flex items-center gap-2 cursor-pointer text-sm">
              <Eye className="h-4 w-4 text-muted-foreground" />
              Visual Descriptions
            </Label>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadTxt} className="gap-2">
            <FileText className="h-4 w-4" />
            TXT
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadJson} className="gap-2">
            <FileJson className="h-4 w-4" />
            JSON
          </Button>
        </div>
      </div>

      {/* Main Content - Video + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Video Player */}
        <div className="relative">
          <div className="sticky top-24 space-y-3">
            <div className="aspect-video bg-black rounded-xl overflow-hidden border border-border">
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-contain"
                controls
              />
            </div>
            <Button
              variant="secondary"
              onClick={togglePlayPause}
              className="w-full gap-2"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Play
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Visual Timeline */}
        <ScrollArea className="h-[600px] rounded-xl border border-border bg-card">
          <div className="p-4 space-y-3">
            {segments.length > 0 ? (
              segments.map((segment) => (
                <div
                  key={segment.id}
                  ref={(el) => {
                    if (el) segmentRefs.current.set(segment.id, el);
                  }}
                  onClick={() => handleSegmentClick(segment)}
                  className={cn(
                    "p-4 rounded-xl border cursor-pointer transition-all duration-200",
                    activeSegmentId === segment.id
                      ? "border-primary bg-primary/5 shadow-glow"
                      : "border-border hover:border-primary/50 hover:bg-secondary/30"
                  )}
                >
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    {showThumbnails && (
                      <div className="shrink-0 w-24 h-16 bg-secondary rounded-lg overflow-hidden flex items-center justify-center">
                        {segment.thumbnailUrl ? (
                          <img 
                            src={segment.thumbnailUrl} 
                            alt="Frame" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-xs text-muted-foreground text-center px-2">
                            Frame at {formatTime(segment.timestamp)}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Timestamp */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {formatTime(segment.timestamp)}
                        </span>
                        {activeSegmentId === segment.id && (
                          <span className="flex items-center gap-1 text-xs text-primary">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                            Playing
                          </span>
                        )}
                      </div>

                      {/* Spoken Text */}
                      <p className="text-sm text-foreground leading-relaxed mb-2">
                        {segment.text}
                      </p>

                      {/* Visual Description */}
                      {showVisualCaptions && segment.visualDescription && (
                        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-secondary/50 rounded-lg p-2">
                          <Eye className="h-3.5 w-3.5 shrink-0 mt-0.5 text-accent" />
                          <span className="italic">{segment.visualDescription}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                <Eye className="h-12 w-12 mb-4 opacity-50" />
                <p>No visual transcript available yet</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <span>{segments.length} segments</span>
        <span className="w-1 h-1 bg-muted-foreground rounded-full" />
        <span>{segments.reduce((acc, s) => acc + s.text.split(" ").length, 0)} words</span>
        <span className="w-1 h-1 bg-muted-foreground rounded-full" />
        <span>
          {segments.length > 0 
            ? formatTime(segments[segments.length - 1]?.endTime || 0) 
            : "0:00"} duration
        </span>
      </div>
    </div>
  );
};

export default VisualTranscriptViewer;
